from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Valuation(Base):
    __tablename__ = "valuations"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    valuer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    calculated_value = Column(Float, nullable=False)
    currency = Column(String, default="ETB")
    
    calculation_details = Column(JSON, nullable=True) # Detailed breakdown of costs
    pricing_references_used = Column(JSON, nullable=True) # Snapshot of prices used
    
    report_url = Column(String, nullable=True) # Path to generated PDF/DOC
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    project = relationship("Project", back_populates="valuations")
    valuer = relationship("User", backref="valuations")

    def __repr__(self):
        return f"<Valuation(id={self.id}, project_id={self.project_id}, valuer_id={self.valuer_id}, value={self.calculated_value})>"
