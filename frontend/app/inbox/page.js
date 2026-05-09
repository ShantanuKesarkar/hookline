'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/Avatar';
import BigBtn from '@/components/BigBtn';
import SectionHeader from '@/components/SectionHeader';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function InboxPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [threads,  setThreads]  = useState([]);
  const [active,   setActive]   = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft,    setDraft]    = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    api.myThreads()
      .then(t => { setThreads(t); if (t.length > 0) loadThread(t[0].id); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  async function loadThread(id) {
    setActive(id);
    const t = await api.getThread(id).catch(() => null);
    if (t) setMessages(t.messages || []);
  }

  async function send() {
    if (!draft.trim() || !active) return;
    try {
      const msg = await api.sendMessage(active, draft);
      setMessages(prev => [...prev, msg]);
      setDraft('');
    } catch (err) { alert(err.message); }
  }

  const activeThread = threads.find(t => t.id === active);

  if (authLoading || loading) return <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>loading...</div>;
  if (!user) return null;

  if (threads.length === 0) return (
    <div style={{ marginTop: 16 }}>
      <SectionHeader accent="var(--blue)">inbox</SectionHeader>
      <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>no messages yet. dm a writer from their profile page.</div>
    </div>
  );

  const otherUserId = activeThread
    ? (activeThread.writer_id === user.id ? activeThread.buyer_id : activeThread.writer_id)
    : null;

  return (
    <div style={{ marginTop: 16 }}>
      <SectionHeader accent="var(--blue)">inbox</SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', border: '2.5px solid var(--ink)', borderRadius: 12, overflow: 'hidden', minHeight: 560, boxShadow: '5px 5px 0 var(--ink)' }}>
        <div style={{ borderRight: '2.5px solid var(--ink)', background: 'var(--bg)' }}>
          {threads.map(t => (
            <div key={t.id} onClick={() => loadThread(t.id)} style={{ padding: 14, cursor: 'pointer', background: t.id === active ? 'var(--lime)' : 'transparent', borderBottom: '1.5px solid var(--ink)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>💬</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 14 }}>thread</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  {t.last_message || 'no messages yet'}
                </div>
                {t.unread > 0 && (
                  <span style={{ display: 'inline-block', marginTop: 4, background: 'var(--pink)', color: 'var(--bg)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999 }}>{t.unread} new</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
          <div style={{ padding: 16, borderBottom: '2px solid var(--ink)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--ink)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💬</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1 }}>direct message</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7 }}>usually replies in 2h</div>
            </div>
            {activeThread?.lyric_id && (
              <Link href={`/lyrics/${activeThread.lyric_id}`} style={{ textDecoration: 'none' }}>
                <BigBtn size="sm" color="var(--lime)">view lyric →</BigBtn>
              </Link>
            )}
          </div>

          <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender_id === user.id ? 'flex-end' : 'flex-start', maxWidth: '75%', padding: '12px 16px', background: m.sender_id === user.id ? 'var(--ink)' : 'var(--lime)', color: m.sender_id === user.id ? 'var(--bg)' : 'var(--ink)', border: '2px solid var(--ink)', borderRadius: m.sender_id === user.id ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.4 }}>
                {m.content}
                <div style={{ marginTop: 4, fontSize: 10, opacity: 0.6 }}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 16, borderTop: '2px solid var(--ink)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="say something nice..." style={{ flex: 1, padding: '12px 14px', border: '2.5px solid var(--ink)', borderRadius: 999, fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--bg)', color: 'var(--ink)', outline: 'none' }} />
            <BigBtn size="sm" color="var(--lime)" onClick={send}>send →</BigBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
