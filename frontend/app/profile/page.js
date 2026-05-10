'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import BigBtn from '@/components/BigBtn';
import LyricsCard from '@/components/LyricsCard';
import LyricCover from '@/components/LyricCover';
import Sticker from '@/components/Sticker';

function normCover(lyric) {
  return {
    ...lyric,
    cover: {
      bg:    lyric.cover?.bg    ?? lyric.cover_bg    ?? '#C6FF3D',
      ink:   lyric.cover?.ink   ?? lyric.cover_ink   ?? '#0E0E10',
      emoji: lyric.cover?.emoji ?? lyric.cover_emoji ?? '🎤',
      shape: lyric.cover?.shape ?? lyric.cover_shape ?? 'rect',
    },
  };
}

function ProfileField({ label, value, onChange, multiline = false, editable = true }) {
  const sharedStyle = {
    width: '100%', border: '2px solid var(--ink)', borderRadius: 8,
    fontFamily: 'var(--mono)', fontSize: 13,
    background: 'var(--bg)', color: 'var(--ink)', outline: 'none',
    boxSizing: 'border-box', opacity: editable ? 1 : 0.6,
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    opacity: 0.7, marginBottom: 6 }}>{label}</div>
      {multiline
        ? <textarea rows={4} value={value} onChange={e => onChange(e.target.value)}
            disabled={!editable} style={{ ...sharedStyle, padding: 12, resize: 'vertical' }} />
        : <input value={value} onChange={e => onChange(e.target.value)}
            disabled={!editable} style={{ ...sharedStyle, padding: '10px 14px' }} />
      }
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--ink)',
                  marginBottom: 24, flexWrap: 'wrap' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: '10px 16px', border: 'none', cursor: 'pointer',
          background: 'transparent',
          borderBottom: active === t ? '3px solid var(--ink)' : '3px solid transparent',
          marginBottom: -2, color: 'var(--ink)',
          fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          opacity: active === t ? 1 : 0.55,
        }}>{t}</button>
      ))}
    </div>
  );
}

