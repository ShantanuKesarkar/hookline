import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 80, padding: '40px 32px 24px',
      borderTop: '2.5px solid var(--ink)',
      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32,
    }}>
      <div>
        <div style={{ fontFamily: 'var(--display)', fontSize: 32, letterSpacing: '-0.02em' }}>
          HOOKLINE
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7, marginTop: 8, maxWidth: 320 }}>
          a marketplace for hooks, hurts and the occasional banger. made by writers, for writers.
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          {['ig', 'tt', 'tw', 'sp'].map(s => (
            <span key={s} style={{
              width: 30, height: 30, borderRadius: 999,
              background: 'var(--ink)', color: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, cursor: 'pointer',
            }}>{s}</span>
          ))}
        </div>
      </div>

      {[
        ['marketplace', [['browse', '/browse'], ['top writers', '/writers'], ['auctions', '/browse'], ['collabs', '/inbox']]],
        ['for writers', [['post a hook', '/post'], ['pricing tips', '/post'], ['royalties 101', '/post'], ['discord', '/']]],
        ['legal', [['license terms', '/'], ['tos', '/'], ['privacy', '/'], ['takedown', '/']]],
      ].map(([h, items]) => (
        <div key={h}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            opacity: 0.6, marginBottom: 10,
          }}>{h}</div>
          {items.map(([label, href]) => (
            <Link key={label} href={href} style={{
              display: 'block',
              fontFamily: 'var(--mono)', fontSize: 13,
              padding: '4px 0', cursor: 'pointer',
              color: 'inherit', textDecoration: 'none',
              opacity: 0.85,
            }}>{label}</Link>
          ))}
        </div>
      ))}
    </footer>
  );
}
