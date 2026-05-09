from fastapi import APIRouter, Depends, HTTPException, Query, status, BackgroundTasks
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from app.database import get_db
from app.models.lyric import Lyric
from app.models.license import License, LicenseType
from app.models.user import User
from app.schemas.lyric import LyricCreate, LyricUpdate, LyricOut, LyricDetail
from app.core.deps import get_current_user, get_optional_user, require_writer
from app.services.ai import generate_ai_summary

router = APIRouter(prefix="/lyrics", tags=["lyrics"])

def _load(q):
    return q.options(joinedload(Lyric.writer))

@router.get("", response_model=list[LyricOut])
def list_lyrics(
    mood:    Optional[str]  = Query(None),
    genre:   Optional[str]  = Query(None),
    tag:     Optional[str]  = Query(None),
    bidding: Optional[bool] = Query(None),
    sort: str = Query("new"),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
    db: Session = Depends(get_db),
):
    q = _load(db.query(Lyric))
    if mood:    q = q.filter(Lyric.mood.contains([mood]))
    if genre:   q = q.filter(Lyric.genre.ilike(f"%{genre}%"))
    if tag:     q = q.filter(Lyric.tag == tag)
    if bidding is not None: q = q.filter(Lyric.bidding == bidding)

    if sort == "hot":        q = q.order_by(Lyric.plays.desc())
    elif sort == "price_asc":  q = q.order_by(Lyric.price.asc())
    elif sort == "price_desc": q = q.order_by(Lyric.price.desc())
    else:                    q = q.order_by(Lyric.created_at.desc())

    return [LyricOut.from_orm(l) for l in q.offset(offset).limit(limit).all()]

@router.get("/{lyric_id}", response_model=LyricDetail)
def get_lyric(
    lyric_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    lyric = _load(db.query(Lyric)).filter(Lyric.id == lyric_id).first()
    if not lyric:
        raise HTTPException(status_code=404, detail="Lyric not found")

    lyric.plays += 1
    db.commit()

    result = LyricDetail.from_orm(lyric)
    if current_user:
        has_license = db.query(License).filter(
            License.lyric_id == lyric_id,
            License.buyer_id == current_user.id,
        ).first()
        if has_license or lyric.writer_id == current_user.id:
            result.full_text = lyric.full_text

    return result

@router.post("", response_model=LyricOut, status_code=status.HTTP_201_CREATED)
def create_lyric(
    body: LyricCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_writer),
):
    lyric = Lyric(
        title=body.title, writer_id=current_user.id,
        cover_bg=body.cover_bg, cover_ink=body.cover_ink,
        cover_emoji=body.cover_emoji, cover_shape=body.cover_shape,
        mood=body.mood, genre=body.genre, bpm=body.bpm, key=body.key,
        teaser=body.teaser, full_text=body.full_text,
        price=body.price, exclusive_price=body.exclusive_price,
        bidding=body.bidding,
    )
    db.add(lyric)
    db.commit()
    db.refresh(lyric)
    db.refresh(lyric, ['writer'])

    background_tasks.add_task(generate_ai_summary, lyric.id, lyric.full_text, lyric.genre, lyric.mood)
    return LyricOut.from_orm(lyric)

@router.patch("/{lyric_id}", response_model=LyricOut)
def update_lyric(
    lyric_id: str, body: LyricUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_writer),
):
    lyric = _load(db.query(Lyric)).filter(Lyric.id == lyric_id, Lyric.writer_id == current_user.id).first()
    if not lyric:
        raise HTTPException(status_code=404, detail="Lyric not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(lyric, field, value)
    db.commit()
    db.refresh(lyric)
    return LyricOut.from_orm(lyric)

@router.delete("/{lyric_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lyric(
    lyric_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_writer),
):
    lyric = db.query(Lyric).filter(Lyric.id == lyric_id, Lyric.writer_id == current_user.id).first()
    if not lyric:
        raise HTTPException(status_code=404, detail="Lyric not found")
    db.delete(lyric)
    db.commit()