function SettingsPanel({ role }) {
  const notifLabels = [
    role === 'writer' ? 'new bid on my lyric' : 'outbid alerts',
    role === 'writer' ? 'sale confirmed' : 'license ready to download',
    'new DM',
    'weekly digest email',
    'newsletter',
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div style={{ padding: 22, border: '2px solid var(--ink)', borderRadius: 14 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 22 }}>notifications</h3>
        {notifLabels.map((label, i) => (
          <label key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderTop: i ? '1px dashed var(--ink)' : 'none',
            fontFamily: 'var(--mono)', fontSize: 13, cursor: 'pointer',
          }}>
            <span>{label}</span>
            <input type="checkbox" defaultChecked={i < 3} />
          </label>
        ))}
      </div>
      <div style={{ padding: 22, border: '2px solid var(--ink)', borderRadius: 14 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 22 }}>account</h3>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <BigBtn size="sm" color="var(--bg)">change password</BigBtn>
          <BigBtn size="sm" color="var(--bg)">2-factor auth</BigBtn>
          <BigBtn size="sm" color="var(--bg)">connected apps</BigBtn>
          <BigBtn size="sm" color="var(--bg)">download my data</BigBtn>
          <div style={{ borderTop: '1px dashed var(--ink)', marginTop: 8, paddingTop: 12 }}>
            <BigBtn size="sm" color="var(--pink)" ink="var(--bg)">delete account</BigBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function WriterProfile({ user, lyrics, saving, saved, form, setForm, onSave }) {
  const [tab, setTab] = useState('overview');
  const stickers = ['heartbreak specialist', 'no AI', 'fast turnaround', 'pop / R&B'];

  return (
    <div>
      <section style={{ border: '2px solid var(--ink)', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{
          padding: 32, position: 'relative',
          background: 'linear-gradient(135deg, var(--pink) 0%, var(--orange) 100%)',
          color: 'var(--bg)',
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        background: 'var(--ink)', display: 'inline-block',
                        padding: '4px 10px', marginBottom: 14 }}>
            ✍︎ writer profile
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'var(--bg)', color: 'var(--ink)',
              border: '2.5px solid var(--ink)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, lineHeight: 1,
            }}>{user.emoji || '🎤'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ margin: 0, fontFamily: 'var(--display)',
                           fontSize: 'clamp(36px, 4.5vw, 64px)',
                           lineHeight: 0.9, letterSpacing: '-0.03em' }}>
                {user.name}
              </h1>
              <div style={{ marginTop: 6, fontFamily: 'var(--mono)', fontSize: 14, opacity: 0.9 }}>
                {user.handle}
              </div>
              {user.bio && (
                <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 13,
                              maxWidth: 540, lineHeight: 1.5 }}>
                  "{user.bio}"
                </div>
              )}
              <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {stickers.map(s => (
                  <Sticker key={s} color="var(--bg)" ink="var(--ink)" rotate={0} size={11}>{s}</Sticker>
                ))}
              </div>
            </div>
            <BigBtn size="sm" color="var(--ink)" ink="var(--lime)" onClick={() => setTab('edit profile')}>
              edit profile
            </BigBtn>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '2px solid var(--ink)' }}>
          {[['lyrics sold', String(lyrics.length || 0)], ['followers', '—'], ['avg rating', '—'], ['response', '< 4h']].map(([l, v], i) => (
            <div key={l} style={{
              padding: '18px 20px',
              borderRight: i < 3 ? '2px solid var(--ink)' : 'none',
              background: i % 2 === 0 ? 'var(--bg)' : 'var(--lime)',
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7 }}>{l}</div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 32,
                            lineHeight: 1, marginTop: 4, letterSpacing: '-0.02em' }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 32 }}>
        <TabBar tabs={['overview', 'edit profile', 'payouts', 'settings']} active={tab} onChange={setTab} />

        {tab === 'overview' && (
          lyrics.length === 0
            ? <p style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.6 }}>
                no listings yet. <a href="/post" style={{ color: 'var(--ink)' }}>post your first hook →</a>
              </p>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
                {lyrics.map(l => <LyricsCard key={l.id} lyric={l} size="sm" />)}
              </div>
        )}

        {tab === 'edit profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <ProfileField label="display name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
              <ProfileField label="handle" value={form.handle} onChange={v => setForm(f => ({ ...f, handle: v }))} />
              <ProfileField label="pronouns" value={form.pronouns} onChange={v => setForm(f => ({ ...f, pronouns: v }))} />
              <ProfileField label="city" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
              <ProfileField label="bio" value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} multiline />
            </div>
            <div>
              <ProfileField label="email (private)" value={form.email} onChange={() => {}} editable={false} />
              <ProfileField label="genres (comma sep)" value={form.genres} onChange={v => setForm(f => ({ ...f, genres: v }))} />
              <ProfileField label="vibes / specialties" value={form.vibes} onChange={v => setForm(f => ({ ...f, vibes: v }))} />
              <ProfileField label="links — instagram" value={form.ig} onChange={v => setForm(f => ({ ...f, ig: v }))} />
              <ProfileField label="links — spotify" value={form.spotify} onChange={v => setForm(f => ({ ...f, spotify: v }))} />
              <BigBtn size="md" color="var(--lime)" full onClick={onSave}>
                {saving ? 'saving…' : saved ? 'saved ✓' : 'save changes'}
              </BigBtn>
            </div>
          </div>
        )}

        {tab === 'payouts' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ padding: 24, border: '2px solid var(--ink)', borderRadius: 14,
                          background: 'var(--ink)', color: 'var(--bg)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lime)' }}>
                lifetime earnings
              </div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 64,
                            lineHeight: 1, marginTop: 8, color: 'var(--lime)' }}>
                $0
              </div>
              <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7 }}>
                payouts coming soon
              </div>
            </div>
            <div style={{ padding: 24, border: '2px solid var(--ink)', borderRadius: 14 }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 22 }}>payout method</h3>
              <div style={{ marginTop: 14, padding: 12, border: '1.5px dashed var(--ink)',
                            borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 13 }}>
                not connected yet
              </div>
              <BigBtn size="sm" color="var(--bg)" style={{ marginTop: 12 }}>connect account</BigBtn>
              <div style={{ marginTop: 20, fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7 }}>
                tax forms · stripe payouts · writers keep 85%
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && <SettingsPanel role="writer" />}
      </div>
    </div>
  );
}

