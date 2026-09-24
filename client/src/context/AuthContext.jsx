import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success) {
            setUser(res.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Session expired or error:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      return res.data;
    }
  };

  const register = async (name, email, password, role) => {
    const res = await api.register(name, email, password, role);
    if (res.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isOrganizer: user?.role === 'organizer' || user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
