'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LyricsCard from '@/components/LyricsCard';
import WriterCard from '@/components/WriterCard';
import LyricCover from '@/components/LyricCover';
import MarqueeBand from '@/components/MarqueeBand';
import SectionHeader from '@/components/SectionHeader';
import Sticker from '@/components/Sticker';
import BigBtn from '@/components/BigBtn';
import MoodRail from '@/components/MoodRail';
import { api } from '@/lib/api';

export default function HomePage() {
  const [lyrics,  setLyrics]  = useState([]);
  const [writers, setWriters] = useState([]);
  const [loaded,  setLoaded]  = useState(false);
  const [mood,    setMood]    = useState(null);

  useEffect(() => {
    Promise.all([api.getLyrics({ limit: 50 }), api.getWriters()])
      .then(([l, w]) => { setLyrics(l); setWriters(w); })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  const trending = lyrics.filter(l => l.tag === 'TRENDING' || l.tag === 'HOT').slice(0, 4);
  const bidding  = lyrics.filter(l => l.bidding).slice(0, 3);
  const topWriters = writers.slice(0, 3);
  const filtered = mood ? lyrics.filter(l => l.mood?.includes(mood)) : lyrics;
  const allListings = filtered.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <div style={{ position: 'relative', padding: '40px 0 60px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 30, right: '8%', zIndex: 3 }}>
          <Sticker color="var(--pink)" rotate={14} size={16}>★ 4.9 from 12k writers</Sticker>
        </div>
        <div style={{ position: 'absolute', top: 200, left: '4%', zIndex: 3 }}>
          <Sticker color="var(--blue)" ink="var(--bg)" rotate={-8} size={14} shape="rect">non-exclusive from $80</Sticker>
        </div>
        <div style={{ position: 'absolute', bottom: 90, right: '12%', zIndex: 3 }}>
          <Sticker color="var(--orange)" rotate={6} size={14}>↻ 240 sold this week</Sticker>
        </div>
        <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(72px, 13vw, 220px)', lineHeight: 0.85, letterSpacing: '-0.04em', position: 'relative', zIndex: 2 }}>
          <div>WRITE IT.</div>
          <div style={{ paddingLeft: '8%' }}>
            <span style={{ background: 'var(--lime)', padding: '0 16px', border: '3px solid var(--ink)', boxShadow: '6px 6px 0 var(--ink)', display: 'inline-block', transform: 'rotate(-1deg)' }}>SELL IT.</span>
          </div>
          <div style={{ textAlign: 'right' }}>SING IT.</div>
        </h1>
        <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/browse" style={{ textDecoration: 'none' }}><BigBtn size="lg" color="var(--lime)">BROWSE THE GOODS →</BigBtn></Link>
          <Link href="/signup?role=writer" style={{ textDecoration: 'none' }}><BigBtn size="lg" color="var(--bg)">I'M A WRITER</BigBtn></Link>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.7, marginLeft: 8 }}>no signup. just vibes.</div>
        </div>
        <div style={{ marginTop: 50, display: 'flex', gap: 24, alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.65, flexWrap: 'wrap', borderTop: '1.5px dashed var(--ink)', paddingTop: 16 }}>
          <span>★ trusted by writers from 47 countries</span><span>·</span>
          <span>★ 18,402 hooks listed</span><span>·</span>
          <span>★ payout in 48h</span>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ margin: '24px -32px' }}>
        <MarqueeBand items={['NEW DROPS DAILY', 'PAYOUT IN 48H', 'BID OR BUY', '0% AI SLOP', 'WRITERS GET 85%', 'EXCLUSIVE LICENSES']} color="var(--ink)" ink="var(--lime)" speed={45} fontSize={36} height={64} />
      </div>

      {/* Mood rail */}
      <div style={{ marginTop: 12 }}>
        <SectionHeader accent="var(--pink)" right={
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7 }}>
            {loaded ? `${filtered.length} listings` : '—'}
          </div>
        }>browse by mood</SectionHeader>
        <MoodRail active={mood} onPick={setMood} />
      </div>

      {/* Hot right now */}
      <div style={{ marginTop: 48 }}>
        <SectionHeader accent="var(--lime)" right={<Link href="/browse" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'inherit', borderBottom: '2px solid var(--ink)' }}>see all →</Link>}>
          🔥 hot right now
        </SectionHeader>
        {!loaded ? (
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.5, padding: '40px 0' }}>loading...</div>
        ) : trending.length > 0 ? (
          <div className="hl-grid-4">
            {trending.map(l => <LyricsCard key={l.id} lyric={l} size="sm" />)}
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.5, padding: '40px 0' }}>no trending lyrics yet — be the first to post.</div>
        )}
      </div>

      {/* Auction floor */}
      {bidding.length > 0 && (
        <div style={{ marginTop: 56, background: 'var(--ink)', color: 'var(--bg)', padding: '40px 32px', margin: '56px -32px 0', borderTop: '3px solid var(--ink)', borderBottom: '3px solid var(--ink)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>
              <span style={{ color: 'var(--lime)' }}>auction</span> floor
              <Sticker color="var(--pink)" rotate={-8} size={14} style={{ marginLeft: 16, transform: 'rotate(-8deg) translateY(-12px)' }}>⚡ ends soon</Sticker>
            </h2>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7 }}>outbid? we'll dm u</div>
          </div>
          <div className="hl-grid-3" style={{ gap: 32 }}>
            {bidding.map(l => {
              const coverData = { bg: l.cover?.bg ?? '#C6FF3D', ink: l.cover?.ink ?? '#0E0E10', emoji: l.cover?.emoji ?? '🎤', shape: l.cover?.shape ?? 'rect' };
              return (
                <Link key={l.id} href={`/lyrics/${l.id}`} style={{ textDecoration: 'none', color: 'var(--bg)' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <LyricCover lyric={{ ...l, cover: coverData }} size={140} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l.writer?.handle || ''}</div>
                      <div style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1, marginTop: 4 }}>{l.title}</div>
                      <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--bg)', color: 'var(--ink)', borderRadius: 6 }}>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.7 }}>current top bid</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <span style={{ fontFamily: 'var(--display)', fontSize: 26, lineHeight: 1 }}>${l.current_bid || l.price}</span>
                          {l.bidders_count > 0 && (
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6 }}>· {l.bidders_count} bidders</span>
                          )}
                        </div>
                      </div>
                      {l.bid_ends && (
                        <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--lime)', fontWeight: 700 }}>
                          ⏱ ends in {l.bid_ends}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Top writers */}
      {topWriters.length > 0 && (
        <div style={{ marginTop: 56 }}>
          <SectionHeader accent="var(--blue)" right={<Link href="/writers" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'inherit', borderBottom: '2px solid var(--ink)' }}>more writers →</Link>}>
            writers we're obsessed with
          </SectionHeader>
          <div className="hl-grid-3">
            {topWriters.map(w => <WriterCard key={w.id} writer={w} />)}
          </div>
        </div>
      )}

      {/* All listings */}
      {allListings.length > 0 && (
        <div style={{ marginTop: 56 }}>
          <SectionHeader accent="var(--orange)" right={<div style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7 }}>sort: hot ↓</div>}>{mood ? `${mood} hooks` : 'all listings'}</SectionHeader>
          <div className="hl-grid-4">
            {allListings.map(l => <LyricsCard key={l.id} lyric={l} size="sm" />)}
          </div>
        </div>
      )}

      {/* Sell CTA */}
      <div style={{ marginTop: 80, position: 'relative', border: '3px solid var(--ink)', borderRadius: 16, background: 'var(--lime)', color: 'var(--ink)', padding: '48px 40px', boxShadow: '8px 8px 0 var(--ink)', overflow: 'hidden' }}>
        <Sticker color="var(--pink)" rotate={-12} size={16} style={{ position: 'absolute', top: 18, right: 18 }}>writers ↓</Sticker>
        <div className="hl-split">
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}>
              you got bars?<br />
              <span style={{ background: 'var(--bg)', padding: '0 12px', display: 'inline-block', border: '3px solid var(--ink)', transform: 'rotate(-1deg)', marginTop: 6 }}>we got buyers.</span>
            </h2>
            <div style={{ marginTop: 20, fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.5, maxWidth: 460 }}>
              upload a lyric, set ur price, post a teaser. we handle licenses, payouts, and the boring stuff. writers keep <b>85%</b>. yes really.
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <Link href="/signup?role=writer" style={{ textDecoration: 'none' }}><BigBtn size="md" color="var(--ink)" ink="var(--lime)">START WRITING →</BigBtn></Link>
              <Link href="/browse" style={{ textDecoration: 'none' }}><BigBtn size="md" color="var(--bg)">see what sells</BigBtn></Link>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.4 }}>
            {[['1️⃣', 'post a teaser (2 lines max)'], ['2️⃣', 'set price + license type'], ['3️⃣', 'get paid in 48h']].map(([n, t]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg)', border: '2px solid var(--ink)', borderRadius: 8 }}>
                <span style={{ fontSize: 22 }}>{n}</span><span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
