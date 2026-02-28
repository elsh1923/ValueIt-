from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.valuation import Valuation
from app.models.project import Project
from app.models.user import User, UserRole
from app.schemas.valuation import ValuationCreate, Valuation as ValuationSchema

router = APIRouter()

@router.post("/", response_model=ValuationSchema)
async def create_valuation(
    *,
    db: AsyncSession = Depends(deps.get_db),
    valuation_in: ValuationCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Submit valuation.
    """
    if current_user.role != UserRole.VALUER and current_user.role != UserRole.MANAGER:
         raise HTTPException(status_code=400, detail="Only Valuers can submit valuations")

    stmt = select(Project).where(Project.id == valuation_in.project_id)
    result = await db.execute(stmt)
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if current_user.role == UserRole.VALUER and project.assigned_valuer_id != current_user.id:
         raise HTTPException(status_code=400, detail="Not assigned to this project")

    # Create valuation with snapshots
    db_obj = Valuation(
        project_id=valuation_in.project_id,
        valuer_id=current_user.id,
        calculated_value=valuation_in.calculated_value,
        currency=valuation_in.currency,
        calculation_details=valuation_in.calculation_details,
        pricing_references_used=valuation_in.pricing_references_used,
        report_url=valuation_in.report_url
    )
    db.add(db_obj)
    
    # Update project status to reflect progress
    project.status = "valuation_completed"
    db.add(project)
    
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[ValuationSchema])
async def read_valuations(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    project_id: int = None
) -> Any:
    stmt = (
        select(Valuation, Project.title.label("project_title"), User.full_name.label("valuer_name"))
        .join(Project, Valuation.project_id == Project.id)
        .join(User, Valuation.valuer_id == User.id)
    )
    
    if project_id:
        stmt = stmt.where(Valuation.project_id == project_id)
        
    result = await db.execute(stmt)
    rows = result.all()
    
    valuations = []
    for row in rows:
        v = row[0]
        v.project_title = row.project_title
        v.valuer_name = row.valuer_name
        valuations.append(v)
        
    return valuations
