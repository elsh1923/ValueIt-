from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SqEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class ProjectStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    INSPECTION_COMPLETED = "inspection_completed"
    VALUATION_COMPLETED = "valuation_completed"
    COMPLETED = "completed"

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    client_name = Column(String, nullable=False)
    client_email = Column(String, nullable=True)
    client_phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    
    status = Column(SqEnum(ProjectStatus), default=ProjectStatus.PENDING)
    
    created_by_id = Column(Integer, ForeignKey("users.id"))
    assigned_valuer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_inspector_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Site Inspector
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    created_by = relationship("User", foreign_keys=[created_by_id])
    valuer = relationship("User", foreign_keys=[assigned_valuer_id])
    inspector = relationship("User", foreign_keys=[assigned_inspector_id])
    
    inspections = relationship("Inspection", back_populates="project")
    valuations = relationship("Valuation", back_populates="project")
    chat_messages = relationship("ChatMessage", back_populates="project")
