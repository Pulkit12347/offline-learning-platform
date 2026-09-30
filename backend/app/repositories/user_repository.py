from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, user_id: int) -> User | None:
        return self.db.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email.strip().lower())
        return self.db.scalars(statement).first()

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def save(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def list_all(self) -> list[User]:
        statement = select(User).order_by(User.created_at.desc())
        return list(self.db.scalars(statement).all())

    def count(self) -> int:
        return self.db.scalar(select(func.count()).select_from(User)) or 0

    def count_verified(self) -> int:
        statement = select(func.count()).select_from(User).where(User.is_verified.is_(True))
        return self.db.scalar(statement) or 0

    def count_admins(self) -> int:
        statement = select(func.count()).select_from(User).where(User.is_admin.is_(True))
        return self.db.scalar(statement) or 0

    def count_since(self, days: int) -> int:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        statement = (
            select(func.count()).select_from(User).where(User.created_at >= cutoff)
        )
        return self.db.scalar(statement) or 0
