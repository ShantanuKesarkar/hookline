export default function Sticker({
  children,
  color = 'var(--lime)',
  ink = 'var(--ink)',
  rotate = -6,
  size = 14,
  shape = 'oval',
  style = {},
  onClick,
}) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--display)', fontSize: size, lineHeight: 1,
    background: color, color: ink,
    transform: `rotate(${rotate}deg)`,
    border: '2px solid var(--ink)',
    boxShadow: '3px 3px 0 var(--ink)',
    padding: '8px 14px', whiteSpace: 'nowrap',
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none', letterSpacing: '0.02em',
    ...style,
  };

  if (shape === 'oval')  base.borderRadius = '999px';
  if (shape === 'rect')  base.borderRadius = '4px';
  if (shape === 'tag')   { base.borderRadius = '6px'; base.fontSize = size * 0.85; }
  if (shape === 'burst') {
    base.borderRadius = '0';
    base.clipPath = 'polygon(0 12%,12% 0,28% 14%,42% 0,58% 12%,72% 0,88% 14%,100% 0,100% 88%,88% 100%,72% 86%,58% 100%,42% 86%,28% 100%,12% 86%,0 100%)';
    base.padding = '14px 22px';
    base.boxShadow = 'none';
    base.border = 'none';
  }

  return <span style={base} onClick={onClick}>{children}</span>;
}
