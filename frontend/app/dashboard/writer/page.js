'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import BigBtn from '@/components/BigBtn';
import LyricsCard from '@/components/LyricsCard';

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

export default function WriterDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lyrics,   setLyrics]   = useState([]);
  const [bids,     setBids]     = useState([]);
  const [threads,  setThreads]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    Promise.all([
      user.id ? api.getWriterLyrics(user.id) : Promise.resolve([]),
      api.myBids().catch(() => []),
      api.myThreads().catch(() => []),
    ]).then(([l, b, t]) => {
      setLyrics(l);
      setBids(b);
      setThreads(t);
    }).catch(console.error).finally(() => setLoading(false));
  }, [user, authLoading]);

  const totalSold   = lyrics.reduce((s, l) => s + (l.sold_count || 0), 0);
  const totalEarned = lyrics.reduce((s, l) => s + (l.sold_count || 0) * l.price * 0.85, 0);
  const activeBids  = bids.filter(b => b.status === 'active' || !b.status).length;
  const unreadCount = threads.reduce((s, t) => s + (t.unread_count || 0), 0);
  const firstName   = (user?.display_name || user?.handle || 'writer').split(' ')[0].toLowerCase();

  const recentSold = lyrics.filter(l => (l.sold_count || 0) > 0).slice(0, 3);

  if (authLoading || loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>loading...</div>
  );

  return (
    <main style={{ paddingTop: 8, display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>

      {/* HERO */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '40px 36px', borderRadius: 18,
        background: 'linear-gradient(135deg, var(--pink) 0%, var(--orange) 100%)',
        color: 'var(--bg)', border: '2px solid var(--ink)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700,
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                          background: 'var(--ink)', color: 'var(--bg)',
                          display: 'inline-block', padding: '4px 10px', marginBottom: 14 }}>
              ✍︎ writer studio
            </div>
            <h1 style={{ margin: 0, fontFamily: 'var(--display)',
                         fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.9,
                         letterSpacing: '-0.03em' }}>
              hi {firstName}.
            </h1>
            <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 14, maxWidth: 480 }}>
              {totalEarned > 0
                ? <>you've made <b>${Math.round(totalEarned).toLocaleString()}</b> total.{' '}</>
                : 'post your first lyric and start earning. '}
              {activeBids > 0 && <>{activeBids} active bid{activeBids > 1 ? 's' : ''},{' '}</>}
              {unreadCount > 0 && <>{unreadCount} unread DM{unreadCount > 1 ? 's' : ''}.</>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/post" style={{ textDecoration: 'none' }}>
              <BigBtn size="md" color="var(--ink)" ink="var(--lime)">+ post a hook</BigBtn>
            </Link>
            {unreadCount > 0 && (
              <Link href="/inbox" style={{ textDecoration: 'none' }}>
                <BigBtn size="md" color="var(--bg)" ink="var(--ink)">inbox ({unreadCount})</BigBtn>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <StatTile
          label="total earned"
          value={`$${Math.round(totalEarned).toLocaleString()}`}
          sub="writers keep 85%"
          color="var(--lime)"
        />
        <StatTile
          label="total sales"
          value={totalSold}
          sub={totalSold === 1 ? '1 license sold' : `${totalSold} licenses sold`}
        />
        <StatTile
          label="active bids"
          value={activeBids || '—'}
          sub={activeBids > 0 ? 'on your lyrics' : 'no bids yet'}
          color={activeBids > 0 ? 'var(--yellow)' : 'var(--bg)'}
        />
        <StatTile
          label="lyrics live"
          value={lyrics.length || '—'}
          sub={lyrics.length === 0 ? 'post your first hook' : `${recentSold.length} sold at least once`}
        />
      </section>

      {/* RECENT SALES + LISTINGS */}
      <section style={{ display: 'grid', gridTemplateColumns: recentSold.length ? '1.1fr 1fr' : '1fr', gap: 20 }}>
        {recentSold.length > 0 && (
          <div style={{ border: '2px solid var(--ink)', borderRadius: 14,
                        background: 'var(--ink)', color: 'var(--bg)', padding: 20 }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--display)',
                         fontSize: 26, letterSpacing: '-0.02em', color: 'var(--lime)' }}>
              sold listings
            </h3>
            <div style={{ marginTop: 12 }}>
              {recentSold.map((l, i) => (
                <div key={l.id} style={{
                  display: 'flex', gap: 12, padding: '12px 0', alignItems: 'center',
                  borderTop: i ? '1px dashed rgba(255,248,231,0.2)' : 'none',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 18, lineHeight: 1.1,
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.title}
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                      {l.sold_count} sold · {l.genre}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--display)', fontSize: 22, color: 'var(--lime)', flexShrink: 0 }}>
                    ${Math.round(l.sold_count * l.price * 0.85)}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/browse" style={{ textDecoration: 'none' }}>
              <BigBtn size="sm" color="var(--lime)" full style={{ marginTop: 16 }}>view on marketplace →</BigBtn>
            </Link>
          </div>
        )}

        <div style={{ border: '2px solid var(--ink)', borderRadius: 14, background: 'var(--bg)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 26, letterSpacing: '-0.02em' }}>quick actions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { href: '/post', label: '+ post a new hook', color: 'var(--lime)' },
              { href: '/inbox', label: '✉ check your inbox', color: 'var(--bg)' },
              { href: '/browse', label: '↗ view marketplace', color: 'var(--bg)' },
            ].map(({ href, label, color }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <BigBtn size="sm" color={color} full>{label}</BigBtn>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MY LISTINGS */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'baseline', marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--display)',
                       fontSize: 36, letterSpacing: '-0.02em' }}>
            your listings
          </h2>
          <Link href="/post" style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.7, color: 'inherit' }}>
            + new listing
          </Link>
        </div>
        {lyrics.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', fontFamily: 'var(--mono)', opacity: 0.5 }}>
            no listings yet.{' '}
            <Link href="/post" style={{ color: 'inherit', borderBottom: '1.5px solid var(--ink)' }}>post your first hook →</Link>
          </div>
        ) : (
          <div className="hl-grid-4">
            {lyrics.slice(0, 8).map(l => <LyricsCard key={l.id} lyric={l} size="sm" />)}
          </div>
        )}
      </section>

    </main>
  );
}
