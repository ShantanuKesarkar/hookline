'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import LyricCover from '@/components/LyricCover';
import Avatar from '@/components/Avatar';
import Sticker from '@/components/Sticker';
import BigBtn from '@/components/BigBtn';
import Tag from '@/components/Tag';
import SectionHeader from '@/components/SectionHeader';
import LyricsCard from '@/components/LyricsCard';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { timeLeft } from '@/lib/utils';

export default function LyricDetailPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [lyric,   setLyric]   = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tier,    setTier]    = useState('non');
  const [bidAmt,  setBidAmt]  = useState(0);

  useEffect(() => {
    api.getLyric(id)
      .then(l => {
        setLyric(l);
        setBidAmt((l.current_bid || 0) + 50);
        if (l.writer?.id) {
          api.getWriterLyrics(l.writer.id)
            .then(r => setRelated(r.filter(x => x.id !== id).slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>loading...</div>;
  if (!lyric)  return <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--mono)' }}>lyric not found.</div>;

  const writer   = lyric.writer || {};
  const coverData = { bg: lyric.cover?.bg ?? '#C6FF3D', ink: lyric.cover?.ink ?? '#0E0E10', emoji: lyric.cover?.emoji ?? '🎤', shape: lyric.cover?.shape ?? 'rect' };
  const bidLeft  = timeLeft(lyric.bid_ends);
  const tiers    = [
    { id: 'non', label: 'non-exclusive', price: lyric.price,           desc: 'sold to up to 3 buyers. credit required.', color: 'var(--lime)' },
    { id: 'ex',  label: 'exclusive',     price: lyric.exclusive_price, desc: 'only you can ever release this lyric.',    color: 'var(--pink)' },
    ...(lyric.bidding ? [{ id: 'bid', label: 'make an offer', price: null, desc: `top bid $${lyric.current_bid}${bidLeft ? `. ends ${bidLeft}` : ''}.`, color: 'var(--blue)' }] : []),
  ];
  const activeTier = tiers.find(t => t.id === tier) || tiers[0];

  async function handleBid() {
    if (!user) { window.location.href = '/login'; return; }
    try {
      await api.placeBid({ lyric_id: lyric.id, amount: bidAmt });
      alert(`Bid of $${bidAmt} placed!`);
    } catch (err) { alert(err.message); }
  }

  return (
    <div style={{ paddingTop: 16 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7, marginBottom: 24, display: 'flex', gap: 8 }}>
        <Link href="/" style={{ color: 'inherit', borderBottom: '1.5px solid var(--ink)' }}>home</Link>
        <span>/</span>
        <Link href="/browse" style={{ color: 'inherit', borderBottom: '1.5px solid var(--ink)' }}>browse</Link>
        <span>/</span>
        <span style={{ opacity: 0.6 }}>{lyric.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'flex-start' }}>
        <div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <LyricCover lyric={{ ...lyric, cover: coverData }} size={460} />
            {lyric.tag && <div style={{ position: 'absolute', top: -16, right: -22 }}><Sticker color="var(--pink)" rotate={10} size={16}>{lyric.tag}</Sticker></div>}
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 24, fontFamily: 'var(--mono)', fontSize: 12, paddingTop: 16, borderTop: '2px solid var(--ink)' }}>
            {[['plays', lyric.plays], ['saves', lyric.saves], ['comments', lyric.comments], ['bpm', lyric.bpm ?? '—'], ['key', lyric.key ?? '—']].map(([l, v]) => (
              <div key={l}><b style={{ fontFamily: 'var(--display)', fontSize: 22, display: 'block' }}>{v}</b>{l}</div>
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, opacity: 0.7 }}>
              {lyric.full_text ? '✓ full lyric · purchased' : '🔒 preview snippet'}
            </div>
            <div style={{ position: 'relative', padding: '24px 28px', background: lyric.full_text ? 'var(--lime)' : 'var(--bg)', border: '2.5px solid var(--ink)', borderRadius: 12, boxShadow: '4px 4px 0 var(--ink)', fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1.3 }}>
              {(lyric.full_text ? lyric.full_text.split('\n') : lyric.teaser.split('\n')).map((line, i) => (
                <div key={i} style={{ filter: !lyric.full_text && i >= 2 ? 'blur(8px)' : 'none', fontStyle: line.startsWith('[') ? 'italic' : 'normal', fontSize: line.startsWith('[') ? 14 : 22, fontFamily: line.startsWith('[') ? 'var(--mono)' : 'var(--display)', minHeight: line === '' ? '12px' : 'auto' }}>{line || '·'}</div>
              ))}
              {!lyric.full_text && <div style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.6, fontStyle: 'italic' }}>...buy a license to unlock the full hook</div>}
            </div>
          </div>

          <div style={{ marginTop: 32, padding: 16, border: '2.5px solid var(--ink)', borderRadius: 12, background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '3px 3px 0 var(--ink)' }}>
            <Link href={`/writers/${writer.id}`} style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, textDecoration: 'none', color: 'inherit' }}>
              {writer.color && <Avatar writer={writer} size={56} />}
              <div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1 }}>{writer.name || 'Unknown'}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7, marginTop: 2 }}>{writer.handle}</div>
              </div>
            </Link>
            <Link href="/inbox" style={{ textDecoration: 'none' }}><BigBtn size="sm" color="var(--lime)">💌 dm</BigBtn></Link>
          </div>
        </div>

        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{lyric.genre} · {(lyric.mood || []).join(', ')}</div>
          <h1 style={{ margin: '8px 0 0', fontFamily: 'var(--display)', fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}>{lyric.title}</h1>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(lyric.mood || []).map(m => <Tag key={m} color="var(--lime)">{m}</Tag>)}
          </div>

          {lyric.ai_summary && (
            <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--bg)', border: '2px dashed var(--ink)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.5, opacity: 0.85 }}>
              <span style={{ fontWeight: 700, opacity: 0.5 }}>✦ AI SUMMARY · </span>{lyric.ai_summary}
            </div>
          )}

          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, opacity: 0.7 }}>↓ pick ur license</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tiers.map(t => (
                <div key={t.id} onClick={() => setTier(t.id)} style={{ padding: 16, borderRadius: 10, cursor: 'pointer', background: tier === t.id ? t.color : 'var(--bg)', border: '2.5px solid var(--ink)', boxShadow: tier === t.id ? '4px 4px 0 var(--ink)' : 'none', transform: tier === t.id ? 'translate(-2px,-2px)' : 'none', transition: 'all .12s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--display)', fontSize: 22 }}>{t.label}</span>
                    <span style={{ fontFamily: 'var(--display)', fontSize: 24 }}>{t.price ? `$${t.price}` : 'bid'}</span>
                  </div>
                  <div style={{ marginTop: 6, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.4, opacity: 0.85 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 20, background: 'var(--ink)', color: 'var(--bg)', borderRadius: 12 }}>
            {tier !== 'bid' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7 }}>you pay</span>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 36, lineHeight: 1 }}>${activeTier.price}</span>
                </div>
                <Link href={user ? `/checkout/${lyric.id}?tier=${tier}` : '/login'} style={{ textDecoration: 'none' }}>
                  <BigBtn full size="lg" color="var(--lime)">buy this lyric →</BigBtn>
                </Link>
                <div style={{ marginTop: 10, fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.6, textAlign: 'center' }}>instant download · 7-day refund · pdf + .txt</div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7, marginBottom: 8 }}>ur offer</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 36 }}>$</span>
                  <input type="number" value={bidAmt} onChange={e => setBidAmt(+e.target.value)} style={{ flex: 1, fontFamily: 'var(--display)', fontSize: 36, background: 'transparent', color: 'var(--lime)', border: 'none', borderBottom: '2px solid var(--lime)', outline: 'none', padding: '4px 0' }} />
                </div>
                <BigBtn full size="lg" color="var(--lime)" onClick={handleBid}>place bid →</BigBtn>
              </>
            )}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <BigBtn full size="sm" color="var(--bg)">♡ save</BigBtn>
            <BigBtn full size="sm" color="var(--bg)">⤴ share</BigBtn>
            <BigBtn full size="sm" color="var(--bg)">⚠ flag</BigBtn>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 80 }}>
          <SectionHeader accent="var(--orange)">more from {writer.handle}</SectionHeader>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
            {related.map(l => <LyricsCard key={l.id} lyric={l} size="sm" />)}
          </div>
        </div>
      )}
    </div>
  );
}
