from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.bid import Bid, BidStatus
from app.models.lyric import Lyric
from app.models.user import User
from app.schemas.bid import BidCreate, BidOut
from app.core.deps import get_current_user

router = APIRouter(prefix="/bids", tags=["bids"])

@router.get("/lyric/{lyric_id}", response_model=list[BidOut])
def get_bids_for_lyric(lyric_id: str, db: Session = Depends(get_db)):
    return db.query(Bid).filter(Bid.lyric_id == lyric_id).order_by(Bid.amount.desc()).all()

@router.post("", response_model=BidOut, status_code=status.HTTP_201_CREATED)
def place_bid(
    body: BidCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lyric = db.query(Lyric).filter(Lyric.id == body.lyric_id).first()
    if not lyric:
        raise HTTPException(status_code=404, detail="Lyric not found")
    if not lyric.bidding:
        raise HTTPException(status_code=400, detail="This lyric is not accepting bids")
    if lyric.current_bid and body.amount <= lyric.current_bid:
        raise HTTPException(status_code=400, detail=f"Bid must be higher than current bid of ${lyric.current_bid}")

    # Mark previous top bid as outbid
    prev = db.query(Bid).filter(Bid.lyric_id == body.lyric_id, Bid.status == BidStatus.active).first()
    if prev:
        prev.status = BidStatus.outbid

    bid = Bid(lyric_id=body.lyric_id, bidder_id=current_user.id, amount=body.amount)
    lyric.current_bid = body.amount
    db.add(bid)
    db.commit()
    db.refresh(bid)
    return bid

@router.get("/me", response_model=list[BidOut])
def my_bids(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Bid).filter(Bid.bidder_id == current_user.id).order_by(Bid.created_at.desc()).all()
