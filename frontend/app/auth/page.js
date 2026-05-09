'use client';
import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import BigBtn from '@/components/BigBtn';
import Sticker from '@/components/Sticker';
import { useAuth } from '@/components/AuthProvider';

const GENRES = ['pop', 'R&B', 'hip-hop', 'country', 'rock', 'EDM', 'soul', 'jazz', 'indie', 'gospel', 'hyperpop', 'folk', 'drill', 'alt'];

const input = {
  width: '100%', padding: '14px 16px',
  border: '2.5px solid var(--ink)', borderRadius: 10,
  fontFamily: 'var(--mono)', fontSize: 14,
  background: 'var(--bg)', color: 'var(--ink)',
  outline: 'none', boxSizing: 'border-box',
};

function Field({ label, sub, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, opacity: 0.7 }}>
        <span>{label}</span>
        {sub && <span style={{ opacity: 0.7, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{sub}</span>}
      </div>
      {children}
    </div>
  );
}

function leftCopy(tab, role) {
  if (tab === 'login') return { heading: ['welcome', 'back.'], body: 'pick up where you left off. unread dms, new bids, and lyrics dropped from writers you follow.' };
  if (role === 'writer') return { heading: ['ur bars', 'belong here.'], body: 'set a price, post a teaser, lock the rest. artists find you. payouts every 48h.' };
  return { heading: ['come on', 'in.'], body: "browse 12k+ lyrics from independent songwriters. preview free, license fast." };
}

