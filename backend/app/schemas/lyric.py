from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LyricCreate(BaseModel):
    title: str
    cover_bg: str = "#C6FF3D"
    cover_ink: str = "#0E0E10"
    cover_emoji: str = "🎤"
    cover_shape: str = "rect"
    mood: list[str]
    genre: str
    bpm: Optional[int] = None
    key: Optional[str] = None
    teaser: str
    full_text: str
    price: int
    exclusive_price: int
    bidding: bool = False

class LyricUpdate(BaseModel):
    title: Optional[str] = None
    mood: Optional[list[str]] = None
    genre: Optional[str] = None
    bpm: Optional[int] = None
    key: Optional[str] = None
    teaser: Optional[str] = None
    price: Optional[int] = None
    exclusive_price: Optional[int] = None
    bidding: Optional[bool] = None
    tag: Optional[str] = None

class CoverOut(BaseModel):
    bg: str
    ink: str
    emoji: str
    shape: str

class WriterMini(BaseModel):
    id: str
    handle: str
    name: str
    emoji: str
    color: str

class LyricOut(BaseModel):
    id: str
    title: str
    cover: CoverOut
    writer_id: str
    writer: Optional[WriterMini] = None
    mood: list[str]
    genre: str
    bpm: Optional[int]
    key: Optional[str]
    tag: Optional[str]
    teaser: str
    ai_summary: Optional[str]
    price: int
    exclusive_price: int
    bidding: bool
    current_bid: Optional[int]
    plays: int
    saves: int
    comments: int
    sold_count: int
    is_exclusive_sold: bool
    bid_ends: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm(cls, lyric):
        writer = None
        if lyric.writer:
            writer = WriterMini(
                id=lyric.writer.id,
                handle=lyric.writer.handle,
                name=lyric.writer.name,
                emoji=lyric.writer.emoji,
                color=lyric.writer.color,
            )
        return cls(
            id=lyric.id,
            title=lyric.title,
            cover=CoverOut(bg=lyric.cover_bg, ink=lyric.cover_ink, emoji=lyric.cover_emoji, shape=lyric.cover_shape),
            writer_id=lyric.writer_id,
            writer=writer,
            mood=lyric.mood or [],
            genre=lyric.genre,
            bpm=lyric.bpm,
            key=lyric.key,
            tag=lyric.tag,
            teaser=lyric.teaser,
            ai_summary=lyric.ai_summary,
            price=lyric.price,
            exclusive_price=lyric.exclusive_price,
            bidding=lyric.bidding,
            current_bid=lyric.current_bid,
            plays=lyric.plays,
            saves=lyric.saves,
            comments=lyric.comments,
            sold_count=lyric.sold_count,
            is_exclusive_sold=lyric.is_exclusive_sold,
            bid_ends=lyric.bid_ends,
            created_at=lyric.created_at,
        )

class LyricDetail(LyricOut):
    full_text: Optional[str] = None
