import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Phone,
  Building,
  Briefcase,
  MessageSquare,
  Sparkles,
  Edit,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TicketModal } from '../components/TicketModal';

export const EventDetails = ({ eventId, onBack, onEdit, setActivePage }) => {
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [successRegistration, setSuccessRegistration] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Required Attendee Registration Fields
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('Student');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.getEventById(eventId);
        if (res.success) {
          setEvent(res.data);
          if (user) {
            setAttendeeName(user.name || '');
            setAttendeeEmail(user.email || '');
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!user) {
      setActivePage('login');
      return;
    }

    if (!attendeeName.trim() || !attendeeEmail.trim() || !phone.trim() || !organization.trim()) {
      setError('Please fill out all mandatory attendee fields marked with (*).');
      return;
    }

    setRegistering(true);
    setError(null);
    try {
      const res = await api.registerForEvent(eventId, {
        attendeeName,
        attendeeEmail,
        phone,
        organization,
        designation,
        specialRequests,
      });

      if (res.success) {
        setSuccessRegistration(res.data);
        setShowTicketModal(true);
        // Refresh event data to update seat count
        const updated = await api.getEventById(eventId);
        if (updated.success) setEvent(updated.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error || 'Event not found.'}</p>
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft size={16} /> Back to Events
        </button>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isSoldOut = event.registeredCount >= event.capacity;
  const isOrganizer = user && (user._id === event.organizer?._id || user.role === 'admin');

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="btn-secondary"
        style={{ marginBottom: '1.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} /> Back to Explore
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 420px',
        gap: '2.5rem',
        alignItems: 'start',
      }}>
        {/* Left: Main Details */}
        <div>
          {/* Banner Image */}
          <div style={{
            height: '350px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--bg-card-border)',
            marginBottom: '1.5rem',
            position: 'relative'
          }}>
            <img
              src={event.bannerUrl}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
            }}>
              <span className="badge badge-tech" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
                {event.category}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
              {event.title}
            </h1>
            {isOrganizer && (
              <button
                onClick={() => onEdit(event._id)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                <Edit size={16} /> Edit Event
              </button>
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {event.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-secondary)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    border: '1px solid var(--bg-card-border)'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
              About This Event
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
          </div>

          {/* Organizer Info */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: 700
            }}>
              {event.organizer?.name?.charAt(0) || 'O'}
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Organized By
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                {event.organizer?.name || 'Verified Event Host'}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {event.organizer?.bio || 'KGiSL Skillrty Event Management Lead'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid var(--bg-card-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ticket Admission</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: event.price === 0 ? 'var(--accent-green)' : '#fff' }}>
                {event.price === 0 ? 'FREE ENTRY' : `$${event.price}`}
              </span>
            </div>

            {/* Event Meta Quick Details */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              padding: '1rem',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--bg-card-border)'
            }}>
              <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.85rem' }}>
                <Calendar size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: 'var(--text-primary)' }}>{formattedDate} • {event.time}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.85rem' }}>
                <MapPin size={16} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: 'var(--text-secondary)' }}>{event.location}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.85rem' }}>
                <Users size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: isSoldOut ? 'var(--accent-red)' : 'var(--accent-green)', fontWeight: 600 }}>
                  {isSoldOut ? 'Sold Out' : `${event.capacity - event.registeredCount} spots remaining`}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '0.75rem',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '8px',
                color: '#fb7185',
                fontSize: '0.825rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Attendee Registration Required Form */}
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', borderBottom: '1px solid var(--bg-card-border)', paddingBottom: '0.4rem' }}>
                Attendee Registration Details
              </h4>

              {user ? (
                <>
                  {/* Full Name */}
                  <div className="input-group" style={{ marginBottom: '0.3rem' }}>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>
                      Full Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="e.g. Gowtham K"
                      required
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.875rem' }}
                    />
                  </div>

                  {/* Email */}
                  <div className="input-group" style={{ marginBottom: '0.3rem' }}>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>
                      Email Address <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="gowtham@example.com"
                      required
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.875rem' }}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="input-group" style={{ marginBottom: '0.3rem' }}>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>
                      <Phone size={13} /> Phone / WhatsApp <span className="required-star">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.875rem' }}
                    />
                  </div>

                  {/* College / Organization */}
                  <div className="input-group" style={{ marginBottom: '0.3rem' }}>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>
                      <Building size={13} /> College / Institution / Company <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Coimbatore Institute of Technology"
                      required
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.875rem' }}
                    />
                  </div>

                  {/* Role / Designation */}
                  <div className="input-group" style={{ marginBottom: '0.3rem' }}>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>
                      <Briefcase size={13} /> Profession / Designation <span className="required-star">*</span>
                    </label>
                    <select
                      className="form-input"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.875rem' }}
                    >
                      <option value="Student" style={{ background: '#121824', color: '#fff' }}>Student / Scholar</option>
                      <option value="Software Engineer" style={{ background: '#121824', color: '#fff' }}>Software Engineer / Developer</option>
                      <option value="UI/UX Designer" style={{ background: '#121824', color: '#fff' }}>UI/UX Designer</option>
                      <option value="Data Scientist / AI" style={{ background: '#121824', color: '#fff' }}>Data Scientist / AI Engineer</option>
                      <option value="Executive / Manager" style={{ background: '#121824', color: '#fff' }}>Executive / Manager</option>
                      <option value="Freelancer / Other" style={{ background: '#121824', color: '#fff' }}>Freelancer / Other</option>
                    </select>
                  </div>

                  {/* Special Requests / Notes */}
                  <div className="input-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="input-label" style={{ fontSize: '0.75rem' }}>
                      <MessageSquare size={13} /> Special Requests / Dietary / Notes
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Vegetarian / Need wheelchair access / None"
                      style={{ padding: '0.6rem 0.8rem', fontSize: '0.875rem' }}
                    />
                  </div>
                </>
              ) : (
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  textAlign: 'center'
                }}>
                  Please sign in to complete attendee registration.
                </div>
              )}

              <button
                type="submit"
                disabled={isSoldOut || registering}
                className="glow-btn"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  opacity: isSoldOut ? 0.5 : 1,
                  cursor: isSoldOut ? 'not-allowed' : 'pointer',
                  marginTop: '0.25rem'
                }}
              >
                <Ticket size={18} />
                <span>
                  {registering
                    ? 'Confirming Registration...'
                    : isSoldOut
                    ? 'Sold Out'
                    : user
                    ? 'Register & Get Ticket Pass'
                    : 'Sign In to Register'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ticket Pass Modal */}
      {showTicketModal && successRegistration && (
        <TicketModal
          registration={successRegistration}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
};
