'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';

const WRITER_NAV = [
  { href: '/home',              label: 'home' },
  { href: '/browse',            label: 'browse' },
  { href: '/post',              label: '+ post a hook', primary: true },
  { href: '/inbox',             label: 'inbox' },
  { href: '/dashboard/writer',  label: 'my listings' },
];

const BUYER_NAV = [
  { href: '/home',             label: 'home' },
  { href: '/browse',           label: 'browse', primary: true },
  { href: '/writers',          label: 'writers' },
  { href: '/inbox',            label: 'inbox' },
  { href: '/dashboard/buyer',  label: 'my licenses' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { dark, toggleDark } = useTheme();
  const { user, logout } = useAuth();

  const nav = user?.role === 'writer' ? WRITER_NAV : BUYER_NAV;

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--bg)', borderBottom: '2.5px solid var(--ink)',
      padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 20,
    }}>
      {/* Logo */}
      <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, background: 'var(--lime)', border: '2.5px solid var(--ink)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1, transform: 'rotate(-4deg)' }}>♫</div>
        <span style={{ fontFamily: 'var(--display)', fontSize: 26, letterSpacing: '-0.02em' }}>HOOKLINE</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6, padding: '2px 6px', border: '1.5px dashed var(--ink)', borderRadius: 4, marginLeft: 4 }}>BETA</span>
      </Link>

      {/* Role-specific nav */}
      <nav style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
        {nav.map(n => {
          const active = pathname === n.href || (n.href !== '/home' && pathname.startsWith(n.href));
          return (
            <Link key={n.href} href={n.href} style={{
              textDecoration: 'none',
              fontFamily: n.primary ? 'var(--display)' : 'var(--mono)',
              fontSize: n.primary ? 16 : 13,
              fontWeight: 600,
              padding: n.primary ? '7px 14px' : '8px 10px',
              borderRadius: n.primary ? 8 : 6,
              background: active
                ? 'var(--ink)'
                : n.primary
                  ? 'var(--lime)'
                  : 'transparent',
              color: active
                ? 'var(--bg)'
                : n.primary
                  ? 'var(--ink)'
                  : 'var(--ink)',
              border: n.primary ? '2px solid var(--ink)' : 'none',
              boxShadow: n.primary && !active ? '3px 3px 0 var(--ink)' : 'none',
              opacity: active || n.primary ? 1 : 0.75,
            }}>{n.label}</Link>
          );
        })}
      </nav>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 320, marginLeft: 'auto' }}>
        <input
          placeholder="🔎 search lyrics, writers, moods..."
          style={{ width: '100%', padding: '8px 14px', border: '2px solid var(--ink)', borderRadius: 999, fontFamily: 'var(--mono)', fontSize: 12, background: 'var(--bg)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Dark mode */}
      <button onClick={toggleDark} style={{ width: 36, height: 36, borderRadius: 999, border: '2px solid var(--ink)', background: 'var(--bg)', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>
        {dark ? '☀' : '🌙'}
      </button>

      {/* User area */}
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Role badge */}
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', background: user.role === 'writer' ? 'var(--pink)' : 'var(--blue)', color: user.role === 'writer' ? 'var(--ink)' : 'var(--bg)', border: '1.5px solid var(--ink)', borderRadius: 999 }}>
            {user.role === 'writer' ? '✍️ writer' : '🎧 artist'}
          </div>
          {/* Avatar */}
          <Link href={user.role === 'writer' ? '/dashboard/writer' : '/dashboard/buyer'} style={{ textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: user.color || 'var(--pink)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', boxShadow: '2px 2px 0 var(--ink)' }}>
              {user.emoji || '🎤'}
            </div>
          </Link>
          {/* Logout */}
          <button onClick={handleLogout} style={{ fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', background: 'transparent', border: '1.5px solid var(--ink)', borderRadius: 6, padding: '5px 10px', color: 'var(--ink)' }}>
            out
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <Link href="/auth?tab=login" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>log in</Link>
          <Link href="/auth?tab=register" style={{ fontFamily: 'var(--display)', fontSize: 14, textDecoration: 'none', color: 'var(--ink)', background: 'var(--lime)', border: '2px solid var(--ink)', borderRadius: 8, padding: '7px 14px', boxShadow: '3px 3px 0 var(--ink)' }}>join</Link>
        </div>
      )}
    </header>
  );
}
