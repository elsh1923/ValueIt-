from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api import deps
from app.models.user import User, UserRole
from app.models.project import Project
from app.models.chat import ChatMessage
from app.schemas.chat import ChatMessage as ChatMessageSchema, ChatMessageCreate

router = APIRouter()

@router.get("/{project_id}", response_model=List[ChatMessageSchema])
async def get_project_messages(
    project_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all chat messages for a specific project.
    """
    # Verify project exists and user has access
    project_result = await db.execute(select(Project).where(Project.id == project_id))
    project = project_result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Access control: Admins can see all. Managers can see all.
    # Valuers and Inspectors can only see projects they are assigned to.
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        if project.assigned_valuer_id != current_user.id and project.assigned_inspector_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions to access this project's chat")

    result = await db.execute(
        select(ChatMessage)
        .options(selectinload(ChatMessage.sender))
        .where(ChatMessage.project_id == project_id)
        .order_by(ChatMessage.timestamp.asc())
    )
    messages = result.scalars().all()
    
    # Map sender attributes manually if needed or via hybrid properties
    for msg in messages:
        msg.sender_name = msg.sender.full_name if msg.sender else "Unknown"
        msg.sender_avatar = msg.sender.avatar_url if msg.sender else None
        
    return messages

@router.post("/", response_model=ChatMessageSchema)
async def send_message(
    *,
    db: AsyncSession = Depends(deps.get_db),
    message_in: ChatMessageCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Send a new chat message to a project.
    """
    # Verify project exists and user has access
    project_result = await db.execute(select(Project).where(Project.id == message_in.project_id))
    project = project_result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        if project.assigned_valuer_id != current_user.id and project.assigned_inspector_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions to chat in this project")

    db_obj = ChatMessage(
        project_id=message_in.project_id,
        sender_id=current_user.id,
        content=message_in.content
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
