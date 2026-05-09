export default function LyricCover({ lyric, size = 220, hideTitle = false }) {
  const c = lyric.cover;
  const titleSize = Math.max(14, size / 9);
  const radius =
    c.shape === 'circle' ? '50%' :
    c.shape === 'blob'   ? '40% 60% 55% 45% / 50% 40% 60% 50%' :
    '8px';

  return (
    <div style={{
      width: size, height: size, position: 'relative',
      background: c.bg, color: c.ink,
      border: '2.5px solid var(--ink)',
      borderRadius: radius,
      overflow: 'hidden', flexShrink: 0,
      boxShadow: '5px 5px 0 var(--ink)',
    }}>
      <div style={{
        position: 'absolute', right: -size * 0.05, top: -size * 0.08,
        fontSize: size * 0.7, lineHeight: 1, opacity: 0.92,
        transform: 'rotate(-8deg)', pointerEvents: 'none',
      }}>{c.emoji}</div>
      <div style={{
        position: 'absolute', bottom: 8, left: 8,
        width: size * 0.18, height: size * 0.18,
        background: c.ink, borderRadius: '50%', opacity: 0.18,
      }} />
      {!hideTitle && (
        <div style={{
          position: 'absolute', bottom: 10, left: 10, right: 10,
          fontFamily: 'var(--display)', fontSize: titleSize,
          lineHeight: 0.92, letterSpacing: '-0.02em',
          textShadow: `2px 2px 0 ${c.bg}`,
        }}>{lyric.title}</div>
      )}
    </div>
  );
}
