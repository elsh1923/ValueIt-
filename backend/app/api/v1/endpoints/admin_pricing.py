from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.pricing import MaterialPrice
from app.models.user import User, UserRole
from app.schemas.pricing import MaterialPrice as MaterialPriceSchema, MaterialPriceCreate, MaterialPriceUpdate

router = APIRouter()

@router.get("/", response_model=List[MaterialPriceSchema])
async def read_prices(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Read material prices. Accessible by all active users (Valuers need it).
    """
    result = await db.execute(select(MaterialPrice).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=MaterialPriceSchema)
async def create_price(
    *,
    db: AsyncSession = Depends(deps.get_db),
    price_in: MaterialPriceCreate,
    current_user: User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Create new material price. ADMIN ONLY.
    """
    db_obj = MaterialPrice(**price_in.dict())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.put("/{price_id}", response_model=MaterialPriceSchema)
async def update_price(
    *,
    db: AsyncSession = Depends(deps.get_db),
    price_id: int,
    price_in: MaterialPriceUpdate,
    current_user: User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Update material price. ADMIN ONLY.
    """
    result = await db.execute(select(MaterialPrice).where(MaterialPrice.id == price_id))
    price_obj = result.scalars().first()
    if not price_obj:
        raise HTTPException(status_code=404, detail="Price item not found")
        
    update_data = price_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(price_obj, field, update_data[field])
        
    db.add(price_obj)
    await db.commit()
    await db.refresh(price_obj)
    return price_obj
