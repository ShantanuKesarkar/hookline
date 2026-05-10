'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import BigBtn from '@/components/BigBtn';
import LyricsCard from '@/components/LyricsCard';
import LyricCover from '@/components/LyricCover';

const MOOD_CHIPS = [
  'heartbreak 💔', 'gym hype 🔥', 'late night 🌙',
  'situationship 🫠', 'soft ☁️', 'chaotic 🌀',
];

function StatTile({ label, value, sub, color = 'var(--bg)', ink = 'var(--ink)' }) {
  return (
    <div style={{
      padding: '20px 22px', background: color, color: ink,
      border: '2px solid var(--ink)', borderRadius: 12,
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--display)', fontSize: 44,
                    lineHeight: 0.95, letterSpacing: '-0.02em', marginTop: 6 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7, marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

const FALLBACK_COVER = { bg: '#C6FF3D', ink: '#0E0E10', emoji: '🎤', shape: 'rect' };

export default function BuyerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router   = useRouter();
  const [licenses,  setLicenses]  = useState([]);
  const [bids,      setBids]      = useState([]);
  const [trending,  setTrending]  = useState([]);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    Promise.all([
      api.myLicenses().catch(() => []),
      api.myBids().catch(() => []),
      api.getLyrics({ limit: 6 }).catch(() => []),
    ]).then(([lic, b, lyr]) => {
      setLicenses(lic);
      setBids(b);
      setTrending(lyr);
    }).catch(console.error).finally(() => setLoading(false));
  }, [user, authLoading]);

  const totalSpent    = licenses.reduce((s, l) => s + (l.price_paid || 0), 0);
  const exclusiveCount = licenses.filter(l => l.license_type === 'exclusive').length;
  const activeBids    = bids.filter(b => b.status === 'active' || !b.status);
  const firstName     = (user?.display_name || user?.handle || 'artist').split(' ')[0].toLowerCase();

  function handleSearch(e) {
    e.preventDefault();
    const q = search.trim();
    if (q) router.push(`/browse?q=${encodeURIComponent(q)}`);
    else router.push('/browse');
  }

  if (authLoading || loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>loading...</div>
  );

  return (
    <main style={{ paddingTop: 8, display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>

      {/* HERO */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '40px 36px', borderRadius: 18,
        background: 'linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%)',
        color: 'var(--bg)', border: '2px solid var(--ink)',
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      background: 'var(--ink)', color: 'var(--bg)',
                      display: 'inline-block', padding: '4px 10px', marginBottom: 14 }}>
          ♫ artist crate
        </div>
        <h1 style={{ margin: 0, fontFamily: 'var(--display)',
                     fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.9,
                     letterSpacing: '-0.03em' }}>
          hi {firstName}, what are you<br />
          <span style={{
            background: 'var(--lime)', color: 'var(--ink)',
            padding: '0 14px', display: 'inline-block',
            border: '2px solid var(--ink)',
          }}>looking for</span> today?
        </h1>
        <form onSubmit={handleSearch} style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 720 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔎 search by mood, genre, bpm, key, vibe..."
            style={{
              flex: 1, minWidth: 260, padding: '14px 18px',
              border: '2px solid var(--ink)', borderRadius: 10,
              fontFamily: 'var(--mono)', fontSize: 14,
              background: 'var(--bg)', color: 'var(--ink)', outline: 'none',
            }}
          />
          <Link href="/browse" style={{ textDecoration: 'none' }}>
            <BigBtn size="md" color="var(--ink)" ink="var(--lime)" type="button">browse all →</BigBtn>
          </Link>
        </form>
        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {MOOD_CHIPS.map(m => (
            <Link key={m} href={`/browse?mood=${encodeURIComponent(m.split(' ')[0])}`} style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '6px 12px', border: '1.5px solid var(--bg)',
                borderRadius: 999, background: 'transparent',
                color: 'var(--bg)', fontFamily: 'var(--mono)', fontSize: 12,
                cursor: 'pointer',
              }}>{m}</button>
            </Link>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatTile label="purchased" value={licenses.length} sub="total licenses" color="var(--lime)" />
        <StatTile label="total spent" value={`$${totalSpent.toLocaleString()}`} sub="across all licenses" />
        <StatTile label="exclusive" value={exclusiveCount} sub="yours only" color={exclusiveCount > 0 ? 'var(--yellow)' : 'var(--bg)'} />
        <StatTile label="watching" value={activeBids.length || '—'} sub={activeBids.length ? 'active bids' : 'no active bids'} />
      </section>

      {/* WATCHING (active bids) */}
      {activeBids.length > 0 && (
        <section style={{ border: '2px solid var(--ink)', borderRadius: 14, background: 'var(--bg)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 32, letterSpacing: '-0.02em' }}>
              ⏰ you're watching
            </h2>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7 }}>outbid alerts on</span>
          </div>
          <div className="hl-grid-3">
            {activeBids.slice(0, 3).map(bid => {
              const cover = bid.lyric?.cover || FALLBACK_COVER;
              return (
                <div key={bid.id} style={{ display: 'flex', gap: 14, padding: 14, border: '1.5px solid var(--ink)', borderRadius: 12 }}>
                  <LyricCover lyric={{ cover, title: bid.lyric?.title || '—' }} size={88} hideTitle />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 20, lineHeight: 1.05, marginBottom: 4 }}>
                      {bid.lyric?.title || `Lyric #${bid.lyric_id}`}
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, marginTop: 8 }}>
                      your bid: <b style={{ color: 'var(--pink)' }}>${bid.amount}</b>
                    </div>
                    <Link href={`/lyrics/${bid.lyric_id}`} style={{ textDecoration: 'none' }}>
                      <BigBtn size="sm" color="var(--lime)" style={{ marginTop: 8 }}>view →</BigBtn>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PURCHASED LYRICS */}
      {licenses.length > 0 && (
        <section style={{ border: '2px solid var(--ink)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '2px solid var(--ink)', background: 'var(--ink)', color: 'var(--bg)' }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 26, letterSpacing: '-0.01em', color: 'var(--lime)' }}>
              purchased lyrics
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {licenses.slice(0, 5).map((l, i) => (
              <div key={l.id} style={{
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                borderBottom: i < Math.min(licenses.length, 5) - 1 ? '1px solid rgba(14,14,16,0.1)' : 'none',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--display)', fontSize: 20, lineHeight: 1 }}>
                    {l.lyric_title || `License #${l.id}`}
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.55, marginTop: 2 }}>
                    {new Date(l.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 999, border: '2px solid var(--ink)',
                  background: l.license_type === 'exclusive' ? 'var(--pink)' : 'var(--lime)',
                  color: l.license_type === 'exclusive' ? 'var(--bg)' : 'var(--ink)',
                }}>
                  {l.license_type}
                </span>
                <div style={{ fontFamily: 'var(--display)', fontSize: 22 }}>${l.price_paid}</div>
                <Link href={`/lyrics/${l.lyric_id}`} style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'inherit', borderBottom: '1.5px solid var(--ink)' }}>
                  view →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOR YOUR NEXT SESSION */}
      {trending.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 36, letterSpacing: '-0.02em' }}>
              for your next session
            </h2>
            <Link href="/browse" style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.7, color: 'inherit' }}>
              see all →
            </Link>
          </div>
          <div className="hl-grid-3">
            {trending.slice(0, 6).map(l => <LyricsCard key={l.id} lyric={l} size="sm" />)}
          </div>
        </section>
      )}

      <div style={{ padding: 16, border: '1.5px dashed var(--ink)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.5, opacity: 0.6 }}>
        all purchased lyrics require writer credit on commercial release. see your license agreement for full terms.
      </div>

    </main>
  );
}
