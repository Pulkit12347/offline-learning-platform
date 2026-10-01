from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.admin import AdminDashboardResponse
from app.services.admin_service import AdminService

router = APIRouter()


def get_admin_service(db: Session = Depends(get_db)) -> AdminService:
    return AdminService(UserRepository(db))


@router.get("/dashboard", response_model=AdminDashboardResponse)
def dashboard(
    _admin: User = Depends(get_current_admin),
    admin_service: AdminService = Depends(get_admin_service),
) -> AdminDashboardResponse:
    return admin_service.dashboard()
