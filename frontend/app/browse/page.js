'use client';
import { useState, useEffect, useMemo } from 'react';
import LyricsCard from '@/components/LyricsCard';
import SectionHeader from '@/components/SectionHeader';
import Tag from '@/components/Tag';
import { api } from '@/lib/api';
import { MOODS } from '@/lib/mockData';

export default function BrowsePage() {
  const [lyrics,  setLyrics]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [mood,    setMood]    = useState(null);
  const [sort,    setSort]    = useState('hot');

  useEffect(() => {
    api.getLyrics({ sort })
      .then(setLyrics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sort]);

  const filtered = useMemo(() =>
    mood ? lyrics.filter(l => (l.mood || []).includes(mood)) : lyrics,
    [lyrics, mood]
  );

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(56px, 9vw, 130px)', lineHeight: 0.85, letterSpacing: '-0.04em' }}>
          <span style={{ background: 'var(--lime)', padding: '0 12px', border: '3px solid var(--ink)', display: 'inline-block', transform: 'rotate(-1deg)' }}>everything</span><br />
          for sale.
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['hot', 'new', 'price_desc', 'price_asc'].map(s => (
            <Tag key={s} active={sort === s} onClick={() => setSort(s)} color="var(--lime)">
              {s === 'price_desc' ? 'price ↓' : s === 'price_asc' ? 'price ↑' : s}
            </Tag>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 32, display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 0' }} className="mood-rail">
        <Tag active={!mood} onClick={() => setMood(null)} color="var(--ink)">✦ all</Tag>
        {MOODS.map(m => (
          <Tag key={m.key} active={mood === m.key} onClick={() => setMood(m.key)} color="var(--lime)">
            {m.emoji} {m.label}
          </Tag>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>loading hooks...</div>
        ) : filtered.length > 0 ? (
          <div className="hl-grid-4">
            {filtered.map(l => <LyricsCard key={l.id} lyric={l} size="sm" />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>
            {mood ? `no ${mood} hooks yet.` : 'no listings yet — be the first to post.'}
          </div>
        )}
      </div>
    </div>
  );
}
