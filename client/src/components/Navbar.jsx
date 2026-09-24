import React, { useState, useEffect } from 'react';
import { Calendar, PlusCircle, LayoutDashboard, LogIn, UserPlus, LogOut, Palette, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activePage, setActivePage }) => {
  const { user, logout, isOrganizer } = useAuth();
  const [theme, setTheme] = useState('cyber');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'cyber';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const cycleTheme = () => {
    const themes = ['cyber', 'emerald', 'sunset'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
    localStorage.setItem('app-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const getThemeName = () => {
    switch (theme) {
      case 'emerald': return '🟢 Emerald';
      case 'sunset': return '🔴 Sunset';
      default: return '🟣 Cyber';
    }
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--bg-card-border)',
      background: 'rgba(7, 9, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
      }}>
        {/* Logo */}
        <div 
          onClick={() => setActivePage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'var(--gradient-primary)',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 16px var(--primary-glow)'
          }}>
            <Calendar size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              Event<span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Hub</span>
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={() => setActivePage('home')}
            style={{
              background: 'transparent',
              color: activePage === 'home' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '0.5rem 0.8rem',
              borderRadius: '8px',
            }}
          >
            Explore Events
          </button>

          {isOrganizer && (
            <button
              onClick={() => setActivePage('create-event')}
              style={{
                background: activePage === 'create-event' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: activePage === 'create-event' ? '#818cf8' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.9rem',
                padding: '0.5rem 0.8rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: activePage === 'create-event' ? '1px solid var(--bg-card-border)' : 'none'
              }}
            >
              <PlusCircle size={16} />
              <span>Create Event</span>
            </button>
          )}

          {/* Theme Switcher Button */}
          <button
            onClick={cycleTheme}
            className="btn-secondary"
            title="Switch Theme"
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem', borderRadius: '9999px' }}
          >
            <Palette size={14} />
            <span>{getThemeName()}</span>
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <button
                onClick={() => setActivePage('dashboard')}
                className={activePage === 'dashboard' ? 'glow-btn' : 'btn-secondary'}
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--bg-card-border)',
                padding: '0.35rem 0.8rem',
                borderRadius: '9999px',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={() => setActivePage('login')}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => setActivePage('register')}
                className="glow-btn"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                <UserPlus size={16} />
                <span>Register</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
