'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import BigBtn from '@/components/BigBtn';

export default function WriterDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lyrics,  setLyrics]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    if (user.id) {
      api.getWriterLyrics(user.id)
        .then(setLyrics)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  const totalSold    = lyrics.reduce((s, l) => s + (l.sold_count || 0), 0);
  const totalEarned  = lyrics.reduce((s, l) => s + (l.sold_count || 0) * l.price * 0.85, 0);

  if (authLoading || loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>loading...</div>
  );

  return (
    <main style={{ paddingTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>
            writer dashboard
          </h1>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.6, marginTop: 6 }}>
            welcome back, {user?.handle}
          </div>
        </div>
        <Link href="/post" style={{ textDecoration: 'none' }}>
          <BigBtn size="md" color="var(--lime)">+ post a hook</BigBtn>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'total earned', value: `$${Math.round(totalEarned).toLocaleString()}`, color: 'var(--lime)' },
          { label: 'total sales',  value: totalSold,            color: 'var(--ink)' },
          { label: 'listings',     value: lyrics.length,        color: 'var(--ink)' },
          { label: 'avg price',    value: lyrics.length ? `$${Math.round(lyrics.reduce((s,l) => s+l.price,0)/lyrics.length)}` : '—', color: 'var(--ink)' },
        ].map(stat => (
          <div key={stat.label} style={{ padding: 20, border: '2.5px solid var(--ink)', borderRadius: 12, background: stat.color === 'var(--lime)' ? 'var(--lime)' : 'var(--bg)', boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 36, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.65, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Listings table */}
      <div style={{ border: '2.5px solid var(--ink)', borderRadius: 12, overflow: 'hidden', boxShadow: '4px 4px 0 var(--ink)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '2px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 24, letterSpacing: '-0.01em' }}>your listings</div>
          <Link href="/browse" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'inherit', borderBottom: '1.5px solid var(--ink)' }}>view on marketplace →</Link>
        </div>

        {lyrics.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--mono)', opacity: 0.5 }}>
            no listings yet.{' '}
            <Link href="/post" style={{ color: 'inherit', borderBottom: '1.5px solid var(--ink)' }}>post your first hook →</Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--ink)' }}>
                {['title', 'genre', 'price', 'sold', 'plays', ''].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lyrics.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid rgba(14,14,16,0.1)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 18, lineHeight: 1 }}>{l.title}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.55, marginTop: 2 }}>{l.mood?.join(', ')}</div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: 'var(--ink)', color: 'var(--bg)' }}>{l.genre}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--display)', fontSize: 20 }}>${l.price}</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: 13 }}>{l.sold_count || 0}</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.6 }}>{l.plays}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <Link href={`/lyrics/${l.id}`} style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'inherit', borderBottom: '1.5px solid var(--ink)' }}>view →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
