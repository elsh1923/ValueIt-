from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class InspectionPhotoBase(BaseModel):
    photo_url: str
    description: Optional[str] = None

class InspectionPhotoCreate(InspectionPhotoBase):
    pass

class InspectionPhoto(InspectionPhotoBase):
    id: int
    inspection_id: int
    uploaded_at: datetime
    class Config:
        from_attributes = True

class InspectionBase(BaseModel):
    project_id: int
    observations: Optional[str] = None
    measurements: Optional[Dict[str, Any]] = None
    site_notes: Optional[str] = None

class InspectionCreate(InspectionBase):
    pass

class InspectionUpdate(BaseModel):
    observations: Optional[str] = None
    measurements: Optional[Dict[str, Any]] = None
    site_notes: Optional[str] = None

class InspectionInDBBase(InspectionBase):
    id: int
    inspector_id: int
    created_at: datetime
    photos: List[InspectionPhoto] = []

    class Config:
        from_attributes = True

class Inspection(InspectionInDBBase):
    project_title: Optional[str] = None
    inspector_name: Optional[str] = None
