#!/usr/bin/env python3
"""Command line helpers for managing hibikicode-math users and activity."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from database import (  # noqa: E402
    create_user,
    delete_user,
    init_db,
    list_user_programs,
    list_user_unlocks,
    list_users,
    update_user_password,
)


def cmd_list_users(args: argparse.Namespace) -> None:
    users = list_users()
    if not users:
        print("No users found.")
        return
    for user in users:
        role = "admin" if user["is_admin"] else "user"
        print(f"[{user['id']}] {user['username']} ({role}) created_at={user['created_at']}")


def cmd_create_user(args: argparse.Namespace) -> None:
    user_id = create_user(args.username, args.password, is_admin=args.admin)
    print(f"Created user '{args.username}' with id {user_id}")


def cmd_update_password(args: argparse.Namespace) -> None:
    updated = update_user_password(args.username, args.password)
    if not updated:
        print(f"User '{args.username}' not found", file=sys.stderr)
        sys.exit(1)
    print(f"Updated password for '{args.username}'")


def cmd_delete_user(args: argparse.Namespace) -> None:
    deleted = delete_user(args.username)
    if not deleted:
        print(f"User '{args.username}' not found", file=sys.stderr)
        sys.exit(1)
    print(f"Deleted user '{args.username}'")


def cmd_list_programs(args: argparse.Namespace) -> None:
    runs = list_user_programs(args.username, limit=args.limit)
    if not runs:
        print("No program runs found.")
        return
    for run in runs:
        payload = {
            "created_at": run["created_at"],
            "success": bool(run["success"]),
            "execution_time": run["execution_time"],
            "stdout": run["stdout"],
            "stderr": run["stderr"],
            "code": run["code"],
        }
        print(json.dumps(payload, ensure_ascii=False, indent=2))


def cmd_list_unlocks(args: argparse.Namespace) -> None:
    unlocks = list_user_unlocks(args.username)
    if not unlocks:
        print("No unlocks found.")
        return
    for entry in unlocks:
        print(f"material {entry['material_id']} unlocked_at={entry['unlocked_at']}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("list-users", help="List all users").set_defaults(func=cmd_list_users)

    create_parser = sub.add_parser("create-user", help="Create a new user")
    create_parser.add_argument("username")
    create_parser.add_argument("password")
    create_parser.add_argument("--admin", action="store_true", help="Create an admin account")
    create_parser.set_defaults(func=cmd_create_user)

    update_parser = sub.add_parser("update-password", help="Update an existing user's password")
    update_parser.add_argument("username")
    update_parser.add_argument("password")
    update_parser.set_defaults(func=cmd_update_password)

    delete_parser = sub.add_parser("delete-user", help="Delete a user")
    delete_parser.add_argument("username")
    delete_parser.set_defaults(func=cmd_delete_user)

    programs_parser = sub.add_parser("list-programs", help="Show recent program executions for a user")
    programs_parser.add_argument("username")
    programs_parser.add_argument("--limit", type=int, default=None)
    programs_parser.set_defaults(func=cmd_list_programs)

    unlocks_parser = sub.add_parser("list-unlocks", help="Show unlocked materials for a user")
    unlocks_parser.add_argument("username")
    unlocks_parser.set_defaults(func=cmd_list_unlocks)

    return parser


def main(argv: list[str] | None = None) -> None:
    init_db()
    parser = build_parser()
    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()
