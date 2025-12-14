from __future__ import annotations

import os
import secrets
import sqlite3
from contextlib import closing
from dataclasses import dataclass
from datetime import datetime
from hashlib import pbkdf2_hmac
from pathlib import Path
from typing import Iterable, List, Optional

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "app.db"

PASSWORD_ITERATIONS = 390000
SALT_BYTES = 16


@dataclass
class UserRecord:
    id: int
    username: str
    is_admin: bool


def _ensure_data_dir() -> None:
    """データベースファイルの保存先ディレクトリを作成する。"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def get_connection() -> sqlite3.Connection:
    """
    SQLite への接続を返すヘルパー。フォルダ作成・外部キー有効化までをセットで行う。
    呼び出し側は closing と組み合わせて安全に接続を閉じる。
    """
    _ensure_data_dir()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def hash_password(password: str, *, salt: Optional[bytes] = None) -> str:
    """
    PBKDF2-HMAC を使ってパスワードをハッシュ化する。ソルトと反復回数を含めて保存する。

    salt が渡されない場合は安全な乱数で新規生成する。
    """
    if salt is None:
        salt = os.urandom(SALT_BYTES)
    dk = pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_ITERATIONS)
    return f"{PASSWORD_ITERATIONS}${salt.hex()}${dk.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    """
    保存されたハッシュ文字列を解析し、入力パスワードと照合する。

    フォーマットが不正な場合は False を返して安全側に倒す。
    """
    try:
        iterations_str, salt_hex, hash_hex = stored_hash.split("$")
        iterations = int(iterations_str)
        salt = bytes.fromhex(salt_hex)
    except (ValueError, TypeError):
        return False
    candidate = pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    return secrets.compare_digest(candidate.hex(), hash_hex)


def init_db() -> None:
    """
    データベースを初期化し、必要なテーブルが無ければ作成する。

    初回起動時にはデフォルト管理者 (admin/admin) を登録して、
    管理画面に入れる最低限のアカウントを用意する。
    """
    _ensure_data_dir()
    with closing(get_connection()) as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_admin INTEGER NOT NULL DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS program_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                code TEXT NOT NULL,
                stdout TEXT,
                stderr TEXT,
                success INTEGER NOT NULL,
                execution_time REAL NOT NULL DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS unlocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                material_id INTEGER NOT NULL,
                unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, material_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                last_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            """
        )
        conn.commit()

        existing_admin = conn.execute(
            "SELECT id FROM users WHERE username = ?", ("admin",)
        ).fetchone()
        if existing_admin is None:
            password_hash = hash_password("admin")
            conn.execute(
                "INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, 1)",
                ("admin", password_hash),
            )
            conn.commit()


def get_user_by_username(username: str) -> Optional[UserRecord]:
    with closing(get_connection()) as conn:
        row = conn.execute(
            "SELECT id, username, is_admin FROM users WHERE username = ?",
            (username,),
        ).fetchone()
        if row is None:
            return None
        return UserRecord(id=row["id"], username=row["username"], is_admin=bool(row["is_admin"]))


def fetch_user_credentials(username: str) -> Optional[sqlite3.Row]:
    """ログイン時の認証用に、ハッシュされたパスワードを含む行を取得する。"""
    with closing(get_connection()) as conn:
        return conn.execute(
            "SELECT id, username, password_hash, is_admin FROM users WHERE username = ?",
            (username,),
        ).fetchone()


def create_user(username: str, password: str, *, is_admin: bool = False) -> int:
    """
    新規ユーザーを追加し、そのレコードIDを返す。呼び出し元で例外を握り、
    一意制約エラーなどを適切な HTTP 応答に変換する前提となっている。
    """
    password_hash = hash_password(password)
    with closing(get_connection()) as conn:
        cursor = conn.execute(
            "INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)",
            (username, password_hash, 1 if is_admin else 0),
        )
        conn.commit()
        return cursor.lastrowid


def update_user(
    user_id: int,
    *,
    username: Optional[str] = None,
    password: Optional[str] = None,
    is_admin: Optional[bool] = None,
) -> bool:
    """
    ユーザーの任意の項目を更新する。更新対象が空の場合は False を返す。

    渡された値のみを UPDATE 文に組み立てることで、最小限の変更にとどめる。
    """
    updates: list[str] = []
    params: list[object] = []
    if username is not None:
        updates.append("username = ?")
        params.append(username)
    if password is not None:
        updates.append("password_hash = ?")
        params.append(hash_password(password))
    if is_admin is not None:
        updates.append("is_admin = ?")
        params.append(1 if is_admin else 0)
    if not updates:
        return False
    params.append(user_id)
    with closing(get_connection()) as conn:
        cursor = conn.execute(
            f"UPDATE users SET {', '.join(updates)} WHERE id = ?",
            tuple(params),
        )
        conn.commit()
        return cursor.rowcount > 0


def update_user_password(username: str, password: str) -> bool:
    """ユーザー名をキーにパスワードだけを更新する簡易ヘルパー。"""
    password_hash = hash_password(password)
    with closing(get_connection()) as conn:
        cursor = conn.execute(
            "UPDATE users SET password_hash = ? WHERE username = ?",
            (password_hash, username),
        )
        conn.commit()
        return cursor.rowcount > 0


def delete_user(username: str) -> bool:
    """ユーザー名指定でレコードを削除し、成功可否を返す。"""
    with closing(get_connection()) as conn:
        cursor = conn.execute("DELETE FROM users WHERE username = ?", (username,))
        conn.commit()
        return cursor.rowcount > 0


def delete_user_by_id(user_id: int) -> bool:
    """ユーザーID指定でレコードを削除し、成功可否を返す。"""
    with closing(get_connection()) as conn:
        cursor = conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
        return cursor.rowcount > 0


