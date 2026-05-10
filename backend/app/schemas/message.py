from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    content: str

class MessageOut(BaseModel):
    id: str
    thread_id: str
    sender_id: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}

class UserMini(BaseModel):
    id: str
    handle: str
    name: str
    emoji: str
    color: str

class ThreadOut(BaseModel):
    id: str
    writer_id: str
    buyer_id: str
    lyric_id: Optional[str]
    created_at: datetime
    messages: list[MessageOut] = []
    last_message: Optional[str] = None
    unread: int = 0
    writer_user: Optional[UserMini] = None
    buyer_user: Optional[UserMini] = None

    model_config = {"from_attributes": True}

class StartThread(BaseModel):
    writer_id: str
    lyric_id: Optional[str] = None
    first_message: str
