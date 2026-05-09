from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum
from app.database import Base

class LicenseType(str, enum.Enum):
    non_exclusive = "non_exclusive"
    exclusive     = "exclusive"

class License(Base):
    __tablename__ = "licenses"

    id                 = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    lyric_id           = Column(String, ForeignKey("lyrics.id"), nullable=False, index=True)
    buyer_id           = Column(String, ForeignKey("users.id"),  nullable=False, index=True)
    license_type       = Column(Enum(LicenseType), nullable=False)
    price_paid         = Column(Integer, nullable=False)
    stripe_payment_id  = Column(String, nullable=True)
    created_at         = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    lyric = relationship("Lyric", back_populates="licenses", foreign_keys=[lyric_id])
    buyer = relationship("User",  back_populates="licenses", foreign_keys=[buyer_id])
