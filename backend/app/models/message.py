from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.database import Base

class Thread(Base):
    __tablename__ = "threads"

    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    writer_id  = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    buyer_id   = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    lyric_id   = Column(String, ForeignKey("lyrics.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    messages = relationship("Message", back_populates="thread", order_by="Message.created_at")
    writer   = relationship("User", foreign_keys=[writer_id])
    buyer    = relationship("User", foreign_keys=[buyer_id])

class Message(Base):
    __tablename__ = "messages"

    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    thread_id  = Column(String, ForeignKey("threads.id"), nullable=False, index=True)
    sender_id  = Column(String, ForeignKey("users.id"),   nullable=False)
    content    = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    thread = relationship("Thread",  back_populates="messages", foreign_keys=[thread_id])
    sender = relationship("User",    back_populates="sent_messages", foreign_keys=[sender_id])
