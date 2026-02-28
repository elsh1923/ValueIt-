from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.models.project import ProjectStatus

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    client_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    location: Optional[str] = None
    status: ProjectStatus = ProjectStatus.PENDING

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    client_name: Optional[str] = None
    status: Optional[ProjectStatus] = None
    assigned_valuer_id: Optional[int] = None
    assigned_inspector_id: Optional[int] = None

class ProjectInDBBase(ProjectBase):
    id: int
    created_by_id: int
    assigned_valuer_id: Optional[int] = None
    assigned_inspector_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Project(ProjectInDBBase):
    pass
