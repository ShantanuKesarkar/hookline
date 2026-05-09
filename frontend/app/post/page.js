'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BigBtn from '@/components/BigBtn';
import Sticker from '@/components/Sticker';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

const COVER_SHAPES = ['rect', 'blob', 'circle', 'burst'];
const COVER_COLORS = ['#C6FF3D', '#FF3D8A', '#2D52FF', '#FF6B1A', '#FFD23F', '#A24BFF', '#0E0E10', '#FFF8E7'];
const COVER_EMOJIS = ['🎤', '💊', '🌙', '🪩', '🧊', '💸', '🎸', '🌷', '🥀', '⛪', '📺', '🦷', '💙', '🎰'];
const fieldStyle = { width: '100%', padding: '12px 14px', border: '2.5px solid var(--ink)', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 14, background: 'var(--bg)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' };

function Field({ label, sub, children }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
        <span>{label}</span>
        {sub && <span style={{ opacity: 0.6, fontWeight: 400, textTransform: 'none' }}>{sub}</span>}
      </div>
      {children}
    </label>
  );
}

export default function SellPage() {
  const { user } = useAuth();
  const router   = useRouter();
  const [title,    setTitle]    = useState('');
  const [teaser,   setTeaser]   = useState('');
  const [body,     setBody]     = useState('');
  const [genre,    setGenre]    = useState('');
  const [moods,    setMoods]    = useState('');
  const [price,    setPrice]    = useState(200);
  const [exPrice,  setExPrice]  = useState(1500);
  const [bidding,  setBidding]  = useState(false);
  const [coverBg,  setCoverBg]  = useState('#C6FF3D');
  const [coverEmoji, setCoverEmoji] = useState('🎤');
  const [coverShape, setCoverShape] = useState('rect');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit() {
    if (!user) { router.push('/login'); return; }
    if (!title || !teaser || !body || !genre) { setError('fill in all required fields'); return; }
    setError('');
    setLoading(true);
    try {
      const lyric = await api.createLyric({
        title, teaser, full_text: body, genre,
        mood: moods.split(',').map(m => m.trim()).filter(Boolean),
        price: Number(price), exclusive_price: Number(exPrice),
        cover_bg: coverBg, cover_ink: '#0E0E10',
        cover_emoji: coverEmoji, cover_shape: coverShape,
        bidding,
      });
      router.push(`/lyrics/${lyric.id}`);
    } catch (err) {
      setError(err.message || 'failed to post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 16, maxWidth: 980, margin: '16px auto 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}>post a hook</h1>
        <Sticker color="var(--lime)" rotate={-6} size={14} style={{ alignSelf: 'flex-start', marginTop: 16 }}>earn 85%</Sticker>
      </div>
      <div style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 14, opacity: 0.85, maxWidth: 560 }}>
        drop ur lyric, set the price. we encrypt the full text until someone buys. teaser stays public.
      </div>

      {error && (
        <div style={{ marginTop: 16, background: 'var(--pink)', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 12, padding: '10px 14px', borderRadius: 8, border: '2px solid var(--ink)' }}>{error}</div>
      )}

      <div className="hl-split-narrow" style={{ marginTop: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="title" sub="make it loud"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. PARKING LOT MESSIAH" style={fieldStyle} /></Field>
          <Field label="teaser" sub="2 lines max · public preview">
            <textarea value={teaser} onChange={e => setTeaser(e.target.value)} rows={2} placeholder={"praying to a 7-eleven\nwith a slurpee in my hand"} style={{ ...fieldStyle, resize: 'vertical', fontFamily: 'var(--display)', fontSize: 18 }} />
          </Field>
          <Field label="full lyric" sub="locked until purchased 🔒">
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={8} placeholder="paste the rest..." style={{ ...fieldStyle, resize: 'vertical' }} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="genre"><input value={genre} onChange={e => setGenre(e.target.value)} placeholder="indie pop" style={fieldStyle} /></Field>
            <Field label="mood tags" sub="comma separated"><input value={moods} onChange={e => setMoods(e.target.value)} placeholder="late night, breakup, soft" style={fieldStyle} /></Field>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 80 }}>
          {/* Cover preview */}
          <div style={{ padding: 16, border: '2.5px solid var(--ink)', borderRadius: 12, background: 'var(--bg)', boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 12 }}>cover preview</div>
            <div style={{ width: '100%', aspectRatio: '1', background: coverBg, border: '2.5px solid var(--ink)', borderRadius: coverShape === 'circle' ? '50%' : 8, padding: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -10, top: -20, fontSize: 130, opacity: 0.85, transform: 'rotate(-8deg)', pointerEvents: 'none' }}>{coverEmoji}</div>
              <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, fontFamily: 'var(--display)', fontSize: 26, lineHeight: 0.9 }}>{title || 'your title here'}</div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {COVER_COLORS.map(c => (
                <div key={c} onClick={() => setCoverBg(c)} style={{ width: 22, height: 22, background: c, border: `2px solid ${coverBg === c ? 'var(--ink)' : 'transparent'}`, borderRadius: 4, cursor: 'pointer' }} />
              ))}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {COVER_EMOJIS.map(e => (
                <span key={e} onClick={() => setCoverEmoji(e)} style={{ fontSize: 20, cursor: 'pointer', opacity: coverEmoji === e ? 1 : 0.5 }}>{e}</span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div style={{ padding: 18, border: '2.5px solid var(--ink)', borderRadius: 12, background: 'var(--bg)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 12 }}>pricing</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="non-exclusive $"><input type="number" value={price} onChange={e => setPrice(+e.target.value)} style={fieldStyle} /></Field>
              <Field label="exclusive $"><input type="number" value={exPrice} onChange={e => setExPrice(+e.target.value)} style={fieldStyle} /></Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={bidding} onChange={e => setBidding(e.target.checked)} />
                allow offers / bidding
              </label>
            </div>
          </div>

          <BigBtn size="lg" full color="var(--lime)" onClick={handleSubmit}>
            {loading ? 'posting...' : '🚀 list it'}
          </BigBtn>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6, textAlign: 'center' }}>you keep 85% · payouts every 48h</div>
        </div>
      </div>
    </div>
  );
}
