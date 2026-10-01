from fastapi import APIRouter

from app.routers import admin, auth, topics

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(topics.router, prefix="/topics", tags=["topics"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
