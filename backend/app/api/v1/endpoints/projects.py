from typing import Any, List
import sys
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.api import deps
from app.models.project import Project, ProjectStatus
from app.models.user import User, UserRole
from app.schemas.project import Project as ProjectSchema, ProjectCreate, ProjectUpdate

router = APIRouter()

@router.get("/", response_model=List[ProjectSchema])
async def read_projects(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve projects. Managers see all, others see assigned.
    """
    stmt = select(Project).offset(skip).limit(limit)
    
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        # Filter by assignment
        stmt = stmt.where(
            or_(
                Project.assigned_valuer_id == current_user.id,
                Project.assigned_inspector_id == current_user.id
            )
        )
        
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{project_id}", response_model=ProjectSchema)
async def read_project(
    *,
    db: AsyncSession = Depends(deps.get_db),
    project_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get project by ID.
    """
    stmt = select(Project).where(Project.id == project_id)
    result = await db.execute(stmt)
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Permission check: Managers see all, others see if assigned
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        if project.assigned_valuer_id != current_user.id and project.assigned_inspector_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to view this project")
            
    return project

@router.post("/", response_model=ProjectSchema)
async def create_project(
    *,
    db: AsyncSession = Depends(deps.get_db),
    project_in: ProjectCreate,
    current_user: User = Depends(deps.get_current_manager_user),
) -> Any:
    """
    Create new project. Only Manager endpoints.
    """
    db_obj = Project(
        **project_in.dict(), 
        created_by_id=current_user.id
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.put("/{project_id}", response_model=ProjectSchema)
async def update_project(
    *,
    db: AsyncSession = Depends(deps.get_db),
    project_id: int,
    project_in: ProjectUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a project.
    """
    print(f"\n=== UPDATE PROJECT {project_id} ===")
    sys.stdout.flush()
    print(f"Current user: {current_user.email} (Role: {current_user.role})")
    sys.stdout.flush()
    
    stmt = select(Project).where(Project.id == project_id)
    result = await db.execute(stmt)
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    print(f"Project found: {project.title}")
    sys.stdout.flush()
    print(f"Current assignments - Valuer: {project.assigned_valuer_id}, Inspector: {project.assigned_inspector_id}")
    sys.stdout.flush()
        
    # Permission check: Manager can update everything. Valuer/Inspector might update status?
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        # Allow assigned users to update status only
        is_assigned = (project.assigned_valuer_id == current_user.id) or \
                      (project.assigned_inspector_id == current_user.id)
        
        if is_assigned:
            # Check if attempting to update fields other than status
            update_data = project_in.dict(exclude_unset=True)
            allowed_fields = {"status"}
            if any(field not in allowed_fields for field in update_data):
                 raise HTTPException(status_code=403, detail="You can only update project status")
        else:
            raise HTTPException(status_code=403, detail="Not authorized to update this project")

    update_data = project_in.dict(exclude_unset=True)
    print(f"Update data received: {update_data}")
    
    # Notification Logic
    from app.models.notification import Notification

    notifications_created = 0

    # Handle Valuer Assignment
    if "assigned_valuer_id" in update_data:
        new_valuer_id = update_data["assigned_valuer_id"]
        old_valuer_id = project.assigned_valuer_id
        
        print(f"Valuer assignment check: old={old_valuer_id}, new={new_valuer_id}")
        
        # Check if ID changed and is not None (Assignment)
        if new_valuer_id != old_valuer_id and new_valuer_id is not None:
            print(f"✓ Creating notification for Valuer ID: {new_valuer_id}")
            notif = Notification(
                user_id=new_valuer_id,
                title="New Project Assignment",
                message=f"You have been assigned as Valuer to project '{project.title}'."
            )
            db.add(notif)
            notifications_created += 1
            print(f"✓ Notification object created and added to session")

    # Handle Inspector Assignment
    if "assigned_inspector_id" in update_data:
        new_inspector_id = update_data["assigned_inspector_id"]
        old_inspector_id = project.assigned_inspector_id
        
        print(f"Inspector assignment check: old={old_inspector_id}, new={new_inspector_id}")
        
        # Check if ID changed and is not None (Assignment)
        if new_inspector_id != old_inspector_id and new_inspector_id is not None:
             print(f"✓ Creating notification for Inspector ID: {new_inspector_id}")
             notif = Notification(
                user_id=new_inspector_id,
                title="New Site Inspection Assignment",
                message=f"You have been assigned as Site Inspector to project '{project.title}'."
            )
             db.add(notif)
             notifications_created += 1
             print(f"✓ Notification object created and added to session")
    
    print(f"Total notifications to be created: {notifications_created}")
    
    # Update project fields
    for field in update_data:
        setattr(project, field, update_data[field])
        
    db.add(project)
    
    print("Committing changes to database...")
    await db.commit()
    print("✓ Database commit successful")
    
    await db.refresh(project)
    
    
    print(f"=== UPDATE COMPLETE ===\n")
    return project

@router.delete("/{project_id}")
async def delete_project(
    *,
    db: AsyncSession = Depends(deps.get_db),
    project_id: int,
    current_user: User = Depends(deps.get_current_manager_user),
) -> Any:
    """
    Delete a project. Only managers/admins can delete projects.
    This will cascade delete all related inspections, valuations, and notifications.
    """
    print(f"\n=== DELETE PROJECT {project_id} ===")
    sys.stdout.flush()
    print(f"Requested by: {current_user.email} (Role: {current_user.role})")
    sys.stdout.flush()
    
    stmt = select(Project).where(Project.id == project_id)
    result = await db.execute(stmt)
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    print(f"Deleting project: {project.title}")
    sys.stdout.flush()
    
    # Delete the project (cascade will handle related records)
    await db.delete(project)
    await db.commit()
    
    print(f"✓ Project {project_id} deleted successfully")
    sys.stdout.flush()
    print(f"=== DELETE COMPLETE ===\n")
    sys.stdout.flush()
    
    return {"message": "Project deleted successfully", "project_id": project_id}

