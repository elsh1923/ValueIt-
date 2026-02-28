from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.VALUER
    is_active: Optional[bool] = True
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_approved: Optional[bool] = None
    avatar_url: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    is_approved: bool
    avatar_url: Optional[str] = None
    active_projects_count: Optional[int] = 0  # Number of active projects assigned to
    
    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserLogin(BaseModel):
    email: EmailStr
    password: str