function AuthForm() {
  const { login, signup, user, loading: authLoading } = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [tab,    setTab]    = useState(searchParams.get('tab') || 'login');
  const [role,   setRole]   = useState('artist');
  const [name,   setName]   = useState('');
  const [handle, setHandle] = useState('');
  const [email,  setEmail]  = useState('');
  const [pw,     setPw]     = useState('');
  const [bio,    setBio]    = useState('');
  const [vibes,  setVibes]  = useState([]);
  const [error,  setError]  = useState('');
  const [busy,   setBusy]   = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.push('/home');
  }, [user, authLoading]);

  function toggleVibe(g) {
    setVibes(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  }

  function switchRole(r) {
    setRole(r);
    if (r === 'artist') { setBio(''); setVibes([]); }
  }

  async function submit(e) {
    e && e.preventDefault();
    setError(''); setBusy(true);
    try {
      if (tab === 'login') {
        const me = await login(email, pw);
        router.push(me.role === 'writer' ? '/home' : '/browse');
      } else {
        const me = await signup({
          handle: handle.startsWith('@') ? handle : `@${handle}`,
          name: name || handle, email, password: pw, role: role === 'writer' ? 'writer' : 'buyer',
          bio, vibes, emoji: role === 'writer' ? '✍️' : '🎧',
          color: role === 'writer' ? '#FF3D8A' : '#2D52FF',
        });
        router.push(me.role === 'writer' ? '/post' : '/browse');
      }
    } catch (err) { setError(err.message || 'something went wrong'); }
    finally { setBusy(false); }
  }

  const { heading, body } = leftCopy(tab, role);

  return (
    <div className="hl-auth" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>

      {/* LEFT — hidden on mobile */}
      <div className="hl-auth-left" style={{ background: 'var(--ink)', color: 'var(--bg)', padding: '48px 56px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: 'var(--lime)', border: '2.5px solid var(--bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1, color: 'var(--ink)', transform: 'rotate(-4deg)' }}>♫</div>
          <span style={{ fontFamily: 'var(--display)', fontSize: 24, letterSpacing: '-0.02em' }}>HOOKLINE</span>
        </div>
        <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(56px, 7vw, 96px)', lineHeight: 0.85, letterSpacing: '-0.04em' }}>
            <div>{heading[0]}</div>
            <div><span style={{ color: 'var(--lime)' }}>{heading[1]}</span></div>
          </h1>
          <div style={{ marginTop: 24, fontFamily: 'var(--mono)', fontSize: 16, lineHeight: 1.5, maxWidth: 380, opacity: 0.85 }}>{body}</div>
          {tab === 'register' && role === 'writer' && (
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['85%', 'of every sale goes to you'], ['48h', 'payout turnaround'], ['12k+', 'artists looking for hooks']].map(([s, l]) => (
                <div key={s} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 28, color: 'var(--lime)', lineHeight: 1 }}>{s}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.75 }}>{l}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'register' && role === 'artist' && (
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['12k+', 'lyrics across every genre'], ['$80', 'non-exclusive from'], ['60s', 'from purchase to download']].map(([s, l]) => (
                <div key={s} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 28, color: 'var(--lime)', lineHeight: 1 }}>{s}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.75 }}>{l}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Sticker color="var(--pink)" ink="var(--bg)" rotate={-10} size={13} style={{ position: 'absolute', top: '20%', right: 40 }}>12k+ writers</Sticker>
        <Sticker color="var(--lime)" rotate={8} size={13} style={{ position: 'absolute', bottom: '22%', right: 60 }}>⏱ paid in 48h</Sticker>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.5 }}>✦ EST. 2024 · LYRICS MARKETPLACE</div>
      </div>

      {/* RIGHT — form */}
      <div style={{ padding: '40px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', boxSizing: 'border-box', overflowY: 'auto', maxHeight: '100vh' }}>
        <Link href="/" style={{ alignSelf: 'flex-start', marginBottom: 16, color: 'inherit', textDecoration: 'none', fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.7, borderBottom: '1.5px solid var(--ink)' }}>← back</Link>

        {/* Tab toggle */}
        <div style={{ display: 'flex', border: '2.5px solid var(--ink)', borderRadius: 999, padding: 3, alignSelf: 'flex-start', background: 'var(--bg)' }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setTab(m); setError(''); }} style={{ padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', background: tab === m ? 'var(--ink)' : 'transparent', color: tab === m ? 'var(--bg)' : 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {m === 'login' ? 'log in' : 'sign up'}
            </button>
          ))}
        </div>

        <h2 style={{ margin: '20px 0 4px', fontFamily: 'var(--display)', fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}>
          {tab === 'login' ? "let's get you in." : role === 'writer' ? 'ur era starts now.' : 'start ur era.'}
        </h2>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.7, marginBottom: 16 }}>
          {tab === 'login' ? 'sign in with your email + password.' : role === 'writer' ? "set up your writer profile." : "create your account."}
        </div>

        {error && (
          <div style={{ background: 'var(--pink)', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: 12, padding: '10px 14px', borderRadius: 8, border: '2px solid var(--ink)', marginBottom: 14 }}>{error}</div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tab === 'register' && (
            <>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, opacity: 0.7 }}>i'm here to...</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ id: 'writer', emoji: '✍️', t: 'write & sell', d: "i've got bars", accent: 'var(--pink)' }, { id: 'artist', emoji: '🎤', t: 'find & buy', d: "i'm an artist", accent: 'var(--blue)' }].map(r => (
                    <button key={r.id} type="button" onClick={() => switchRole(r.id)} style={{ padding: 12, textAlign: 'left', cursor: 'pointer', border: `2.5px solid ${role === r.id ? r.accent : 'var(--ink)'}`, borderRadius: 10, background: role === r.id ? r.accent : 'var(--bg)', color: role === r.id && r.id === 'artist' ? 'var(--bg)' : 'var(--ink)', boxShadow: role === r.id ? '4px 4px 0 var(--ink)' : 'none', transform: role === r.id ? 'translate(-2px,-2px)' : 'none', transition: 'all .12s ease' }}>
                      <div style={{ fontSize: 24 }}>{r.emoji}</div>
                      <div style={{ fontFamily: 'var(--display)', fontSize: 16, marginTop: 4, lineHeight: 1 }}>{r.t}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.75, marginTop: 3 }}>{r.d}</div>
                    </button>
                  ))}
                </div>
              </div>
              <Field label="display name"><input value={name} onChange={e => setName(e.target.value)} placeholder={role === 'writer' ? 'ur name or alias' : 'ur name'} style={input} /></Field>
              <Field label="handle"><input value={handle} onChange={e => setHandle(e.target.value.startsWith('@') ? e.target.value : '@' + e.target.value)} placeholder="@yrhandle" style={input} /></Field>
              {role === 'writer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 14, background: 'rgba(198,255,61,0.08)', border: '2px dashed var(--ink)', borderRadius: 12 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6 }}>✦ writer profile — optional</div>
                  <Field label="ur vibe in one line" sub="optional">
                    <input value={bio} onChange={e => setBio(e.target.value)} placeholder="sad pop & late-night spirals." maxLength={80} style={input} />
                  </Field>
                  <Field label="what do u write?" sub="genres">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                      {GENRES.map(g => (
                        <button key={g} type="button" onClick={() => toggleVibe(g)} style={{ padding: '5px 10px', borderRadius: 999, cursor: 'pointer', border: '2px solid var(--ink)', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, background: vibes.includes(g) ? 'var(--lime)' : 'transparent', color: 'var(--ink)' }}>{g}</button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}
            </>
          )}

          <Field label="email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@whatever.com" style={input} required /></Field>
          <Field label="password" sub={tab === 'register' ? '8+ chars' : ''}>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" style={input} required />
          </Field>

          <BigBtn type="submit" size="lg" color="var(--lime)" full style={{ marginTop: 6 }}>
            {busy ? 'one sec...' : tab === 'login' ? 'log in →' : role === 'writer' ? '✍️ start writing →' : '🎧 start browsing →'}
          </BigBtn>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0', fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.5 }}>
          <div style={{ flex: 1, height: 1.5, background: 'var(--ink)', opacity: 0.2 }} /><span>OR</span><div style={{ flex: 1, height: 1.5, background: 'var(--ink)', opacity: 0.2 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[['🍎', 'apple'], ['G', 'google'], ['🎧', 'spotify']].map(([icon, label]) => (
            <button key={label} type="button" onClick={() => alert('coming soon')} style={{ padding: '11px 10px', border: '2.5px solid var(--ink)', borderRadius: 10, background: 'var(--bg)', color: 'var(--ink)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 10, lineHeight: 1.5, opacity: 0.5 }}>
          by signing {tab === 'login' ? 'in' : 'up'} you agree to our terms + privacy.
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: 'var(--display)', fontSize: 32, opacity: 0.3 }}>HOOKLINE...</div>}>
      <AuthForm />
    </Suspense>
  );
}
