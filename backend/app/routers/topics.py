from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.topic import Topic
from app.repositories.topic_repository import TopicRepository
from app.schemas.topic import TopicResponse
from app.services.topic_service import TopicService

router = APIRouter()


def get_topic_service(db: Session = Depends(get_db)) -> TopicService:
    return TopicService(TopicRepository(db))


@router.get("", response_model=list[TopicResponse])
def list_topics(topic_service: TopicService = Depends(get_topic_service)) -> list[Topic]:
    return topic_service.list_topics()


@router.get("/{topic_id}", response_model=TopicResponse)
def get_topic(
    topic_id: int,
    topic_service: TopicService = Depends(get_topic_service),
) -> Topic:
    topic = topic_service.get_topic(topic_id)
    if topic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found",
        )
    return topic
