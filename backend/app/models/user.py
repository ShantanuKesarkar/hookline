from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum
from app.database import Base

class UserRole(str, enum.Enum):
    writer = "writer"
    buyer  = "buyer"

class User(Base):
    __tablename__ = "users"

    id             = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    handle         = Column(String, unique=True, index=True, nullable=False)  # @username
    name           = Column(String, nullable=False)
    email          = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role           = Column(Enum(UserRole), nullable=False)
    emoji          = Column(String, default="🎤")
    color          = Column(String, default="#C6FF3D")
    bio            = Column(String, default="")
    vibes          = Column(JSON, default=list)        # ["heartbreak", "late night"]
    followers      = Column(Integer, default=0)
    created_at     = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    lyrics   = relationship("Lyric",   back_populates="writer",  foreign_keys="Lyric.writer_id")
    licenses = relationship("License", back_populates="buyer",   foreign_keys="License.buyer_id")
    bids     = relationship("Bid",     back_populates="bidder",  foreign_keys="Bid.bidder_id")
    sent_messages = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
