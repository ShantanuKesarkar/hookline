'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import Navbar from './Navbar';
import Footer from './Footer';

const PUBLIC = ['/', '/auth'];

export default function ConditionalShell({ children }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, loading } = useAuth();
  const isPublic  = PUBLIC.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.push('/');
    }
  }, [user, loading, isPublic]);

  // Public pages (landing + auth) — no marketplace shell
  if (isPublic) return <>{children}</>;

  // Protected — gating
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: 32, letterSpacing: '-0.02em', opacity: 0.4 }}>HOOKLINE...</div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