function ArtistProfile({ user, licenses, saving, saved, form, setForm, onSave }) {
  const [tab, setTab] = useState('overview');

  return (
    <div>
      <section style={{ border: '2px solid var(--ink)', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{
          padding: 32, position: 'relative',
          background: 'linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%)',
          color: 'var(--bg)',
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        background: 'var(--ink)', display: 'inline-block',
                        padding: '4px 10px', marginBottom: 14 }}>
            ♫ artist profile
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'var(--bg)', color: 'var(--ink)',
              border: '2.5px solid var(--ink)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, lineHeight: 1,
            }}>{user.emoji || '🎧'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ margin: 0, fontFamily: 'var(--display)',
                           fontSize: 'clamp(36px, 4.5vw, 64px)',
                           lineHeight: 0.9, letterSpacing: '-0.03em' }}>
                {user.name}
              </h1>
              <div style={{ marginTop: 6, fontFamily: 'var(--mono)', fontSize: 14, opacity: 0.9 }}>
                {user.handle}
              </div>
              {user.bio && (
                <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 13,
                              maxWidth: 540, lineHeight: 1.5 }}>
                  {user.bio}
                </div>
              )}
              <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Sticker color="var(--lime)" ink="var(--ink)" rotate={0} size={11}>✓ verified buyer</Sticker>
                <Sticker color="var(--bg)" ink="var(--ink)" rotate={0} size={11}>
                  {licenses.length} license{licenses.length !== 1 ? 's' : ''}
                </Sticker>
              </div>
            </div>
            <BigBtn size="sm" color="var(--ink)" ink="var(--lime)" onClick={() => setTab('edit profile')}>
              edit profile
            </BigBtn>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '2px solid var(--ink)' }}>
          {[['licensed', String(licenses.length)], ['saved', '—'], ['following', '—'], ['avg per buy', '—']].map(([l, v], i) => (
            <div key={l} style={{
              padding: '18px 20px',
              borderRight: i < 3 ? '2px solid var(--ink)' : 'none',
              background: i % 2 === 0 ? 'var(--bg)' : 'var(--blue)',
              color: i % 2 === 0 ? 'var(--ink)' : 'var(--bg)',
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75 }}>{l}</div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 32,
                            lineHeight: 1, marginTop: 4, letterSpacing: '-0.02em' }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 32 }}>
        <TabBar
          tabs={['overview', 'my licenses', 'saved', 'following', 'edit profile', 'settings']}
          active={tab} onChange={setTab}
        />

        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 26 }}>recently licensed</h3>
              {licenses.length === 0
                ? <p style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.6, marginTop: 14 }}>
                    no licenses yet. <a href="/browse" style={{ color: 'var(--ink)' }}>browse lyrics →</a>
                  </p>
                : <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                    {licenses.slice(0, 4).map(l => {
                      const lyric = l.lyric || l;
                      return <LyricsCard key={l.id} lyric={lyric} size="sm" />;
                    })}
                  </div>
              }
            </div>
            <div style={{ padding: 22, border: '2px solid var(--ink)', borderRadius: 14, background: 'var(--lime)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 22 }}>project board</h3>
              <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.8 }}>
                organize purchased lyrics into upcoming releases.
              </div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['debut LP', '4 lyrics · 12 demos'], ['summer single', '1 lyric · in studio'], ['idea bin', '7 saved']].map(([n, m]) => (
                  <div key={n} style={{
                    padding: '10px 12px', background: 'var(--bg)',
                    border: '1.5px solid var(--ink)', borderRadius: 8,
                    display: 'flex', justifyContent: 'space-between',
                    fontFamily: 'var(--mono)', fontSize: 12,
                  }}>
                    <b>{n}</b><span style={{ opacity: 0.7 }}>{m}</span>
                  </div>
                ))}
              </div>
              <BigBtn size="sm" color="var(--ink)" ink="var(--lime)" full style={{ marginTop: 14 }}>
                + new project
              </BigBtn>
            </div>
          </div>
        )}

        {tab === 'my licenses' && (
          licenses.length === 0
            ? <p style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.6 }}>
                no licenses yet. <a href="/browse" style={{ color: 'var(--ink)' }}>browse lyrics →</a>
              </p>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {licenses.map(l => {
                  const lyric = normCover(l.lyric || l);
                  return (
                    <div key={l.id} style={{
                      display: 'grid', gridTemplateColumns: '88px 1fr auto auto', gap: 16,
                      padding: 14, border: '2px solid var(--ink)', borderRadius: 12,
                      alignItems: 'center', background: 'var(--bg)',
                    }}>
                      <LyricCover lyric={lyric} size={88} hideTitle />
                      <div>
                        <div style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1.05 }}>
                          {lyric.title}
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                          {l.tier || 'non-exclusive'} · purchased{' '}
                          {l.created_at ? new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                        </div>
                      </div>
                      <Sticker color="var(--lime)" rotate={0} size={11}>license pdf</Sticker>
                      <BigBtn size="sm" color="var(--bg)">⤓ download</BigBtn>
                    </div>
                  );
                })}
              </div>
        )}

        {tab === 'saved' && (
          <p style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.6 }}>
            saved lyrics coming soon. <a href="/browse" style={{ color: 'var(--ink)' }}>browse for new hooks →</a>
          </p>
        )}

        {tab === 'following' && (
          <p style={{ fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.6 }}>
            writer following coming soon.
          </p>
        )}

        {tab === 'edit profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <ProfileField label="display name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
              <ProfileField label="handle" value={form.handle} onChange={v => setForm(f => ({ ...f, handle: v }))} />
              <ProfileField label="city" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
              <ProfileField label="genre" value={form.genres} onChange={v => setForm(f => ({ ...f, genres: v }))} />
              <ProfileField label="about / what you're hunting for" value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} multiline />
            </div>
            <div>
              <ProfileField label="email" value={form.email} onChange={() => {}} editable={false} />
              <ProfileField label="record label / project" value={form.label} onChange={v => setForm(f => ({ ...f, label: v }))} />
              <ProfileField label="release platform" value={form.platform} onChange={v => setForm(f => ({ ...f, platform: v }))} />
              <ProfileField label="links — instagram" value={form.ig} onChange={v => setForm(f => ({ ...f, ig: v }))} />
              <BigBtn size="md" color="var(--lime)" full onClick={onSave}>
                {saving ? 'saving…' : saved ? 'saved ✓' : 'save changes'}
              </BigBtn>
            </div>
          </div>
        )}

        {tab === 'settings' && <SettingsPanel role="artist" />}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lyrics,   setLyrics]   = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [form,     setForm]     = useState({
    name: '', handle: '', bio: '', email: '',
    pronouns: '', city: '', genres: '', vibes: '', ig: '', spotify: '',
    label: '', platform: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    setForm({
      name:     user.name     || '',
      handle:   user.handle   || '',
      bio:      user.bio      || '',
      email:    user.email    || '',
      pronouns: user.pronouns || '',
      city:     user.city     || '',
      genres:   user.genres   || '',
      vibes:    user.vibes    || '',
      ig:       user.ig       || '',
      spotify:  user.spotify  || '',
      label:    user.label    || '',
      platform: user.platform || '',
    });
    const fetches = user.role === 'writer'
      ? [api.getWriterLyrics(user.id).catch(() => []), Promise.resolve([])]
      : [Promise.resolve([]), api.myLicenses().catch(() => [])];
    Promise.all(fetches).then(([l, li]) => {
      setLyrics(l);
      setLicenses(li);
      setLoading(false);
    });
  }, [authLoading, user]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateProfile({ name: form.name, handle: form.handle, bio: form.bio });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (_) {}
    setSaving(false);
  }

  if (authLoading || loading) {
    return (
      <div style={{ padding: '80px 32px', fontFamily: 'var(--mono)', fontSize: 13, opacity: 0.6 }}>
        loading…
      </div>
    );
  }
  if (!user) return null;

  const shared = { saving, saved, form, setForm, onSave: handleSave };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>
      {user.role === 'writer'
        ? <WriterProfile user={user} lyrics={lyrics} {...shared} />
        : <ArtistProfile user={user} licenses={licenses} {...shared} />
      }
    </div>
  );
}
