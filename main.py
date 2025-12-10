import contextlib
import io
import math
import os
import sqlite3
from datetime import datetime
try:
    import resource
except ImportError:  # pragma: no cover - Windows環境では resource が利用できない
    resource = None  # type: ignore[assignment]
import time
import traceback
from multiprocessing import Process, Queue
from pathlib import Path
from typing import Any, Dict, Optional

import numpy as np
from bokeh.embed import json_item
from bokeh.models import LayoutDOM
from bokeh.plotting import ColumnDataSource, figure
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from markdown import markdown
from pydantic import BaseModel

from database import (
    UserRecord,
    create_session,
    create_user,
    delete_session,
    delete_user_by_id,
    fetch_user_credentials,
    get_user_by_token,
    get_execution_time_since,
    get_last_program_run_time,
    get_oldest_run_within_window,
    get_user_unlocks,
    has_unlocked,
    init_db,
    list_program_runs_by_user_id,
    list_users,
    record_program_run,
    record_unlock,
    update_user,
    verify_password,
)

BASE_DIR = Path(__file__).resolve().parent
LESSON_DIR = BASE_DIR / "lessons"
STATIC_DIR = BASE_DIR / "static"

LESSON_PASSWORD = os.getenv("LESSON_PASSWORD", "8858")
EXECUTION_TIMEOUT = float(os.getenv("EXECUTION_TIMEOUT", "3.0"))
MEMORY_LIMIT_MB = int(os.getenv("EXECUTION_MEMORY_LIMIT_MB", "1024"))
MIN_EXECUTION_INTERVAL = float(os.getenv("MIN_EXECUTION_INTERVAL_SECONDS", "5.0"))
USER_CPU_BUDGET_SECONDS = float(os.getenv("USER_CPU_BUDGET_SECONDS", "15.0"))
USER_CPU_BUDGET_WINDOW_SECONDS = float(os.getenv("USER_CPU_BUDGET_WINDOW_SECONDS", "60.0"))


class CodeRequest(BaseModel):
    code: str


class MaterialUnlockRequest(BaseModel):
    password: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class UserCreateRequest(BaseModel):
    username: str
    password: str
    is_admin: bool = False


class UserUpdateRequest(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None


def _load_materials() -> list[dict[str, Any]]:
    materials: list[dict[str, Any]] = []
    if not LESSON_DIR.exists():
        return materials

    for idx, path in enumerate(sorted(LESSON_DIR.glob("*.md"))):
        text = path.read_text(encoding="utf-8")
        title = path.stem
        for line in text.splitlines():
            stripped = line.strip()
            if stripped.startswith("#"):
                title = stripped.lstrip("# ")
                break
        html = markdown(text, extensions=["fenced_code", "tables", "toc"])
        materials.append({"id": idx, "title": title, "content": html})
    return materials


MATERIALS = _load_materials()


security = HTTPBearer(auto_error=False)


def _user_payload(user: UserRecord) -> Dict[str, Any]:
    return {"id": user.id, "username": user.username, "is_admin": user.is_admin}


def _auth_payload(user: UserRecord, token: str) -> Dict[str, Any]:
    return {"token": token, "user": _user_payload(user), "unlocks": get_user_unlocks(user.id)}


def _ensure_admin(user: UserRecord) -> None:
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="管理者権限が必要です")


def _seconds_until_next_run(user_id: int, now: datetime) -> float:
    last_run = get_last_program_run_time(user_id)
    if last_run is None:
        return 0.0
    return max(0.0, MIN_EXECUTION_INTERVAL - (now - last_run).total_seconds())


def _seconds_until_cpu_budget_resets(user_id: int, now: datetime) -> float:
    if USER_CPU_BUDGET_SECONDS <= 0:
        return 0.0
    recent_cpu_usage = get_execution_time_since(user_id, USER_CPU_BUDGET_WINDOW_SECONDS)
    if recent_cpu_usage < USER_CPU_BUDGET_SECONDS:
        return 0.0
    oldest_run = get_oldest_run_within_window(user_id, USER_CPU_BUDGET_WINDOW_SECONDS)
    if oldest_run is None:
        return MIN_EXECUTION_INTERVAL
    elapsed = (now - oldest_run).total_seconds()
    return max(1.0, USER_CPU_BUDGET_WINDOW_SECONDS - elapsed)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> UserRecord:
    if credentials is None:
        raise HTTPException(status_code=401, detail="認証情報が必要です")
    user = get_user_by_token(credentials.credentials)
    if user is None:
        raise HTTPException(status_code=401, detail="認証情報が無効です")
    return user


