import Link from 'next/link';
import LyricCover from './LyricCover';
import Avatar from './Avatar';
import Sticker from './Sticker';
import { timeLeft, coverFromLyric } from '@/lib/utils';

const TAG_COLOR = {
  'TRENDING': 'var(--pink)', 'HOT': 'var(--orange)',
  'NEW': 'var(--lime)', 'BIDDING': 'var(--blue)',
  'EXCLUSIVE ONLY': 'var(--ink)',
};

export default function LyricsCard({ lyric, size = 'sm' }) {
  const writer    = lyric.writer || {};
  const coverSize = size === 'lg' ? 280 : size === 'sm' ? 160 : 220;
  const tagColor  = TAG_COLOR[lyric.tag] || 'var(--lime)';
  const bidLeft   = timeLeft(lyric.bid_ends || lyric.bidEnds);

  // normalise cover from API (cover.bg) or legacy mock (cover_bg)
  const coverData = {
    bg:    lyric.cover?.bg    ?? lyric.cover_bg    ?? '#C6FF3D',
    ink:   lyric.cover?.ink   ?? lyric.cover_ink   ?? '#0E0E10',
    emoji: lyric.cover?.emoji ?? lyric.cover_emoji ?? '🎤',
    shape: lyric.cover?.shape ?? lyric.cover_shape ?? 'rect',
  };
  const lyricWithCover = { ...lyric, cover: coverData };

  // writer compat: API gives writer object, legacy mock gives writer id
  const writerObj = typeof writer === 'object' && writer !== null ? writer : {};
  const handle   = writerObj.handle  || '';
  const genre    = lyric.genre       || '';
  const currentBid = lyric.current_bid ?? lyric.currentBid;
  const soldCount  = lyric.sold_count  ?? lyric.sold ?? 0;

  return (
    <Link href={`/lyrics/${lyric.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ width: coverSize + 4, position: 'relative' }} className="hl-card">
        <div style={{ position: 'relative' }}>
          <LyricCover lyric={lyricWithCover} size={coverSize} />
          {lyric.tag && (
            <div style={{ position: 'absolute', top: -10, right: -14, zIndex: 2 }}>
              <Sticker color={tagColor} size={11} rotate={8} shape="tag"
                ink={tagColor === 'var(--ink)' ? 'var(--lime)' : 'var(--ink)'}>
                {lyric.tag}
              </Sticker>
            </div>
          )}
          {lyric.bidding && bidLeft && (
            <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'var(--ink)', color: 'var(--bg)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6 }}>
              ⏱ {bidLeft}
            </div>
          )}
        </div>

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          {writerObj.color && <Avatar writer={writerObj} size={28} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7, letterSpacing: '0.02em' }}>
              {handle}{genre ? ` · ${genre}` : ''}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 6, fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.6, fontStyle: 'italic', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          "{lyric.teaser?.split('\n')[0]}…"
        </div>

        <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1 }}>${lyric.price}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6 }}>
            {lyric.bidding && currentBid ? `bid $${currentBid}` : 'or exclusive'}
          </div>
        </div>
      </div>
    </Link>
  );
}
