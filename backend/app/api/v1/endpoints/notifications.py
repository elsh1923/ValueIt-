from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.api import deps
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import Notification as NotificationSchema, NotificationUpdate

router = APIRouter()

@router.get("/", response_model=List[NotificationSchema])
async def read_notifications(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve current user's notifications.
    """
    stmt = select(Notification).where(Notification.user_id == current_user.id).order_by(desc(Notification.created_at)).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.put("/{notification_id}/read", response_model=NotificationSchema)
async def mark_notification_as_read(
    *,
    db: AsyncSession = Depends(deps.get_db),
    notification_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Mark notification as read.
    """
    stmt = select(Notification).where(Notification.id == notification_id, Notification.user_id == current_user.id)
    result = await db.execute(stmt)
    notification = result.scalars().first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notification.is_read = True
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification
