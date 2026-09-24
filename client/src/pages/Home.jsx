import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, Calendar, Users, Award, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { EventCard } from '../components/EventCard';

const CATEGORIES = ['All', 'Tech & AI', 'Workshops', 'Music & Festivals', 'Business & Networking', 'Design & Art'];

export const Home = ({ onSelectEvent, setActivePage }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getEvents({
        keyword: search,
        category: selectedCategory,
      });
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEvents();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory]);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '3.5rem 0 2.5rem',
        borderBottom: '1px solid var(--bg-card-border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60a5fa',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            fontSize: '0.825rem',
            fontWeight: 600,
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={15} />
            <span>MERN Stack Next-Gen Event Platform</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            color: '#fff'
          }}>
            Discover, Create & Register for <br />
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Unforgettable Experiences
            </span>
          </h1>

          <p style={{
            maxWidth: '650px',
            margin: '0 auto 2rem',
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            A centralized digital platform connecting event creators and attendees with instant passes, real-time seat availability, and secure management.
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '1.25rem' }} />
            <input
              type="text"
              placeholder="Search by event title, topic, or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 3.2rem',
                fontSize: '1rem',
                borderRadius: '9999px',
                background: 'rgba(15, 21, 35, 0.9)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          {/* Quick Stats Highlights */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2.5rem',
            marginTop: '2.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#3b82f6" />
              <span><strong>100%</strong> Live MERN API</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#10b981" />
              <span><strong>Instant</strong> Pass Generation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#8b5cf6" />
              <span><strong>JWT</strong> Secure Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Catalog */}
      <section className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
        {/* Category Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '2rem',
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '9999px',
                border: selectedCategory === cat ? '1px solid #3b82f6' : '1px solid var(--bg-card-border)',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
              {selectedCategory === 'All' ? 'Upcoming Events' : `${selectedCategory} Events`}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {events.length} active listings
            </p>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem' }}>Loading events...</p>
          </div>
        ) : error ? (
          <div style={{
            padding: '2rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            textAlign: 'center',
          }}>
            <p>Error loading events: {error}</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(18, 24, 36, 0.4)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--bg-card-border)',
          }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              No events found matching your criteria.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Try searching with different keywords or switch categories.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}>
            {events.map((evt) => (
              <EventCard key={evt._id} event={evt} onSelect={onSelectEvent} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
