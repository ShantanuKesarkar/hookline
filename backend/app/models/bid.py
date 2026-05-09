from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum
from app.database import Base

class BidStatus(str, enum.Enum):
    active  = "active"
    outbid  = "outbid"
    won     = "won"
    expired = "expired"

class Bid(Base):
    __tablename__ = "bids"

    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    lyric_id   = Column(String, ForeignKey("lyrics.id"), nullable=False, index=True)
    bidder_id  = Column(String, ForeignKey("users.id"),  nullable=False, index=True)
    amount     = Column(Integer, nullable=False)
    status     = Column(Enum(BidStatus), default=BidStatus.active)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    lyric  = relationship("Lyric", back_populates="bids", foreign_keys=[lyric_id])
    bidder = relationship("User",  back_populates="bids", foreign_keys=[bidder_id])
