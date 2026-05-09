import Link from 'next/link';
import Avatar from './Avatar';

export default function WriterCard({ writer }) {
  return (
    <Link href={`/writers/${writer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="hl-card" style={{
        border: '2.5px solid var(--ink)', borderRadius: 12,
        padding: 16, background: 'var(--bg)', boxShadow: '4px 4px 0 var(--ink)',
        display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar writer={writer} size={56} />
          <div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1 }}>
              {writer.name}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7 }}>
              {writer.handle}
            </div>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.4, opacity: 0.85, minHeight: 34 }}>
          "{writer.bio}"
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {writer.vibes.slice(0, 2).map(v => (
            <span key={v} style={{
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
              padding: '3px 8px', borderRadius: 999,
              background: 'var(--ink)', color: 'var(--bg)',
              letterSpacing: '0.04em',
            }}>{v}</span>
          ))}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--mono)', fontSize: 11,
          paddingTop: 10, borderTop: '1.5px dashed var(--ink)',
        }}>
          <span>★ {writer.rating}</span>
          <span>{writer.sold} sold</span>
          <span>{writer.followers} followers</span>
        </div>
      </div>
    </Link>
  );
}
