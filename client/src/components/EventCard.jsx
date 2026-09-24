import React from 'react';
import { Calendar, MapPin, Clock, Users, Tag, ArrowRight } from 'lucide-react';

export const EventCard = ({ event, onSelect }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getCategoryClass = (cat) => {
    switch (cat) {
      case 'Tech & AI': return 'badge-tech';
      case 'Workshops': return 'badge-workshop';
      case 'Music & Festivals': return 'badge-music';
      case 'Business & Networking': return 'badge-business';
      case 'Design & Art': return 'badge-design';
      default: return 'badge-other';
    }
  };

  const isSoldOut = event.registeredCount >= event.capacity;
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <div
      className="glass-card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        cursor: 'pointer',
      }}
      onClick={() => onSelect(event._id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--bg-card-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Banner Image & Badges */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={event.bannerUrl}
          alt={event.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
        }}>
          <span className={`badge ${getCategoryClass(event.category)}`}>
            {event.category}
          </span>
        </div>

        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: event.price === 0 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.8rem',
          padding: '0.25rem 0.6rem',
          borderRadius: '6px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {event.price === 0 ? 'FREE' : `$${event.price}`}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.title}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4,
          flex: 1
        }}>
          {event.description}
        </p>

        {/* Date & Location Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={15} color="#60a5fa" />
            <span style={{ color: 'var(--text-secondary)' }}>{formattedDate} • {event.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={15} color="#f472b6" />
            <span style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'var(--text-secondary)'
            }}>
              {event.location}
            </span>
          </div>
        </div>

        {/* Capacity Bar & Action */}
        <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--bg-card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ color: isSoldOut ? 'var(--accent-red)' : 'var(--text-muted)' }}>
              {isSoldOut ? 'SOLD OUT' : `${event.capacity - event.registeredCount} seats left`}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>{event.registeredCount}/{event.capacity} booked</span>
          </div>
          <div style={{
            height: '6px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${percentFilled}%`,
              height: '100%',
              background: isSoldOut ? 'var(--accent-red)' : (percentFilled > 80 ? 'var(--accent-amber)' : 'linear-gradient(90deg, #3b82f6, #06b6d4)'),
              borderRadius: '9999px',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};
