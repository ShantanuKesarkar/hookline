'use client';
import { useState } from 'react';
import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LyricCover from '@/components/LyricCover';
import BigBtn from '@/components/BigBtn';
import Sticker from '@/components/Sticker';
import SectionHeader from '@/components/SectionHeader';
import Tag from '@/components/Tag';
import { lyricById, writerById } from '@/lib/mockData';

export default function CheckoutPage({ params }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier') || 'non';
  const lyric = lyricById(id);
  const writer = writerById(lyric?.writer);
  const [done, setDone] = useState(false);

  if (!lyric) return <div style={{ padding: 40, fontFamily: 'var(--mono)' }}>Lyric not found.</div>;

  const isEx = tier === 'ex';
  const price = isEx ? lyric.exclusive : lyric.price;
  const fee = Math.round(price * 0.05);
  const total = price + fee;

  if (done) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 100 }}>🎉</div>
        <h1 style={{
          margin: 0, fontFamily: 'var(--display)',
          fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 0.9, letterSpacing: '-0.03em',
        }}>IT'S YOURS,<br />BABY.</h1>
        <div style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.5 }}>
          you bought <b>{lyric.title}</b> ({isEx ? 'exclusive' : 'non-exclusive'}) from {writer.handle}.<br />
          full lyric is in your inbox. license pdf is downloadable below. go make a hit.
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
          <Link href={`/lyrics/${id}`} style={{ textDecoration: 'none' }}>
            <BigBtn size="lg" color="var(--lime)">↓ download license</BigBtn>
          </Link>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <BigBtn size="lg" color="var(--bg)">back to browse</BigBtn>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16, maxWidth: 880, margin: '16px auto 0' }}>
      <SectionHeader accent="var(--lime)">checkout</SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
        <div>
          {/* Lyric summary */}
          <div style={{
            padding: 20, border: '2.5px solid var(--ink)', borderRadius: 12,
            background: 'var(--bg)', boxShadow: '4px 4px 0 var(--ink)',
            display: 'flex', gap: 16,
          }}>
            <LyricCover lyric={lyric} size={120} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7 }}>from {writer.handle}</div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 28, lineHeight: 1, marginTop: 4 }}>{lyric.title}</div>
              <div style={{ marginTop: 10 }}>
                <Sticker color={isEx ? 'var(--pink)' : 'var(--lime)'} size={11} rotate={-3}>
                  {isEx ? 'exclusive license' : 'non-exclusive · 1 of 3'}
                </Sticker>
              </div>
            </div>
          </div>

          {/* Payment */}
          <h3 style={{ margin: '28px 0 12px', fontFamily: 'var(--display)', fontSize: 22, letterSpacing: '-0.01em' }}>payment</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {['💳 card', '🍎 apple pay', '◊ crypto', 'venmo'].map((p, i) => (
              <Tag key={p} active={i === 0} color="var(--lime)">{p}</Tag>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['card number', '4242 4242 4242 4242'], ['name on card', 'ima hitmaker']].map(([label, ph]) => (
              <div key={label}>
                <label style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7, display: 'block', marginBottom: 4 }}>{label}</label>
                <input placeholder={ph} style={{
                  width: '100%', padding: '12px 14px',
                  border: '2.5px solid var(--ink)', borderRadius: 8,
                  fontFamily: 'var(--mono)', fontSize: 14,
                  background: 'var(--bg)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
                }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10 }}>
              <input placeholder="MM / YY" style={{ flex: 1, padding: '12px 14px', border: '2.5px solid var(--ink)', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 14, background: 'var(--bg)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }} />
              <input placeholder="CVC" style={{ flex: 1, padding: '12px 14px', border: '2.5px solid var(--ink)', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 14, background: 'var(--bg)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div style={{ padding: 20, background: 'var(--ink)', color: 'var(--bg)', borderRadius: 12, position: 'sticky', top: 80 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 12 }}>order</div>
            {[
              ['license', `$${price}`],
              ['platform fee (5%)', `$${fee}`],
              ['writer gets', `$${Math.round(price * 0.85)}`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 13, padding: '6px 0', opacity: l.includes('writer') ? 0.6 : 1 }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>total</span>
              <span style={{ fontFamily: 'var(--display)', fontSize: 36 }}>${total}</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <BigBtn full size="lg" color="var(--lime)" onClick={() => setDone(true)}>
                pay ${total} →
              </BigBtn>
            </div>
            <div style={{ marginTop: 10, fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6, textAlign: 'center', lineHeight: 1.4 }}>
              by buying you agree to the {isEx ? 'exclusive' : 'non-exclusive'} license terms. 7-day refund if u don't vibe.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