def _allowed_builtins() -> Dict[str, Any]:
    safe_builtins: Dict[str, Any] = {
        "abs": abs,
        "all": all,
        "any": any,
        "enumerate": enumerate,
        "float": float,
        "int": int,
        "len": len,
        "list": list,
        "map": map,
        "max": max,
        "min": min,
        "pow": pow,
        "print": print,
        "range": range,
        "round": round,
        "sum": sum,
        "tuple": tuple,
        "zip": zip,
        "isinstance": isinstance,
        "issubclass": issubclass,
        "sorted": sorted,
        "reversed": reversed,
        "dict": dict,
        "set": set,
        "frozenset": frozenset,
        "type": type,
        "object": object,
    }
    # Allow class definitions
    try:
        safe_builtins["__build_class__"] = __build_class__  # type: ignore[name-defined]
    except NameError:
        pass
    safe_builtins["__import__"] = None
    return safe_builtins


def _create_environment() -> Dict[str, Any]:
    environment: Dict[str, Any] = {}

    def _set_default_plot(plot: LayoutDOM) -> LayoutDOM:
        environment["default_plot"] = plot
        environment["plot"] = plot
        return plot

    default_plot = _set_default_plot(figure(width=600, height=400, title="グラフ"))

    def _target_plot(target_plot: Optional[LayoutDOM]) -> LayoutDOM:
        if target_plot is not None:
            return target_plot
        return environment.get("default_plot", default_plot)

    def new_plot(title: str = "グラフ", width: int = 600, height: int = 400, **kwargs: Any) -> LayoutDOM:
        plot = figure(title=title, width=width, height=height, **kwargs)
        return _set_default_plot(plot)

    def plot_function(
        func,
        x_start: float = -10,
        x_end: float = 10,
        num: int = 400,
        target_plot: Optional[LayoutDOM] = None,
        line_color: str = "#1f77b4",
        legend_label: Optional[str] = None,
    ) -> LayoutDOM:
        target = _target_plot(target_plot)
        xs = np.linspace(x_start, x_end, num)
        ys = []
        for x in xs:
            try:
                ys.append(func(float(x)))
            except Exception:
                ys.append(float("nan"))
        target.line(xs, ys, color=line_color, line_width=2, legend_label=legend_label)
        return target

    def plot_points(
        x_values,
        y_values,
        target_plot: Optional[LayoutDOM] = None,
        size: int = 8,
        marker: str = "circle",
        color: str = "#d62728",
        legend_label: Optional[str] = None,
    ) -> LayoutDOM:
        target = _target_plot(target_plot)
        source = ColumnDataSource({"x": list(x_values), "y": list(y_values)})
        glyph = getattr(target, marker, None)
        if callable(glyph):
            glyph("x", "y", source=source, size=size, color=color, legend_label=legend_label)
        else:
            target.circle("x", "y", source=source, size=size, color=color, legend_label=legend_label)
        return target

    def plot_parametric(
        x_func,
        y_func,
        t_start: float = -10,
        t_end: float = 10,
        num: int = 400,
        target_plot: Optional[LayoutDOM] = None,
        line_color: str = "#2ca02c",
        legend_label: Optional[str] = None,
    ) -> LayoutDOM:
        target = _target_plot(target_plot)
        ts = np.linspace(t_start, t_end, num)
        xs = []
        ys = []
        for t in ts:
            try:
                xs.append(x_func(float(t)))
                ys.append(y_func(float(t)))
            except Exception:
                xs.append(float("nan"))
                ys.append(float("nan"))
        target.line(xs, ys, color=line_color, line_width=2, legend_label=legend_label)
        return target

    environment.update(
        {
            "__builtins__": _allowed_builtins(),
            "math": math,
            "np": np,
            "numpy": np,
            "new_plot": new_plot,
            "plot_function": plot_function,
            "plot_parametric": plot_parametric,
            "plot_points": plot_points,
            "figure": figure,
            "ColumnDataSource": ColumnDataSource,
        }
    )
    return environment


def _limit_system_resources() -> None:
    if resource is None:
        return
    # Limit CPU time to avoid long running scripts
    resource.setrlimit(resource.RLIMIT_CPU, (int(EXECUTION_TIMEOUT), int(EXECUTION_TIMEOUT)))
    # Limit memory usage
    limit_bytes = MEMORY_LIMIT_MB * 1024 * 1024
    resource.setrlimit(resource.RLIMIT_AS, (limit_bytes, limit_bytes))
    # Limit number of open files
    resource.setrlimit(resource.RLIMIT_NOFILE, (64, 64))


