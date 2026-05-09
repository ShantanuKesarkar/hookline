export default function MarqueeBand({
  items,
  speed = 30,
  color = 'var(--lime)',
  ink = 'var(--ink)',
  sep = '✦',
  height = 56,
  fontSize = 28,
}) {
  const content = items.map((t, i) => (
    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 24, marginRight: 24 }}>
      <span>{t}</span>
      <span style={{ fontSize: fontSize * 0.7, opacity: 0.6 }}>{sep}</span>
    </span>
  ));

  return (
    <div style={{
      width: '100%', overflow: 'hidden', background: color, color: ink,
      borderTop: '2.5px solid var(--ink)', borderBottom: '2.5px solid var(--ink)',
      height, display: 'flex', alignItems: 'center',
    }}>
      <div style={{
        display: 'inline-flex', whiteSpace: 'nowrap',
        fontFamily: 'var(--display)', fontSize,
        animation: `hl-marquee ${speed}s linear infinite`,
      }}>
        {content}{content}{content}
      </div>
    </div>
  );
}
