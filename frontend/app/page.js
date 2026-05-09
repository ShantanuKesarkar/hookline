'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Sticker from '@/components/Sticker';
import BigBtn from '@/components/BigBtn';
import MarqueeBand from '@/components/MarqueeBand';
import SectionHeader from '@/components/SectionHeader';
import LyricCover from '@/components/LyricCover';
import Avatar from '@/components/Avatar';

const PEEK_COVERS = [
  { id: 'a', title: 'Velvet Headache',        cover: { bg: '#FF3D8A', ink: '#0E0E10', emoji: '💊', shape: 'blob' } },
  { id: 'b', title: 'PARKING LOT MESSIAH',    cover: { bg: '#C6FF3D', ink: '#0E0E10', emoji: '⛪', shape: 'burst' } },
  { id: 'c', title: 'BIG TEETH ENERGY',       cover: { bg: '#A24BFF', ink: '#FFF8E7', emoji: '🦷', shape: 'blob' } },
  { id: 'd', title: 'Disco for One',          cover: { bg: '#FFD23F', ink: '#0E0E10', emoji: '🪩', shape: 'circle' } },
  { id: 'e', title: 'Soft Launch',            cover: { bg: '#C6FF3D', ink: '#FF3D8A', emoji: '🌷', shape: 'circle' } },
  { id: 'f', title: 'RUN IT THRU AGAIN',      cover: { bg: '#0E0E10', ink: '#FF3D8A', emoji: '💸', shape: 'burst' } },
];

const TESTIMONIALS = [
  { q: "sold a hook in 2 days that paid my rent. and i wrote it on the bus.", name: 'Maya Reyes', handle: '@nooneatnight', emoji: '🌙', color: '#FF3D8A' },
  { q: "i was paying $3k for ghostwriters. now i build whole albums for less than that.", name: 'jaida k', handle: '@jaida.makes', emoji: '🎧', color: '#2D52FF' },
  { q: "writing for one artist meant chasing a contract for 9 months. on hookline i sold the same lyric to 3 ppl in a week.", name: 'Jules Park', handle: '@phlegmatic', emoji: '🥀', color: '#2D52FF' },
];

