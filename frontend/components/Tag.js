export default function Tag({ children, active = false, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="hl-tag"
      style={{
        background: active ? (color || 'var(--ink)') : 'transparent',
        color: active
          ? (color === 'var(--lime)' || color === 'var(--yellow)' ? 'var(--ink)' : 'var(--bg)')
          : 'var(--ink)',
        border: '2px solid var(--ink)',
        padding: '6px 12px', borderRadius: '999px',
        fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600,
        cursor: 'pointer', whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </button>
  );
}
