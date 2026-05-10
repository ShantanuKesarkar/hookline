'use client';

const MOODS = [
  { key: 'heartbreak',    emoji: '💔', label: 'heartbreak' },
  { key: 'gym hype',      emoji: '🔥', label: 'gym hype' },
  { key: 'late night',    emoji: '🌙', label: 'late night' },
  { key: 'situationship', emoji: '🫠', label: 'situationship' },
  { key: 'flex',          emoji: '💸', label: 'flex' },
  { key: 'soft',          emoji: '☁️', label: 'soft' },
  { key: 'chaotic',       emoji: '🌀', label: 'chaotic' },
  { key: 'longing',       emoji: '🥀', label: 'longing' },
  { key: 'breakup',       emoji: '🚪', label: 'breakup' },
  { key: 'horny',         emoji: '🍑', label: 'horny longing' },
];

export { MOODS };

export default function MoodRail({ active, onPick }) {
  const chip = (label, isActive, onClick) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        background: isActive ? 'var(--ink)' : 'transparent',
        color: isActive ? 'var(--bg)' : 'var(--ink)',
        border: '2px solid var(--ink)',
        padding: '6px 12px', borderRadius: '999px',
        fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600,
        cursor: 'pointer', whiteSpace: 'nowrap',
        letterSpacing: '0.01em', flexShrink: 0,
      }}
    >{label}</button>
  );

  return (
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
      {chip('✦ all', !active, () => onPick(null))}
      {MOODS.map(m => chip(`${m.emoji} ${m.label}`, active === m.key, () => onPick(m.key)))}
    </div>
  );
}
