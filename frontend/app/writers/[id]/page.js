'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Avatar from '@/components/Avatar';
import Sticker from '@/components/Sticker';
import BigBtn from '@/components/BigBtn';
import SectionHeader from '@/components/SectionHeader';
import LyricsCard from '@/components/LyricsCard';
import { api } from '@/lib/api';
import { formatFollowers } from '@/lib/utils';

export default function WriterProfilePage({ params }) {
  const { id } = use(params);
  const [writer, setWriter] = useState(null);
  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getWriter(id), api.getWriterLyrics(id)])
      .then(([w, l]) => { setWriter(w); setLyrics(l); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>loading...</div>;
  if (!writer)  return <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--mono)' }}>writer not found.</div>;

  return (
    <div>
      <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '3px solid var(--ink)', background: writer.color, padding: '40px 32px', marginTop: 16, boxShadow: '6px 6px 0 var(--ink)' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, fontSize: 280, lineHeight: 1, opacity: 0.5, transform: 'rotate(-12deg)', pointerEvents: 'none' }}>{writer.emoji}</div>
        <div style={{ position: 'relative', zIndex: 2, color: 'var(--ink)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>✦ writer · joined {new Date(writer.created_at).getFullYear()}</div>
          <h1 style={{ margin: '6px 0 0', fontFamily: 'var(--display)', fontSize: 'clamp(48px, 8vw, 120px)', lineHeight: 0.85, letterSpacing: '-0.04em' }}>{writer.name}</h1>
          <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 600 }}>{writer.handle}</div>
          {writer.bio && (
            <div style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: 16, lineHeight: 1.5, maxWidth: 540, fontWeight: 500 }}>"{writer.bio}"</div>
          )}
          <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(writer.vibes || []).map((v, i) => (
              <Sticker key={v} color="var(--ink)" ink="var(--bg)" size={12} rotate={(i % 2 === 0 ? 1 : -1) * 4}>{v}</Sticker>
            ))}
          </div>
          <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/inbox" style={{ textDecoration: 'none' }}>
              <BigBtn size="md" color="var(--ink)" ink={writer.color}>💌 message</BigBtn>
            </Link>
            <BigBtn size="md" color="var(--bg)">+ follow</BigBtn>
            <BigBtn size="md" color="var(--bg)">📝 request a hook</BigBtn>
          </div>
        </div>
      </div>

      <div className="hl-stats-4" style={{ marginTop: 32, border: '2.5px solid var(--ink)', borderRadius: 12, overflow: 'hidden' }}>
        {[
          ['lyrics sold', writer.sold_count ?? 0],
          ['followers', formatFollowers(writer.followers)],
          ['avg rating', writer.rating ? `★ ${writer.rating}` : '—'],
          ['response', '< 2h'],
        ].map(([l, v], i) => (
          <div key={l} style={{ padding: 20, borderRight: i < 3 ? '2px solid var(--ink)' : 'none', background: 'var(--bg)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 32, lineHeight: 1 }}>{v}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 56 }}>
        <SectionHeader accent="var(--lime)">lyrics by {writer.handle}</SectionHeader>
        {lyrics.length > 0 ? (
          <div className="hl-grid-3" style={{ gap: 32 }}>
            {lyrics.map(l => <LyricsCard key={l.id} lyric={l} size="md" />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>no lyrics listed yet.</div>
        )}
      </div>
    </div>
  );
}
