from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class ValuationBase(BaseModel):
    project_id: int
    calculated_value: float
    currency: str = "ETB"
    calculation_details: Optional[Dict[str, Any]] = None
    pricing_references_used: Optional[Dict[str, Any]] = None
    report_url: Optional[str] = None

class ValuationCreate(ValuationBase):
    pass

class ValuationUpdate(BaseModel):
    calculated_value: Optional[float] = None
    calculation_details: Optional[Dict[str, Any]] = None
    report_url: Optional[str] = None

class ValuationInDBBase(ValuationBase):
    id: int
    valuer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Valuation(ValuationInDBBase):
    project_title: Optional[str] = None
    valuer_name: Optional[str] = None
