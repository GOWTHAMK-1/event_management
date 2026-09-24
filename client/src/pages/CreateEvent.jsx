import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, ArrowLeft, Image, Calendar, Clock, MapPin, Users, DollarSign, Tag, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Tech & AI', 'Workshops', 'Music & Festivals', 'Business & Networking', 'Design & Art', 'Sports & Fitness', 'Other'];

export const CreateEvent = ({ editEventId, onDone, setActivePage }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech & AI',
    date: '',
    time: '10:00 AM - 04:00 PM',
    location: '',
    isOnline: false,
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    capacity: 100,
    price: 0,
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editEventId) {
      setFetching(true);
      api.getEventById(editEventId)
        .then((res) => {
          if (res.success) {
            const ev = res.data;
            setFormData({
              title: ev.title,
              description: ev.description,
              category: ev.category,
              date: ev.date ? new Date(ev.date).toISOString().split('T')[0] : '',
              time: ev.time,
              location: ev.location,
              isOnline: ev.isOnline || false,
              bannerUrl: ev.bannerUrl,
              capacity: ev.capacity,
              price: ev.price,
              tags: ev.tags ? ev.tags.join(', ') : '',
            });
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setFetching(false));
    }
  }, [editEventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editEventId) {
        await api.updateEvent(editEventId, formData);
      } else {
        await api.createEvent(formData);
      }
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading event details...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem', maxWidth: '800px' }}>
      <button
        onClick={onDone}
        className="btn-secondary"
        style={{ marginBottom: '1.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
          }}>
            <PlusCircle size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              {editEventId ? 'Edit Event Details' : 'Create New Event'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Fill in the specifications for your upcoming event.
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="input-group">
            <label className="input-label">Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Next-Gen Full Stack Web Dev Summit"
              className="form-input"
              required
            />
          </div>

          {/* Category & Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: '#121824', color: '#fff' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Ticket Price ($) [0 = Free]</label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Date, Time & Capacity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Time *</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="10:00 AM - 04:00 PM"
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Capacity (Max Seats) *</label>
              <input
                type="number"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Location & Online */}
          <div className="input-group">
            <label className="input-label">Location / Venue Address *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Coimbatore Tech Campus or Zoom Meeting"
              className="form-input"
              required
            />
          </div>

          {/* Banner URL */}
          <div className="input-group">
            <label className="input-label">Banner Image URL</label>
            <input
              type="url"
              name="bannerUrl"
              value={formData.bannerUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="form-input"
            />
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label">Description *</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide agenda, speakers, requirements, and key takeaways..."
              className="form-input"
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          {/* Tags */}
          <div className="input-group">
            <label className="input-label">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, AI, Cloud, Python"
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onDone}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="glow-btn"
            >
              <Save size={18} />
              <span>{loading ? 'Saving Event...' : editEventId ? 'Update Event' : 'Publish Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
