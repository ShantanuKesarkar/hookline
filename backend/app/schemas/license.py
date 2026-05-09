from pydantic import BaseModel
from datetime import datetime
from app.models.license import LicenseType

class PurchaseRequest(BaseModel):
    lyric_id: str
    license_type: LicenseType

class CheckoutSession(BaseModel):
    checkout_url: str
    session_id: str

class LicenseOut(BaseModel):
    id: str
    lyric_id: str
    buyer_id: str
    license_type: LicenseType
    price_paid: int
    created_at: datetime

    model_config = {"from_attributes": True}
