# Root‑level database shim for shared imports
# Some modules (e.g., services.interview_agent.models) import `Base` from a top‑level `database` module.
# This shim re‑exports the Base and engine from the interview_agent's database package
# so that those imports resolve without altering the original source files.

from services.interview_agent.database import Base, engine, SessionLocal, get_db

__all__ = ["Base", "engine", "SessionLocal", "get_db"]
