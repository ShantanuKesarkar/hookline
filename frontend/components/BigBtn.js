'use client';

export default function BigBtn({
  children,
  onClick,
  color = 'var(--lime)',
  ink = 'var(--ink)',
  size = 'md',
  full = false,
  style = {},
  type = 'button',
}) {
  const sizes = {
    sm: { padding: '10px 16px', fontSize: 14 },
    md: { padding: '14px 22px', fontSize: 18 },
    lg: { padding: '18px 28px', fontSize: 22 },
  };

  function press(e) {
    e.currentTarget.style.transform = 'translate(2px,2px)';
    e.currentTarget.style.boxShadow = '2px 2px 0 var(--ink)';
  }
  function release(e) {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink)';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseDown={press}
      onMouseUp={release}
      onMouseLeave={release}
      style={{
        background: color, color: ink,
        border: '2.5px solid var(--ink)',
        borderRadius: 8,
        boxShadow: '4px 4px 0 var(--ink)',
        fontFamily: 'var(--display)',
        cursor: 'pointer', letterSpacing: '0.01em',
        width: full ? '100%' : 'auto',
        transition: 'transform .08s ease, box-shadow .08s ease',
        ...sizes[size], ...style,
      }}
    >
      {children}
    </button>
  );
}
