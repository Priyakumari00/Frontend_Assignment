import React, { createContext, useEffect, useState } from 'react';
import api from '../lib/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    await api.post('/auth/login', { email, password });
    const res = await api.get('/auth/me');
    setUser(res.data.user);
  };

  const register = async (name, email, password) => {
    await api.post('/auth/register', { name, email, password });
    const res = await api.get('/auth/me');
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) { /* ignore */ }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
