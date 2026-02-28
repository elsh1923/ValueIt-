from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, projects, inspections, valuations, admin_pricing
from app.api.v1.endpoints import notifications, analytics, chat

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(inspections.router, prefix="/inspections", tags=["inspections"])
api_router.include_router(valuations.router, prefix="/valuations", tags=["valuations"])
api_router.include_router(admin_pricing.router, prefix="/pricing", tags=["pricing"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
