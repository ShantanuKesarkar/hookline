import anthropic
from sqlalchemy.orm import Session
from app.config import settings
from app.database import SessionLocal

def generate_ai_summary(lyric_id: str, full_text: str, genre: str, mood: list[str]) -> None:
    """Called in background after lyric creation. Updates lyric.ai_summary."""
    if not settings.ANTHROPIC_API_KEY:
        return

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    prompt = f"""You are analyzing a song lyric for a marketplace listing.
Write a 2-3 sentence thematic summary that helps potential buyers understand the vibe, themes, and commercial potential of these lyrics — WITHOUT quoting or paraphrasing any actual lines.

Genre: {genre}
Mood: {', '.join(mood)}

Full lyrics:
{full_text}

Summary (no lyrics quoted, focus on themes, emotion, commercial use case):"""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}],
    )
    summary = message.content[0].text.strip()

    db: Session = SessionLocal()
    try:
        from app.models.lyric import Lyric
        lyric = db.query(Lyric).filter(Lyric.id == lyric_id).first()
        if lyric:
            lyric.ai_summary = summary
            db.commit()
    finally:
        db.close()
