from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.routes import auth, lyrics, writers, bids, licenses, messages

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HOOKLINE API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "https://aifreaknation.in",
        "https://www.aifreaknation.in",
        "https://hookline.aifreaknation.in",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(lyrics.router)
app.include_router(writers.router)
app.include_router(bids.router)
app.include_router(licenses.router)
app.include_router(messages.router)

@app.get("/")
def health():
    return {"status": "ok", "app": "HOOKLINE API"}
