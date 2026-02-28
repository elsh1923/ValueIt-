from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core import security
from app.models.user import User, UserRole
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate

router = APIRouter()

@router.get("/", response_model=List[UserSchema])
async def read_users(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_approved: bool = None, # Optional filter
    is_active: bool = None, # Optional filter
    role: UserRole = None, # Optional filter
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve users with active project counts.
    """
    from app.models.project import Project
    from sqlalchemy import func, case
    
    query = select(User).offset(skip).limit(limit)
    if is_approved is not None:
        query = query.where(User.is_approved == is_approved)
    
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    
    if role is not None:
        query = query.where(User.role == role)
        
    result = await db.execute(query)
    users = result.scalars().all()
    
    # Calculate active project counts for each user
    for user in users:
        # Count projects where user is assigned as valuer or inspector
        count_query = select(func.count(Project.id)).where(
            (Project.assigned_valuer_id == user.id) | 
            (Project.assigned_inspector_id == user.id)
        )
        count_result = await db.execute(count_query)
        user.active_projects_count = count_result.scalar() or 0
    
    return users

@router.post("/", response_model=UserSchema)
async def create_user(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_in: UserCreate,
    current_user: User = Depends(deps.get_current_manager_user), # Only Manager/Admin can create users directly
) -> Any:
    """
    Create new user.
    """
    stmt = select(User).where(User.email == user_in.email)
    result = await db.execute(stmt)
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
    hashed_password = security.get_password_hash(user_in.password)
    db_obj = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=user_in.is_active,
        is_approved=True, # Created by admin/manager is auto-approved
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/{user_id}", response_model=UserSchema)
async def read_user_by_id(
    user_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user == current_user:
        return user
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
         raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return user

@router.put("/{user_id}", response_model=UserSchema)
async def update_user(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_manager_user), # Manager/Admin only
) -> Any:
    """
    Update a user.
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    
    user_data = jsonable_encoder(user)
    update_data = user_in.dict(exclude_unset=True)
    
    if "password" in update_data and update_data["password"]:
        hashed_password = security.get_password_hash(update_data["password"])
        del update_data["password"]
        update_data["hashed_password"] = hashed_password
        
    for field in update_data:
        setattr(user, field, update_data[field])
        
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/{user_id}", response_model=UserSchema)
async def delete_user(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_id: int,
    current_user: User = Depends(deps.get_current_manager_user), # Manager/Admin only
) -> Any:
    """
    Delete a user.
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if user.id == current_user.id:
         raise HTTPException(
            status_code=400,
            detail="Users cannot delete themselves",
        )
        
    await db.delete(user)
    await db.commit()
    return user

@router.get("/me", response_model=UserSchema)
async def read_user_me(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    from app.models.project import Project
    from sqlalchemy import func
    
    count_query = select(func.count(Project.id)).where(
        (Project.assigned_valuer_id == current_user.id) | 
        (Project.assigned_inspector_id == current_user.id)
    )
    count_result = await db.execute(count_query)
    current_user.active_projects_count = count_result.scalar() or 0
    
    return current_user

@router.put("/me", response_model=UserSchema)
async def update_user_me(
    *,
    db: AsyncSession = Depends(deps.get_db),
    password: str = Body(None),
    full_name: str = Body(None),
    # email: str = Body(None), # Email update disabled
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    user_data = jsonable_encoder(current_user)
    
    if password:
        hashed_password = security.get_password_hash(password)
        current_user.hashed_password = hashed_password
    
    if full_name:
        current_user.full_name = full_name
        
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user

import shutil
import os
from fastapi import UploadFile, File

@router.post("/me/avatar", response_model=UserSchema)
async def upload_avatar_me(
    *,
    db: AsyncSession = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload user avatar.
    """
    UPLOAD_DIR = "static/avatars"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"user_{current_user.id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Correct URL construction - Assuming backend is served at root/api
    # In production, this should be a full URL or handled by a proxy
    current_user.avatar_url = f"/static/avatars/{file_name}"
    
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user