def _execute_user_code(code: str, queue: Queue) -> None:
    _limit_system_resources()
    env = _create_environment()
    stdout_buffer = io.StringIO()
    stderr_buffer = io.StringIO()

    start = time.perf_counter()
    try:
        with contextlib.redirect_stdout(stdout_buffer), contextlib.redirect_stderr(stderr_buffer):  # type: ignore[name-defined]
            exec(code, env, env)
        plot_candidate = None
        for key in ("plot", "fig", "figure", "p", "default_plot"):
            value = env.get(key)
            if isinstance(value, LayoutDOM):
                if getattr(value, "renderers", []):
                    plot_candidate = value
                    break
                if plot_candidate is None:
                    plot_candidate = value
        if plot_candidate is None:
            default_plot = env.get("default_plot")
            if isinstance(default_plot, LayoutDOM) and getattr(default_plot, "renderers", []):
                plot_candidate = default_plot
        elif not getattr(plot_candidate, "renderers", []):
            plot_candidate = None
        json_plot = json_item(plot_candidate, "bokeh-plot") if plot_candidate is not None else None
        duration = time.perf_counter() - start
        queue.put(
            {
                "success": True,
                "plot": json_plot,
                "stdout": stdout_buffer.getvalue(),
                "stderr": stderr_buffer.getvalue(),
                "execution_time": duration,
            }
        )
    except Exception as exc:  # noqa: BLE001
        duration = time.perf_counter() - start
        queue.put(
            {
                "success": False,
                "plot": None,
                "stdout": stdout_buffer.getvalue(),
                "stderr": stderr_buffer.getvalue() + "\n" + traceback.format_exc(),
                "execution_time": duration,
            }
        )


def execute_code(code: str) -> Dict[str, Any]:
    queue: Queue = Queue()
    process = Process(target=_execute_user_code, args=(code, queue))
    process.start()
    process.join(EXECUTION_TIMEOUT)
    if process.is_alive():
        process.terminate()
        process.join()
        return {
            "success": False,
            "plot": None,
            "stdout": "",
            "stderr": "処理がタイムアウトしました。コードが長時間実行されていないか確認してください。",
            "execution_time": EXECUTION_TIMEOUT,
        }
    if not queue.empty():
        return queue.get()
    return {
        "success": False,
        "plot": None,
        "stdout": "",
        "stderr": "結果の取得中に問題が発生しました。",
        "execution_time": 0.0,
    }


app = FastAPI(title="hibikicode-math")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/")
def root() -> FileResponse:
    index_file = STATIC_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="index.html が見つかりません")
    return FileResponse(index_file)


@app.post("/api/auth/login")
async def login(request: LoginRequest) -> Dict[str, Any]:
    username = request.username.strip()
    password = request.password
    if not username or not password:
        raise HTTPException(status_code=400, detail="ユーザー名とパスワードを入力してください")
    record = fetch_user_credentials(username)
    if record is None or not verify_password(password, record["password_hash"]):
        raise HTTPException(status_code=401, detail="ユーザー名またはパスワードが正しくありません")
    user = UserRecord(id=record["id"], username=record["username"], is_admin=bool(record["is_admin"]))
    token = create_session(user.id)
    return _auth_payload(user, token)


@app.post("/api/auth/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, str]:
    if credentials is None:
        raise HTTPException(status_code=401, detail="認証情報が必要です")
    delete_session(credentials.credentials)
    return {"status": "ok"}


@app.get("/api/auth/me")
async def auth_me(current_user: UserRecord = Depends(get_current_user)) -> Dict[str, Any]:
    return {"user": _user_payload(current_user), "unlocks": get_user_unlocks(current_user.id)}


@app.post("/api/execute")
async def run_code(request: CodeRequest, current_user: UserRecord = Depends(get_current_user)) -> JSONResponse:
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="コードが空です")
    now = datetime.utcnow()

    wait_seconds = _seconds_until_next_run(current_user.id, now)
    if wait_seconds > 0:
        retry_after = math.ceil(wait_seconds)
        raise HTTPException(
            status_code=429,
            detail=f"連続実行は {int(MIN_EXECUTION_INTERVAL)} 秒間隔です。あと {retry_after} 秒お待ちください。",
            headers={"Retry-After": str(retry_after)},
        )

    cpu_wait_seconds = _seconds_until_cpu_budget_resets(current_user.id, now)
    if cpu_wait_seconds > 0:
        retry_after = math.ceil(cpu_wait_seconds)
        limit_window = int(USER_CPU_BUDGET_WINDOW_SECONDS)
        limit_budget = int(USER_CPU_BUDGET_SECONDS)
        raise HTTPException(
            status_code=429,
            detail=(
                f"CPU使用量の上限に達しました。{limit_window} 秒間に {limit_budget} 秒まで利用できます。"
                f"あと {retry_after} 秒お待ちください。"
            ),
            headers={"Retry-After": str(retry_after)},
        )
    result = execute_code(request.code)
    record_program_run(
        current_user.id,
        request.code,
        result.get("stdout", ""),
        result.get("stderr", ""),
        bool(result.get("success")),
        float(result.get("execution_time", 0.0)),
    )
    return JSONResponse(result)


