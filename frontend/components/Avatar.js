export default function Avatar({ writer, size = 44, ring = true }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: writer.color, color: 'var(--ink)',
      border: ring ? '2px solid var(--ink)' : 'none',
      boxShadow: ring ? '2px 2px 0 var(--ink)' : 'none',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, flexShrink: 0,
    }}>
      {writer.emoji}
    </div>
  );
}
