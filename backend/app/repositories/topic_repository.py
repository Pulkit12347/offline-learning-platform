from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.topic import Topic


class TopicRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_topics(self) -> list[Topic]:
        statement = select(Topic).order_by(Topic.id)
        return list(self.db.scalars(statement).all())

    def get_topic_by_id(self, topic_id: int) -> Topic | None:
        return self.db.get(Topic, topic_id)