@app.get("/api/programs/history")
async def get_program_history(
    limit: int = 20, current_user: UserRecord = Depends(get_current_user)
) -> Dict[str, Any]:
    safe_limit = max(1, min(limit, 100))
    history = list_program_runs_by_user_id(current_user.id, safe_limit)
    return {"history": history}


@app.get("/api/materials")
async def get_materials(_: UserRecord = Depends(get_current_user)) -> Dict[str, Any]:
    return {"materials": [{"id": m["id"], "title": m["title"]} for m in MATERIALS]}


@app.get("/api/materials/{material_id}")
async def get_material(material_id: int, current_user: UserRecord = Depends(get_current_user)) -> Dict[str, Any]:
    if material_id < 0 or material_id >= len(MATERIALS):
        raise HTTPException(status_code=404, detail="教材が見つかりません")
    if material_id == 0 or current_user.is_admin or has_unlocked(current_user.id, material_id):
        return MATERIALS[material_id]
    raise HTTPException(status_code=403, detail="この教材を閲覧するにはパスワードが必要です")


@app.post("/api/materials/{material_id}/unlock")
async def unlock_material(
    material_id: int,
    request: MaterialUnlockRequest,
    current_user: UserRecord = Depends(get_current_user),
) -> Dict[str, Any]:
    if material_id < 0 or material_id >= len(MATERIALS):
        raise HTTPException(status_code=404, detail="教材が見つかりません")
    if material_id == 0:
        return MATERIALS[material_id]
    if has_unlocked(current_user.id, material_id):
        return MATERIALS[material_id]
    if (request.password or "").strip() == LESSON_PASSWORD:
        record_unlock(current_user.id, material_id)
        return MATERIALS[material_id]
    raise HTTPException(status_code=403, detail="パスワードが正しくありません")


@app.get("/api/admin/users")
async def admin_list_users(current_user: UserRecord = Depends(get_current_user)) -> Dict[str, Any]:
    _ensure_admin(current_user)
    users = list_users()
    for user in users:
        user["is_admin"] = bool(user.get("is_admin"))
    return {"users": users}


@app.post("/api/admin/users")
async def admin_create_user(
    request: UserCreateRequest, current_user: UserRecord = Depends(get_current_user)
) -> Dict[str, Any]:
    _ensure_admin(current_user)
    username = request.username.strip()
    password = request.password
    if not username or not password:
        raise HTTPException(status_code=400, detail="ユーザー名とパスワードは必須です")
    try:
        user_id = create_user(username, password, is_admin=request.is_admin)
    except sqlite3.IntegrityError as exc:  # pragma: no cover - uniqueness constraint
        raise HTTPException(status_code=400, detail="同じユーザー名が既に存在します") from exc
    return {"user": {"id": user_id, "username": username, "is_admin": request.is_admin}}


@app.put("/api/admin/users/{user_id}")
async def admin_update_user(
    user_id: int,
    request: UserUpdateRequest,
    current_user: UserRecord = Depends(get_current_user),
) -> Dict[str, str]:
    _ensure_admin(current_user)
    payload = request.dict(exclude_unset=True)
    if not payload:
        raise HTTPException(status_code=400, detail="更新する項目がありません")
    try:
        updated = update_user(
            user_id,
            username=payload.get("username"),
            password=payload.get("password"),
            is_admin=payload.get("is_admin"),
        )
    except sqlite3.IntegrityError as exc:  # pragma: no cover - uniqueness constraint
        raise HTTPException(status_code=400, detail="同じユーザー名が既に存在します") from exc
    if not updated:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return {"status": "ok"}


@app.delete("/api/admin/users/{user_id}")
async def admin_delete_user(
    user_id: int, current_user: UserRecord = Depends(get_current_user)
) -> Dict[str, str]:
    _ensure_admin(current_user)
    if not delete_user_by_id(user_id):
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return {"status": "ok"}


@app.get("/api/status")
async def status() -> Dict[str, str]:
    return {"status": "ok"}