const FAQ_ITEMS = [
  ['what counts as exclusive?', 'when an artist buys exclusive, only they can ever record + release that lyric. you transfer all rights. non-ex lets you sell to up to 2 more buyers (capped at 3 total).'],
  ['who owns the copyright?', 'on non-exclusive: the writer keeps copyright, the buyer gets a license. on exclusive: full transfer to buyer. either way, the writer gets credit if the song releases.'],
  ['do i need to be a "real" songwriter?', 'nope. teens, retirees, hobbyists, ghostwriters, published pros — we have all of them. if your lyric slaps, someone will buy it.'],
  ['how do i get paid?', 'connect a stripe account when you list your first lyric. payouts run every 48h once a sale clears.'],
  ['can artists request custom hooks?', 'yes. dm any writer with a brief and a budget. lots of co-writes happen this way.'],
  ['is this for one genre?', 'no. we have country, hyperpop, drill, R&B, indie, k-pop demos, christian, even jingles. mood + bpm filters help you find your lane.'],
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '2.5px solid var(--ink)', borderRadius: 12, background: open ? 'var(--lime)' : 'var(--bg)', boxShadow: open ? '4px 4px 0 var(--ink)' : 'none', transition: 'all .12s ease' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--ink)' }}>
        <span style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{q}</span>
        <span style={{ fontFamily: 'var(--display)', fontSize: 32, lineHeight: 1, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .12s ease', flexShrink: 0 }}>+</span>
      </button>
      {open && <div style={{ padding: '0 22px 20px', fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.55 }}>{a}</div>}
    </div>
  );
}

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push('/home');
  }, [user, loading]);

  function goAuth(tab = 'register') {
    router.push(`/auth?tab=${tab}`);
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ fontFamily: 'var(--display)', fontSize: 32, opacity: 0.3 }}>HOOKLINE...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>

      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', borderBottom: '2.5px solid var(--ink)', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: 'var(--lime)', border: '2.5px solid var(--ink)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1, transform: 'rotate(-4deg)' }}>♫</div>
          <span style={{ fontFamily: 'var(--display)', fontSize: 26, letterSpacing: '-0.02em' }}>HOOKLINE</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6, padding: '2px 6px', border: '1.5px dashed var(--ink)', borderRadius: 4, marginLeft: 4 }}>BETA</span>
        </div>
        <nav className="hl-landing-nav-links" style={{ display: 'flex', gap: 20, marginLeft: 24, fontFamily: 'var(--mono)', fontSize: 13 }}>
          {[['#how', 'how it works'], ['#writers', 'for writers'], ['#artists', 'for artists'], ['#pricing', 'pricing'], ['#faq', 'faq']].map(([href, label]) => (
            <a key={href} href={href} style={{ color: 'inherit', textDecoration: 'none', opacity: 0.75 }}>{label}</a>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <BigBtn size="sm" color="var(--bg)" onClick={() => goAuth('login')}>log in</BigBtn>
          <BigBtn size="sm" color="var(--lime)" onClick={() => goAuth('register')}>sign up →</BigBtn>
        </div>
      </header>

      <div className="hl-landing-main">

        {/* HERO */}
        <section style={{ position: 'relative', padding: '40px 0 60px', overflow: 'hidden', maxWidth: '100%' }}>
          <Sticker color="var(--pink)" rotate={14} size={14} style={{ position: 'absolute', top: 30, right: '6%', zIndex: 3 }}>★ 4.9 from 12k writers</Sticker>
          <Sticker color="var(--blue)" ink="var(--bg)" rotate={-8} size={13} shape="rect" style={{ position: 'absolute', top: 220, left: '2%', zIndex: 3 }}>licenses from $80</Sticker>
          <Sticker color="var(--orange)" rotate={6} size={13} style={{ position: 'absolute', bottom: 90, right: '14%', zIndex: 3 }}>↻ 240 sold this week</Sticker>

          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--ink)', color: 'var(--bg)', display: 'inline-block', padding: '4px 10px', marginBottom: 20 }}>
            ✦ EST. 2024 · LYRICS MARKETPLACE ✦
          </div>

          <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(64px, 12vw, 200px)', lineHeight: 0.85, letterSpacing: '-0.04em' }}>
            <div>WRITE IT.</div>
            <div style={{ paddingLeft: '6%' }}>
              <span style={{ background: 'var(--lime)', padding: '0 16px', border: '3px solid var(--ink)', boxShadow: '6px 6px 0 var(--ink)', display: 'inline-block', transform: 'rotate(-1deg)' }}>SELL IT.</span>
            </div>
            <div style={{ textAlign: 'right' }}>SING IT.</div>
          </h1>

          <div style={{ marginTop: 36, fontFamily: 'var(--mono)', fontSize: 18, lineHeight: 1.5, maxWidth: 580 }}>
            a marketplace for songwriters and the artists who steal from them (legally). post a hook, set a price, get paid in 48 hours. no labels, no middlemen, no ai slop.
          </div>

          <div className="hl-hero-cta" style={{ marginTop: 32 }}>
            <BigBtn size="lg" color="var(--lime)" onClick={() => goAuth('register')} style={{ width: '100%', maxWidth: 280 }}>I'M A WRITER →</BigBtn>
            <BigBtn size="lg" color="var(--pink)" ink="var(--bg)" onClick={() => goAuth('register')} style={{ width: '100%', maxWidth: 280 }}>I'M AN ARTIST →</BigBtn>
            <span onClick={() => goAuth('login')} style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.7, borderBottom: '2px solid var(--ink)', cursor: 'pointer' }}>already have an account? log in</span>
          </div>
        </section>

        {/* MARQUEE */}
        <div style={{ margin: '0 -32px' }}>
          <MarqueeBand items={['NEW DROPS DAILY', 'PAYOUT IN 48H', 'WRITERS GET 85%', 'EXCLUSIVE LICENSES', 'BID OR BUY', '0% AI SLOP', 'SIGNED IN 47 COUNTRIES']} color="var(--ink)" ink="var(--lime)" speed={50} fontSize={36} height={64} />
        </div>

        {/* WHAT'S THE DEAL — 3 cards */}
        <section style={{ marginTop: 80 }}>
          <SectionHeader accent="var(--lime)">what's the deal?</SectionHeader>
          <div className="hl-deal">
            {[
              { emoji: '✍️', color: 'var(--pink)', title: 'writers post hooks', body: "unfinished verses, full songs, leftover bridges — list 'em with a teaser, set the price, lock the rest.", rotate: -0.6 },
              { emoji: '🎤', color: 'var(--lime)', title: 'artists buy licenses', body: 'preview the snippet, vibe-check the writer, pick your license (non-ex / ex / make-an-offer), pay, get the full lyric in 60 seconds.', rotate: 0 },
              { emoji: '💸', color: 'var(--blue)', ink: 'var(--bg)', title: 'everyone gets paid', body: 'writers keep 85%. payouts every 48h. we handle the legal paperwork so you can stay in the studio.', rotate: 0.6 },
            ].map((c, i) => (
              <div key={i} style={{ padding: 28, border: '3px solid var(--ink)', borderRadius: 16, background: c.color, color: c.ink || 'var(--ink)', boxShadow: '6px 6px 0 var(--ink)', transform: `rotate(${c.rotate}deg)` }}>
                <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 14 }}>{c.emoji}</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 32, lineHeight: 0.95, letterSpacing: '-0.02em' }}>{c.title}</div>
                <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.5 }}>{c.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" style={{ marginTop: 100 }}>
          <SectionHeader accent="var(--pink)">how it works</SectionHeader>
          <div className="hl-split">

            {/* Writers */}
            <div id="writers" style={{ padding: 28, border: '3px solid var(--ink)', borderRadius: 16, background: 'var(--bg)', boxShadow: '6px 6px 0 var(--ink)', position: 'relative' }}>
              <Sticker color="var(--lime)" rotate={-8} size={13} style={{ position: 'absolute', top: -14, left: 20 }}>writers ↓</Sticker>
              <h3 style={{ margin: '8px 0 0', fontFamily: 'var(--display)', fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>you got bars.<br />we got buyers.</h3>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['1', 'post a teaser', '2 lines max. stays public so artists can find you.'], ['2', 'set your price', 'non-exclusive ($80–$400) + exclusive ($1k–$5k). allow bids if you want.'], ['3', 'get paid', '85% of every sale. paid out every 48h. tax forms? we handle it.']].map(([n, t, d]) => (
                  <div key={n} style={{ display: 'flex', gap: 14, padding: 14, background: 'var(--lime)', border: '2.5px solid var(--ink)', borderRadius: 10 }}>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 40, lineHeight: 1, flexShrink: 0, width: 48, textAlign: 'center' }}>{n}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1 }}>{t}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.5, marginTop: 4, opacity: 0.85 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <BigBtn size="md" color="var(--ink)" ink="var(--lime)" full style={{ marginTop: 18 }} onClick={() => goAuth('register')}>START WRITING →</BigBtn>
            </div>

            {/* Artists */}
            <div id="artists" style={{ padding: 28, border: '3px solid var(--ink)', borderRadius: 16, background: 'var(--ink)', color: 'var(--bg)', boxShadow: '6px 6px 0 var(--lime)', position: 'relative' }}>
              <Sticker color="var(--pink)" rotate={6} size={13} style={{ position: 'absolute', top: -14, right: 20 }}>artists ↓</Sticker>
              <h3 style={{ margin: '8px 0 0', fontFamily: 'var(--display)', fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>
                <span style={{ color: 'var(--lime)' }}>find a hook.</span><br />make a hit.
              </h3>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['1', 'browse by mood', '12k+ lyrics tagged by mood, genre, bpm, key. preview every snippet for free.'], ['2', 'pick a license', 'non-exclusive (cheap, shared with up to 2 others) or exclusive (yours forever).'], ['3', 'download & ship', 'full lyric in your inbox in 60s. license pdf included. you keep 100% of streaming.']].map(([n, t, d]) => (
                  <div key={n} style={{ display: 'flex', gap: 14, padding: 14, background: 'var(--bg)', color: 'var(--ink)', border: '2.5px solid var(--ink)', borderRadius: 10 }}>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 40, lineHeight: 1, flexShrink: 0, width: 48, textAlign: 'center' }}>{n}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1 }}>{t}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.5, marginTop: 4, opacity: 0.85 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <BigBtn size="md" color="var(--lime)" full style={{ marginTop: 18 }} onClick={() => goAuth('register')}>START SHOPPING →</BigBtn>
            </div>
          </div>
        </section>

        {/* PEEK INSIDE */}
        <section style={{ marginTop: 100 }}>
          <SectionHeader accent="var(--blue)" right={<div style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7 }}>🔒 sign up to unlock</div>}>a peek inside</SectionHeader>
          <div style={{ position: 'relative' }}>
            <div className="hl-peek-grid">
              {PEEK_COVERS.map(l => (
                <div key={l.id} style={{ filter: 'blur(2px)', opacity: 0.7, pointerEvents: 'none' }}>
                  <LyricCover lyric={l} size={170} />
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'linear-gradient(180deg, transparent, var(--bg) 75%)' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1, background: 'var(--bg)', padding: '8px 16px', border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)', transform: 'rotate(-1deg)' }}>
                12,402 more inside.
              </div>
              <BigBtn size="lg" color="var(--lime)" onClick={() => goAuth('register')}>unlock the marketplace →</BigBtn>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ marginTop: 100 }}>
          <SectionHeader accent="var(--orange)">what they're saying</SectionHeader>
          <div className="hl-testimonials">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ padding: 24, border: '2.5px solid var(--ink)', borderRadius: 14, background: 'var(--bg)', boxShadow: '5px 5px 0 var(--ink)', position: 'relative' }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 64, lineHeight: 0.6, color: 'var(--lime)', position: 'absolute', top: 16, right: 18 }}>"</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{t.q}</div>
                <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center', paddingTop: 14, borderTop: '1.5px dashed var(--ink)' }}>
                  <Avatar writer={t} size={36} />
                  <div>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 16, lineHeight: 1 }}>{t.name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7 }}>{t.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" style={{ marginTop: 100 }}>
          <SectionHeader accent="var(--lime)">pricing (it's simple)</SectionHeader>
          <div className="hl-pricing">
            {[
              { title: 'browse', price: 'free', color: 'var(--bg)', features: ['unlimited browsing', 'preview every snippet', 'save & follow', 'no signup fees'], cta: 'start exploring' },
              { title: 'buy a license', price: 'pay\nper hook', color: 'var(--lime)', features: ['non-ex from $80', 'exclusive from $1k', 'instant download', 'license pdf included', '7-day refund'], cta: 'shop lyrics', featured: true },
              { title: 'sell as writer', price: 'free\n(85% / sale)', color: 'var(--pink)', ink: 'var(--bg)', features: ['unlimited listings', 'set your own price', 'allow bidding', 'payouts in 48h', 'tax forms handled'], cta: 'become a writer' },
            ].map((p, i) => (
              <div key={i} style={{ padding: 28, borderRadius: 16, border: '3px solid var(--ink)', background: p.color, color: p.ink || 'var(--ink)', boxShadow: p.featured ? '8px 8px 0 var(--ink)' : '4px 4px 0 var(--ink)', transform: p.featured ? 'translateY(-12px) rotate(-1deg)' : 'none', position: 'relative' }}>
                {p.featured && <Sticker color="var(--pink)" ink="var(--bg)" rotate={10} size={12} style={{ position: 'absolute', top: -16, right: -10 }}>most popular</Sticker>}
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.title}</div>
                <div style={{ marginTop: 8, fontFamily: 'var(--display)', fontSize: 'clamp(48px, 5vw, 72px)', lineHeight: 0.9, letterSpacing: '-0.03em', whiteSpace: 'pre-line' }}>{p.price}</div>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.features.map(f => <div key={f} style={{ fontFamily: 'var(--mono)', fontSize: 13, display: 'flex', gap: 10 }}><span>✓</span><span>{f}</span></div>)}
                </div>
                <BigBtn size="md" full color="var(--ink)" ink={p.color === 'var(--bg)' ? 'var(--bg)' : p.color} style={{ marginTop: 22 }} onClick={() => goAuth('register')}>{p.cta} →</BigBtn>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ marginTop: 100 }}>
          <SectionHeader accent="var(--purple)">questions you might have</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQ_ITEMS.map(([q, a], i) => <FAQItem key={i} q={q} a={a} />)}
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ marginTop: 100, marginBottom: 60, padding: '60px 40px', borderRadius: 24, border: '3px solid var(--ink)', background: 'var(--lime)', boxShadow: '10px 10px 0 var(--ink)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <Sticker color="var(--pink)" rotate={-12} size={14} style={{ position: 'absolute', top: 24, left: 32 }}>no credit card</Sticker>
          <Sticker color="var(--blue)" ink="var(--bg)" rotate={10} size={14} style={{ position: 'absolute', top: 24, right: 32 }}>free forever</Sticker>
          <h2 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(56px, 9vw, 140px)', lineHeight: 0.85, letterSpacing: '-0.04em' }}>
            ok but<br />like, are<br />you in?
          </h2>
          <div style={{ marginTop: 24, fontFamily: 'var(--mono)', fontSize: 16, maxWidth: 560, margin: '24px auto 0' }}>
            takes 30 seconds. no spam. no "verify your phone with 14 friends."
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            <BigBtn size="lg" color="var(--ink)" ink="var(--lime)" onClick={() => goAuth('register')}>create my account →</BigBtn>
            <BigBtn size="lg" color="var(--bg)" onClick={() => goAuth('login')}>i already have one</BigBtn>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: '40px 32px 24px', borderTop: '2.5px solid var(--ink)', maxWidth: 1280, margin: '0 auto', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 32, letterSpacing: '-0.02em' }}>HOOKLINE</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7, marginTop: 8, maxWidth: 320 }}>a marketplace for hooks, hurts and the occasional banger. made by writers, for writers.</div>
        </div>
        {[['marketplace', ['browse', 'top writers', 'auctions', 'collabs']], ['for writers', ['post a hook', 'pricing tips', 'royalties 101', 'discord']], ['legal', ['license terms', 'tos', 'privacy', 'takedown']]].map(([h, items]) => (
          <div key={h}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 10 }}>{h}</div>
            {items.map(item => <div key={item} style={{ fontFamily: 'var(--mono)', fontSize: 13, padding: '4px 0', cursor: 'pointer', opacity: 0.85 }}>{item}</div>)}
          </div>
        ))}
      </footer>
    </div>
  );
}