def list_users() -> List[dict]:
    with closing(get_connection()) as conn:
        rows = conn.execute(
            "SELECT id, username, is_admin, created_at FROM users ORDER BY id"
        ).fetchall()
        return [dict(row) for row in rows]


def create_session(user_id: int) -> str:
    token = secrets.token_hex(32)
    with closing(get_connection()) as conn:
        conn.execute(
            "INSERT INTO sessions (token, user_id) VALUES (?, ?)",
            (token, user_id),
        )
        conn.commit()
    return token


def delete_session(token: str) -> None:
    with closing(get_connection()) as conn:
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()


def get_user_by_token(token: str) -> Optional[UserRecord]:
    with closing(get_connection()) as conn:
        row = conn.execute(
            """
            SELECT users.id, users.username, users.is_admin
            FROM sessions
            JOIN users ON sessions.user_id = users.id
            WHERE sessions.token = ?
            """,
            (token,),
        ).fetchone()
        if row is None:
            return None
        conn.execute(
            "UPDATE sessions SET last_seen_at = CURRENT_TIMESTAMP WHERE token = ?",
            (token,),
        )
        conn.commit()
        return UserRecord(id=row["id"], username=row["username"], is_admin=bool(row["is_admin"]))


def record_program_run(
    user_id: int,
    code: str,
    stdout: str,
    stderr: str,
    success: bool,
    execution_time: float,
) -> None:
    with closing(get_connection()) as conn:
        conn.execute(
            """
            INSERT INTO program_runs (user_id, code, stdout, stderr, success, execution_time)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (user_id, code, stdout, stderr, 1 if success else 0, execution_time),
        )
        conn.commit()


def record_unlock(user_id: int, material_id: int) -> None:
    with closing(get_connection()) as conn:
        conn.execute(
            "INSERT OR IGNORE INTO unlocks (user_id, material_id) VALUES (?, ?)",
            (user_id, material_id),
        )
        conn.commit()


def get_user_unlocks(user_id: int) -> List[int]:
    with closing(get_connection()) as conn:
        rows = conn.execute(
            "SELECT material_id FROM unlocks WHERE user_id = ? ORDER BY material_id",
            (user_id,),
        ).fetchall()
        return [int(row["material_id"]) for row in rows]


def has_unlocked(user_id: int, material_id: int) -> bool:
    with closing(get_connection()) as conn:
        row = conn.execute(
            "SELECT 1 FROM unlocks WHERE user_id = ? AND material_id = ?",
            (user_id, material_id),
        ).fetchone()
        return row is not None


def list_user_programs(username: str, limit: Optional[int] = None) -> List[dict]:
    with closing(get_connection()) as conn:
        user_row = conn.execute(
            "SELECT id FROM users WHERE username = ?",
            (username,),
        ).fetchone()
        if user_row is None:
            return []
        query = (
            "SELECT code, stdout, stderr, success, execution_time, created_at "
            "FROM program_runs WHERE user_id = ? ORDER BY created_at DESC"
        )
        params: Iterable = (user_row["id"],)
        if limit is not None:
            query += " LIMIT ?"
            params = (user_row["id"], limit)
        rows = conn.execute(query, params).fetchall()
        return [dict(row) for row in rows]


def _parse_timestamp(timestamp: str) -> Optional[datetime]:
    try:
        return datetime.fromisoformat(timestamp)
    except (TypeError, ValueError):
        return None


def get_last_program_run_time(user_id: int) -> Optional[datetime]:
    with closing(get_connection()) as conn:
        row = conn.execute(
            "SELECT created_at FROM program_runs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            (user_id,),
        ).fetchone()
        if row is None:
            return None
        return _parse_timestamp(row["created_at"])


def get_execution_time_since(user_id: int, window_seconds: float) -> float:
    with closing(get_connection()) as conn:
        row = conn.execute(
            """
            SELECT COALESCE(SUM(execution_time), 0) AS total
            FROM program_runs
            WHERE user_id = ?
              AND created_at >= datetime('now', ?)
            """,
            (user_id, f"-{int(window_seconds)} seconds"),
        ).fetchone()
        return float(row["total"] if row else 0.0)


def get_oldest_run_within_window(user_id: int, window_seconds: float) -> Optional[datetime]:
    with closing(get_connection()) as conn:
        row = conn.execute(
            """
            SELECT MIN(created_at) AS oldest
            FROM program_runs
            WHERE user_id = ?
              AND created_at >= datetime('now', ?)
            """,
            (user_id, f"-{int(window_seconds)} seconds"),
        ).fetchone()
        if row is None or row["oldest"] is None:
            return None
        return _parse_timestamp(row["oldest"])


def list_program_runs_by_user_id(
    user_id: int, limit: Optional[int] = None
) -> List[dict]:
    with closing(get_connection()) as conn:
        query = (
            "SELECT id, code, stdout, stderr, success, execution_time, created_at "
            "FROM program_runs WHERE user_id = ? ORDER BY created_at DESC"
        )
        params: Iterable = (user_id,)
        if limit is not None:
            query += " LIMIT ?"
            params = (user_id, limit)
        rows = conn.execute(query, params).fetchall()
        return [dict(row) for row in rows]


def list_user_unlocks(username: str) -> List[dict]:
    with closing(get_connection()) as conn:
        user_row = conn.execute(
            "SELECT id FROM users WHERE username = ?",
            (username,),
        ).fetchone()
        if user_row is None:
            return []
        rows = conn.execute(
            "SELECT material_id, unlocked_at FROM unlocks WHERE user_id = ? ORDER BY material_id",
            (user_row["id"],),
        ).fetchall()
        return [dict(row) for row in rows]
