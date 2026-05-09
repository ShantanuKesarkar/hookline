from pydantic import BaseModel
from datetime import datetime
from app.models.bid import BidStatus

class BidCreate(BaseModel):
    lyric_id: str
    amount: int

class BidOut(BaseModel):
    id: str
    lyric_id: str
    bidder_id: str
    amount: int
    status: BidStatus
    created_at: datetime

    model_config = {"from_attributes": True}
