const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hl_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.status === 204 ? null : res.json();
}

function qs(params) {
  const p = Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''));
  const s = new URLSearchParams(p).toString();
  return s ? `?${s}` : '';
}

export const api = {
  // Auth
  signup: (data) => request('POST', '/auth/signup', data),
  login:  (data) => request('POST', '/auth/login',  data),
  me:            ()     => request('GET',   '/auth/me'),
  updateProfile: (data) => request('PATCH', '/auth/me', data),

  // Lyrics
  getLyrics:    (params = {}) => request('GET',    `/lyrics${qs(params)}`),
  getLyric:     (id)          => request('GET',    `/lyrics/${id}`),
  createLyric:  (data)        => request('POST',   '/lyrics', data),
  updateLyric:  (id, data)    => request('PATCH',  `/lyrics/${id}`, data),
  deleteLyric:  (id)          => request('DELETE', `/lyrics/${id}`),

  // Writers
  getWriters:      (params = {}) => request('GET', `/writers${qs(params)}`),
  getWriter:       (id)          => request('GET', `/writers/${id}`),
  getWriterLyrics: (id)          => request('GET', `/writers/${id}/lyrics`),

  // Bids
  placeBid:     (data)     => request('POST', '/bids', data),
  getLyricBids: (lyricId)  => request('GET',  `/bids/lyric/${lyricId}`),
  myBids:       ()         => request('GET',  '/bids/me'),

  // Licenses
  myLicenses: ()     => request('GET',  '/licenses/me'),
  checkout:   (data) => request('POST', '/licenses/checkout', data),

  // Messages
  myThreads:   ()              => request('GET',  '/messages/threads'),
  getThread:   (id)            => request('GET',  `/messages/threads/${id}`),
  startThread: (data)          => request('POST', '/messages/threads', data),
  sendMessage: (threadId, msg) => request('POST', `/messages/threads/${threadId}`, { content: msg }),
};
