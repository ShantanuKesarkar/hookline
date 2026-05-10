from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.message import Thread, Message
from app.models.user import User
from app.schemas.message import StartThread, MessageCreate, ThreadOut, MessageOut, UserMini
from app.core.deps import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])

def _user_mini(user) -> UserMini:
    return UserMini(id=user.id, handle=user.handle, name=user.name, emoji=user.emoji, color=user.color)

def _build_thread_out(t: Thread) -> ThreadOut:
    return ThreadOut(
        id=t.id,
        writer_id=t.writer_id,
        buyer_id=t.buyer_id,
        lyric_id=t.lyric_id,
        created_at=t.created_at,
        messages=[MessageOut.model_validate(m) for m in t.messages],
        last_message=t.messages[-1].content if t.messages else None,
        writer_user=_user_mini(t.writer) if t.writer else None,
        buyer_user=_user_mini(t.buyer) if t.buyer else None,
    )

@router.get("/threads", response_model=list[ThreadOut])
def my_threads(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    threads = db.query(Thread).filter(
        (Thread.writer_id == current_user.id) | (Thread.buyer_id == current_user.id)
    ).order_by(Thread.created_at.desc()).all()
    return [_build_thread_out(t) for t in threads]

@router.post("/threads", response_model=ThreadOut, status_code=status.HTTP_201_CREATED)
def start_thread(
    body: StartThread,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Thread).filter(
        Thread.writer_id == body.writer_id,
        Thread.buyer_id == current_user.id,
    ).first()
    if existing:
        return _build_thread_out(existing)

    thread = Thread(writer_id=body.writer_id, buyer_id=current_user.id, lyric_id=body.lyric_id)
    db.add(thread)
    db.flush()

    msg = Message(thread_id=thread.id, sender_id=current_user.id, content=body.first_message)
    db.add(msg)
    db.commit()
    db.refresh(thread)
    return _build_thread_out(thread)

@router.get("/threads/{thread_id}", response_model=ThreadOut)
def get_thread(
    thread_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    thread = db.query(Thread).filter(Thread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    if thread.writer_id != current_user.id and thread.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your thread")
    return _build_thread_out(thread)

@router.post("/threads/{thread_id}", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(
    thread_id: str,
    body: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    thread = db.query(Thread).filter(Thread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    if thread.writer_id != current_user.id and thread.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your thread")

    msg = Message(thread_id=thread_id, sender_id=current_user.id, content=body.content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
