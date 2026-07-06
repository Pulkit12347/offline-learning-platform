from app.models.topic import Topic
from app.repositories.topic_repository import TopicRepository


class TopicService:
    def __init__(self, topic_repository: TopicRepository) -> None:
        self.topic_repository = topic_repository

    def list_topics(self) -> list[Topic]:
        return self.topic_repository.list_topics()

    def get_topic(self, topic_id: int) -> Topic | None:
        return self.topic_repository.get_topic_by_id(topic_id)
