'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';

const WRITER_NAV = [
  { href: '/home',             label: 'home' },
  { href: '/browse',           label: 'browse' },
  { href: '/post',             label: '+ post a hook', primary: true },
  { href: '/inbox',            label: 'inbox' },
  { href: '/dashboard/writer', label: 'my listings' },
];

const BUYER_NAV = [
  { href: '/home',            label: 'home' },
  { href: '/browse',          label: 'browse', primary: true },
  { href: '/writers',         label: 'writers' },
  { href: '/inbox',           label: 'inbox' },
  { href: '/dashboard/buyer', label: 'my licenses' },
];

function UserMenu({ user, onSignOut }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function go(href) {
    setOpen(false);
    router.push(href);
  }

  const items = [
    ['my profile', '/profile'],
    [user.role === 'writer' ? 'earnings' : 'my licenses',
     user.role === 'writer' ? '/dashboard/writer' : '/dashboard/buyer'],
    ['settings', '/profile'],
  ];

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 36, height: 36, borderRadius: 999,
          background: user.color || 'var(--pink)', border: '2px solid var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, cursor: 'pointer', padding: 0,
          boxShadow: '2px 2px 0 var(--ink)',
        }}
      >
        {user.emoji || '🎤'}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 44, right: 0, width: 220,
          background: 'var(--bg)', color: 'var(--ink)',
          border: '2.5px solid var(--ink)', borderRadius: 12,
          boxShadow: '4px 4px 0 var(--ink)', overflow: 'hidden',
          fontFamily: 'var(--mono)', fontSize: 13, zIndex: 100,
        }}>
          <div style={{ padding: 12, borderBottom: '1.5px dashed var(--ink)' }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 18, lineHeight: 1 }}>
              {user.name || user.username || 'you'}
            </div>
            <div style={{ opacity: 0.7, fontSize: 11, marginTop: 2 }}>
              {user.handle ? `@${user.handle}` : ''}{user.handle ? ' · ' : ''}{user.role}
            </div>
          </div>

          {items.map(([label, href]) => (
            <div
              key={label}
              onClick={() => go(href)}
              style={{ padding: '10px 12px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--lime)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {label}
            </div>
          ))}

          <div
            onClick={onSignOut}
            style={{
              padding: '10px 12px', cursor: 'pointer',
              borderTop: '1.5px dashed var(--ink)',
              color: 'var(--pink)', fontWeight: 700,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--lime)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            sign out →
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { dark, toggleDark } = useTheme();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = user?.role === 'writer' ? WRITER_NAV : BUYER_NAV;

  function handleLogout() {
    logout();
    router.push('/');
  }

  function navLinkStyle(n) {
    const active = pathname === n.href || (n.href !== '/home' && pathname.startsWith(n.href));
    return {
      textDecoration: 'none',
      fontFamily: n.primary ? 'var(--display)' : 'var(--mono)',
      fontSize: n.primary ? 16 : 13,
      fontWeight: 600,
      padding: n.primary ? '7px 14px' : '8px 10px',
      borderRadius: n.primary ? 8 : 6,
      background: active ? 'var(--ink)' : n.primary ? 'var(--lime)' : 'transparent',
      color: active ? 'var(--bg)' : 'var(--ink)',
      border: n.primary ? '2px solid var(--ink)' : 'none',
      boxShadow: n.primary && !active ? '3px 3px 0 var(--ink)' : 'none',
      opacity: active || n.primary ? 1 : 0.75,
      display: 'block',
    };
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg)', borderBottom: '2.5px solid var(--ink)',
        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {/* Logo */}
        <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, background: 'var(--lime)', border: '2.5px solid var(--ink)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1, transform: 'rotate(-4deg)' }}>♫</div>
          <span style={{ fontFamily: 'var(--display)', fontSize: 24, letterSpacing: '-0.02em' }}>HOOKLINE</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hl-nav-links" style={{ marginLeft: 8 }}>
          {nav.map(n => (
            <Link key={n.href} href={n.href} style={navLinkStyle(n)}>{n.label}</Link>
          ))}
        </nav>

        {/* Desktop search */}
        <div className="hl-nav-search">
          <input placeholder="🔎 search lyrics, writers, moods..."
            style={{ width: '100%', padding: '8px 14px', border: '2px solid var(--ink)', borderRadius: 999, fontFamily: 'var(--mono)', fontSize: 12, background: 'var(--bg)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Dark mode */}
        <button onClick={toggleDark} style={{ width: 34, height: 34, borderRadius: 999, border: '2px solid var(--ink)', background: 'var(--bg)', cursor: 'pointer', fontSize: 15, flexShrink: 0 }}>
          {dark ? '☀' : '🌙'}
        </button>

        {/* User area — desktop */}
        {user ? (
          <div className="hl-desktop" style={{ alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', background: user.role === 'writer' ? 'var(--pink)' : 'var(--blue)', color: user.role === 'writer' ? 'var(--ink)' : 'var(--bg)', border: '1.5px solid var(--ink)', borderRadius: 999 }}>
              {user.role === 'writer' ? '✍️ writer' : '🎧 artist'}
            </div>
            <UserMenu user={user} onSignOut={handleLogout} />
          </div>
        ) : (
          <div className="hl-desktop" style={{ gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <Link href="/auth?tab=login" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>log in</Link>
            <Link href="/auth?tab=register" style={{ fontFamily: 'var(--display)', fontSize: 14, textDecoration: 'none', color: 'var(--ink)', background: 'var(--lime)', border: '2px solid var(--ink)', borderRadius: 8, padding: '7px 14px', boxShadow: '3px 3px 0 var(--ink)' }}>join</Link>
          </div>
        )}

        {/* Hamburger — mobile only */}
        <button className="hl-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile menu */}
      <div className={`hl-mobile-menu${mobileOpen ? ' open' : ''}`}>
        {nav.map(n => (
          <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} style={{ ...navLinkStyle(n), padding: '12px 14px', borderRadius: 8 }}>
            {n.label}
          </Link>
        ))}
        <div style={{ height: 1, background: 'var(--ink)', opacity: 0.15, margin: '6px 0' }} />
        {user ? (
          <>
            <Link href="/profile" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'inherit', textDecoration: 'none', padding: '10px 14px', display: 'block' }}>my profile</Link>
            <Link href={user.role === 'writer' ? '/dashboard/writer' : '/dashboard/buyer'} onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'inherit', textDecoration: 'none', padding: '10px 14px', display: 'block' }}>
              {user.role === 'writer' ? 'earnings' : 'my licenses'}
            </Link>
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={{ fontFamily: 'var(--mono)', fontSize: 13, cursor: 'pointer', background: 'transparent', border: '1.5px solid var(--ink)', borderRadius: 8, padding: '10px 14px', color: 'var(--pink)', fontWeight: 700, textAlign: 'left', width: '100%' }}>
              sign out →
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/auth?tab=login" onClick={() => setMobileOpen(false)} style={{ flex: 1, fontFamily: 'var(--mono)', fontSize: 13, color: 'inherit', textDecoration: 'none', padding: '10px 14px', border: '1.5px solid var(--ink)', borderRadius: 8, textAlign: 'center' }}>log in</Link>
            <Link href="/auth?tab=register" onClick={() => setMobileOpen(false)} style={{ flex: 1, fontFamily: 'var(--display)', fontSize: 14, textDecoration: 'none', color: 'var(--ink)', background: 'var(--lime)', border: '2px solid var(--ink)', borderRadius: 8, padding: '10px 14px', textAlign: 'center', boxShadow: '3px 3px 0 var(--ink)' }}>join</Link>
          </div>
        )}
      </div>
    </>
  );
}
