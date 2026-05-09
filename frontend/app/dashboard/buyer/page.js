'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import BigBtn from '@/components/BigBtn';

export default function BuyerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router  = useRouter();
  const [licenses, setLicenses] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    api.myLicenses()
      .then(setLicenses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const totalSpent   = licenses.reduce((s, l) => s + (l.price_paid || 0), 0);
  const exclusiveCount = licenses.filter(l => l.license_type === 'exclusive').length;

  if (authLoading || loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>loading...</div>
  );

  return (
    <main style={{ paddingTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>my licenses</h1>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.6, marginTop: 6 }}>welcome back, {user?.handle}</div>
        </div>
        <Link href="/browse" style={{ textDecoration: 'none' }}>
          <BigBtn size="md" color="var(--lime)">browse more →</BigBtn>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'licenses purchased', value: licenses.length },
          { label: 'total spent',        value: `$${totalSpent.toLocaleString()}` },
          { label: 'exclusive licenses', value: exclusiveCount },
        ].map((stat, i) => (
          <div key={stat.label} style={{ padding: 20, border: '2.5px solid var(--ink)', borderRadius: 12, background: i === 0 ? 'var(--lime)' : 'var(--bg)', boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 36, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.65, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Licenses list */}
      <div style={{ border: '2.5px solid var(--ink)', borderRadius: 12, overflow: 'hidden', boxShadow: '4px 4px 0 var(--ink)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '2px solid var(--ink)' }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 24, letterSpacing: '-0.01em' }}>purchased lyrics</div>
        </div>

        {licenses.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--mono)', opacity: 0.5 }}>
            no licenses yet.{' '}
            <Link href="/browse" style={{ color: 'inherit', borderBottom: '1.5px solid var(--ink)' }}>browse lyrics →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {licenses.map((l, i) => (
              <div key={l.id} style={{ padding: '16px 20px', borderBottom: i < licenses.length - 1 ? '1px solid rgba(14,14,16,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--display)', fontSize: 20, lineHeight: 1 }}>{l.lyric_id}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.55, marginTop: 2 }}>
                    {new Date(l.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 999, border: '2px solid var(--ink)',
                  background: l.license_type === 'exclusive' ? 'var(--pink)' : 'var(--lime)',
                }}>
                  {l.license_type}
                </span>
                <div style={{ fontFamily: 'var(--display)', fontSize: 22 }}>${l.price_paid}</div>
                <Link href={`/lyrics/${l.lyric_id}`} style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'inherit', borderBottom: '1.5px solid var(--ink)' }}>view →</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20, padding: 16, border: '1.5px dashed var(--ink)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.5, opacity: 0.6 }}>
        all purchased lyrics require writer credit on commercial release. see your license agreement for full terms.
      </div>
    </main>
  );
}
