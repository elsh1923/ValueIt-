from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta

from app.api import deps
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus

router = APIRouter()

@router.get("/")
async def get_analytics(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_manager_user),
) -> Any:
    """
    Get performance analytics for managers.
    Returns project statistics, user performance, and trends.
    """
    
    # Get all projects
    projects_result = await db.execute(select(Project))
    all_projects = projects_result.scalars().all()
    
    # Get all users
    users_result = await db.execute(select(User))
    all_users = users_result.scalars().all()
    
    # Project statistics by status
    status_counts = {}
    for status in ProjectStatus:
        count = sum(1 for p in all_projects if p.status == status)
        status_counts[status.value] = count
    
    # User statistics by role
    role_counts = {}
    for role in UserRole:
        count = sum(1 for u in all_users if u.role == role)
        role_counts[role.value] = count
    
    # Active users (approved and active)
    active_users = sum(1 for u in all_users if u.is_active and u.is_approved)
    
    # Calculate user workload
    user_workload = []
    for user in all_users:
        if user.role in [UserRole.VALUER, UserRole.INSPECTOR]:
            assigned_count = sum(1 for p in all_projects 
                               if p.assigned_valuer_id == user.id or p.assigned_inspector_id == user.id)
            if assigned_count > 0:
                user_workload.append({
                    "user_id": user.id,
                    "name": user.full_name,
                    "email": user.email,
                    "role": user.role.value,
                    "assigned_projects": assigned_count
                })
    
    # Sort by workload
    user_workload.sort(key=lambda x: x["assigned_projects"], reverse=True)
    
    # Calculate completion rate
    total_projects = len(all_projects)
    completed_projects = status_counts.get("completed", 0)
    completion_rate = round((completed_projects / total_projects * 100), 2) if total_projects > 0 else 0
    
    # Projects without assignments
    unassigned_projects = sum(1 for p in all_projects 
                             if p.assigned_valuer_id is None and p.assigned_inspector_id is None)
    
    return {
        "overview": {
            "total_projects": total_projects,
            "completed_projects": completed_projects,
            "active_projects": total_projects - completed_projects,
            "completion_rate": completion_rate,
            "unassigned_projects": unassigned_projects,
            "total_users": len(all_users),
            "active_users": active_users,
        },
        "project_status_breakdown": status_counts,
        "user_role_breakdown": role_counts,
        "user_workload": user_workload[:10],  # Top 10 busiest users
    }
