from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class MaterialPrice(Base):
    __tablename__ = "material_prices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)
    unit = Column(String, nullable=False) # e.g. m2, pcs, kg
    price = Column(Float, nullable=False)
    source = Column(String, nullable=True) # e.g. "Market User 2024"
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
