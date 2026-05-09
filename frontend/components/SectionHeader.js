export default function SectionHeader({ children, accent = 'var(--lime)', right = null }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      marginBottom: 18, paddingBottom: 10, borderBottom: '2.5px solid var(--ink)',
    }}>
      <h2 style={{
        margin: 0, fontFamily: 'var(--display)',
        fontSize: 'clamp(28px, 4vw, 42px)',
        lineHeight: 0.95, letterSpacing: '-0.02em',
        background: `linear-gradient(180deg, transparent 60%, ${accent} 60%)`,
        display: 'inline', padding: '0 4px',
      }}>
        {children}
      </h2>
      {right}
    </div>
  );
}
