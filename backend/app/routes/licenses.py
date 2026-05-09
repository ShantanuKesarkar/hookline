from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import stripe
from app.database import get_db
from app.config import settings
from app.models.license import License, LicenseType
from app.models.lyric import Lyric
from app.models.user import User
from app.schemas.license import PurchaseRequest, CheckoutSession, LicenseOut
from app.core.deps import get_current_user

stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter(prefix="/licenses", tags=["licenses"])

@router.get("/me", response_model=list[LicenseOut])
def my_licenses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(License).filter(License.buyer_id == current_user.id).order_by(License.created_at.desc()).all()

@router.post("/checkout", response_model=CheckoutSession)
def create_checkout(
    body: PurchaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lyric = db.query(Lyric).filter(Lyric.id == body.lyric_id).first()
    if not lyric:
        raise HTTPException(status_code=404, detail="Lyric not found")

    if body.license_type == LicenseType.exclusive and lyric.is_exclusive_sold:
        raise HTTPException(status_code=400, detail="Exclusive license already sold")

    price = lyric.exclusive_price if body.license_type == LicenseType.exclusive else lyric.price

    if not settings.STRIPE_SECRET_KEY:
        # Dev mode: skip Stripe, create license directly
        license = License(
            lyric_id=body.lyric_id,
            buyer_id=current_user.id,
            license_type=body.license_type,
            price_paid=price,
        )
        if body.license_type == LicenseType.exclusive:
            lyric.is_exclusive_sold = True
        lyric.sold_count += 1
        db.add(license)
        db.commit()
        return CheckoutSession(checkout_url=f"{settings.FRONTEND_URL}/checkout/{body.lyric_id}?success=true", session_id="dev-mode")

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "usd",
                "product_data": {"name": f"{lyric.title} — {body.license_type.value.replace('_', '-')} license"},
                "unit_amount": price * 100,
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url=f"{settings.FRONTEND_URL}/checkout/{body.lyric_id}?success=true&session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{settings.FRONTEND_URL}/lyrics/{body.lyric_id}",
        metadata={"lyric_id": body.lyric_id, "buyer_id": current_user.id, "license_type": body.license_type.value},
    )
    return CheckoutSession(checkout_url=session.url, session_id=session.id)

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig, settings.STRIPE_WEBHOOK_SECRET)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook")

    if event["type"] == "checkout.session.completed":
        meta = event["data"]["object"]["metadata"]
        lyric = db.query(Lyric).filter(Lyric.id == meta["lyric_id"]).first()
        if lyric:
            license_type = LicenseType(meta["license_type"])
            price = lyric.exclusive_price if license_type == LicenseType.exclusive else lyric.price
            license = License(
                lyric_id=meta["lyric_id"],
                buyer_id=meta["buyer_id"],
                license_type=license_type,
                price_paid=price,
                stripe_payment_id=event["data"]["object"]["id"],
            )
            if license_type == LicenseType.exclusive:
                lyric.is_exclusive_sold = True
            lyric.sold_count += 1
            db.add(license)
            db.commit()
    return {"ok": True}
