from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.models.user import UserRole

class SignupRequest(BaseModel):
    handle: str
    name: str
    email: EmailStr
    password: str
    role: UserRole
    emoji: str = "🎤"
    color: str = "#C6FF3D"
    bio: str = ""
    vibes: list[str] = []

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: str
    handle: str
    name: str
    email: str
    role: UserRole
    emoji: str
    color: str
    bio: str
    vibes: list[str]
    followers: int
    created_at: datetime

    model_config = {"from_attributes": True}

class WriterPublic(BaseModel):
    id: str
    handle: str
    name: str
    emoji: str
    color: str
    bio: str
    vibes: list[str]
    followers: int
    sold_count: int = 0
    rating: float = 0.0
    created_at: datetime

    model_config = {"from_attributes": True}
