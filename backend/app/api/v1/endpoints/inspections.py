from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.inspection import Inspection, InspectionPhoto
from app.models.project import Project
from app.models.user import User, UserRole
from app.schemas.inspection import InspectionCreate, Inspection as InspectionSchema, InspectionPhotoCreate

router = APIRouter()

@router.post("/", response_model=InspectionSchema)
async def create_inspection(
    *,
    db: AsyncSession = Depends(deps.get_db),
    inspection_in: InspectionCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Submit inspection data.
    """
    if current_user.role != UserRole.INSPECTOR and current_user.role != UserRole.MANAGER:
         raise HTTPException(status_code=400, detail="Only Inspectors can submit inspections")
         
    # Check if project exists and is assigned
    stmt = select(Project).where(Project.id == inspection_in.project_id)
    result = await db.execute(stmt)
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if current_user.role == UserRole.INSPECTOR and project.assigned_inspector_id != current_user.id:
         raise HTTPException(status_code=400, detail="Not assigned to this project")

    db_obj = Inspection(
        **inspection_in.dict(),
        inspector_id=current_user.id
    )
    db.add(db_obj)
    
    # Update project status
    project.status = "inspection_completed"
    db.add(project)
    
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

import shutil
import os
from fastapi import UploadFile, File
from sqlalchemy.orm import selectinload

@router.post("/{inspection_id}/photos", response_model=InspectionSchema)
async def upload_inspection_photos(
    *,
    db: AsyncSession = Depends(deps.get_db),
    inspection_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload photos for an inspection.
    """
    if current_user.role != UserRole.INSPECTOR and current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=400, detail="Only Inspectors can upload photos")
        
    stmt = select(Inspection).where(Inspection.id == inspection_id)
    result = await db.execute(stmt)
    inspection = result.scalars().first()
    
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
        
    if current_user.role == UserRole.INSPECTOR and inspection.inspector_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not authorized to update this inspection")

    UPLOAD_DIR = "static/inspections"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    for file in files:
        file_extension = os.path.splitext(file.filename)[1]
        import uuid
        file_name = f"insp_{inspection_id}_{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, file_name)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        photo = InspectionPhoto(
            inspection_id=inspection_id,
            photo_url=f"/static/inspections/{file_name}"
        )
        db.add(photo)
        
    await db.commit()
    
    # Reload with photos
    stmt = select(Inspection).options(selectinload(Inspection.photos)).where(Inspection.id == inspection_id)
    result = await db.execute(stmt)
    return result.scalars().first()

@router.get("/", response_model=List[InspectionSchema])
async def read_inspections(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    project_id: int = None
) -> Any:
    stmt = (
        select(Inspection, Project.title.label("project_title"), User.full_name.label("inspector_name"))
        .options(selectinload(Inspection.photos))
        .join(Project, Inspection.project_id == Project.id)
        .join(User, Inspection.inspector_id == User.id)
    )
    
    if project_id:
        stmt = stmt.where(Inspection.project_id == project_id)
        
    result = await db.execute(stmt)
    rows = result.all()
    
    inspections_list = []
    for row in rows:
        insp = row[0]
        insp.project_title = row.project_title
        insp.inspector_name = row.inspector_name
        inspections_list.append(insp)
        
    return inspections_list
