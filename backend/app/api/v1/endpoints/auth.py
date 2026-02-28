from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User, UserRole
from app.schemas.token import Token
from app.schemas.user import UserCreate, User as UserSchema
from sqlalchemy import func

router = APIRouter()

@router.get("/role-availability")
async def get_role_availability(
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Check availability of Admin and Manager roles.
    """
    admin_count = await db.execute(select(func.count(User.id)).where(User.role == UserRole.ADMIN))
    manager_count = await db.execute(select(func.count(User.id)).where(User.role == UserRole.MANAGER))
    
    return {
        "admin_available": admin_count.scalar() == 0,
        "manager_available": manager_count.scalar() == 0,
    }

@router.post("/login", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(deps.get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Authenticate user
    stmt = select(User).where(User.email == form_data.username)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    if not user.is_approved:
        raise HTTPException(status_code=400, detail="User account pending approval")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.email, 
            extra_claims={
                "role": user.role.value if hasattr(user.role, 'value') else user.role,
                "full_name": user.full_name,
                "avatar_url": user.avatar_url
            },
            expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=UserSchema)
async def register_user(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    stmt = select(User).where(User.email == user_in.email)
    result = await db.execute(stmt)
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
        
    try:
        hashed_password = security.get_password_hash(user_in.password)
    except Exception as e:
        print(f"HASH ERROR: {e}", flush=True)
        raise HTTPException(status_code=500, detail=f"Password hashing failed: {str(e)}")
    db_obj = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=True,
        # Auto-approve admins and managers for now. 
        # Valuers/Inspectors must be approved.
        is_approved=(user_in.role in [UserRole.ADMIN, UserRole.MANAGER]), 
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
