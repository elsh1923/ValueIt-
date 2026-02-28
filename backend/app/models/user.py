from sqlalchemy import Column, Integer, String, Boolean, Enum as SqEnum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    VALUER = "valuer"
    INSPECTOR = "inspector"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SqEnum(UserRole), default=UserRole.VALUER, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_approved = Column(Boolean(), default=False) # For manager approval requirement
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    notifications = relationship("Notification", back_populates="owner")
