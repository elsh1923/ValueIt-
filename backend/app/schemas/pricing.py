from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class MaterialPriceBase(BaseModel):
    name: str
    category: str
    unit: str
    price: float
    source: Optional[str] = None

class MaterialPriceCreate(MaterialPriceBase):
    pass

class MaterialPriceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    price: Optional[float] = None
    source: Optional[str] = None

class MaterialPriceInDBBase(MaterialPriceBase):
    id: int
    updated_at: datetime
    class Config:
        from_attributes = True

class MaterialPrice(MaterialPriceInDBBase):
    pass
