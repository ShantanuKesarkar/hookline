from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.lyric import Lyric
from app.models.license import License
from app.schemas.user import WriterPublic
from app.schemas.lyric import LyricOut

router = APIRouter(prefix="/writers", tags=["writers"])

def _enrich(writer, db):
    sold = db.query(func.count(License.id)).join(Lyric, License.lyric_id == Lyric.id).filter(Lyric.writer_id == writer.id).scalar() or 0
    writer.sold_count = sold
    writer.rating = 0.0
    return writer

@router.get("", response_model=list[WriterPublic])
def list_writers(sort: str = Query("top"), db: Session = Depends(get_db)):
    q = db.query(User).filter(User.role == UserRole.writer)
    if sort == "new": q = q.order_by(User.created_at.desc())
    else:             q = q.order_by(User.followers.desc())
    writers = q.limit(50).all()
    return [_enrich(w, db) for w in writers]

@router.get("/{writer_id}", response_model=WriterPublic)
def get_writer(writer_id: str, db: Session = Depends(get_db)):
    writer = db.query(User).filter(User.id == writer_id, User.role == UserRole.writer).first()
    if not writer:
        raise HTTPException(status_code=404, detail="Writer not found")
    return _enrich(writer, db)

@router.get("/{writer_id}/lyrics", response_model=list[LyricOut])
def get_writer_lyrics(writer_id: str, db: Session = Depends(get_db)):
    from sqlalchemy.orm import joinedload
    lyrics = db.query(Lyric).options(joinedload(Lyric.writer)).filter(Lyric.writer_id == writer_id).order_by(Lyric.created_at.desc()).all()
    return [LyricOut.from_orm(l) for l in lyrics]
