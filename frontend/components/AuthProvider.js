'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const AuthCtx = createContext({ user: null, loading: true, login: null, signup: null, logout: null });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hl_token');
    if (!token) { setLoading(false); return; }
    api.me()
      .then(setUser)
      .catch(() => localStorage.removeItem('hl_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { access_token } = await api.login({ email, password });
    localStorage.setItem('hl_token', access_token);
    const me = await api.me();
    setUser(me);
    return me;
  }

  async function signup(data) {
    const { access_token } = await api.signup(data);
    localStorage.setItem('hl_token', access_token);
    const me = await api.me();
    setUser(me);
    return me;
  }

  function logout() {
    localStorage.removeItem('hl_token');
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
