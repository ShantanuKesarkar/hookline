from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.message import Thread, Message
from app.models.user import User
from app.schemas.message import StartThread, MessageCreate, ThreadOut, MessageOut
from app.core.deps import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])

@router.get("/threads", response_model=list[ThreadOut])
def my_threads(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    threads = db.query(Thread).filter(
        (Thread.writer_id == current_user.id) | (Thread.buyer_id == current_user.id)
    ).order_by(Thread.created_at.desc()).all()

    result = []
    for t in threads:
        out = ThreadOut.model_validate(t)
        if t.messages:
            out.last_message = t.messages[-1].content
        result.append(out)
    return result

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
        return existing

    thread = Thread(writer_id=body.writer_id, buyer_id=current_user.id, lyric_id=body.lyric_id)
    db.add(thread)
    db.flush()

    msg = Message(thread_id=thread.id, sender_id=current_user.id, content=body.first_message)
    db.add(msg)
    db.commit()
    db.refresh(thread)
    return thread

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
    return thread

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
