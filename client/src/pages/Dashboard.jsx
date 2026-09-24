import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Ticket,
  Users,
  Trash2,
  Edit,
  PlusCircle,
  Eye,
  X,
  Clock,
  MapPin,
  Phone,
  Building,
  Briefcase,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TicketModal } from '../components/TicketModal';

export const Dashboard = ({ onSelectEvent, onEditEvent, onCreateEvent, setActivePage }) => {
  const { user, isOrganizer } = useAuth();
  const [activeTab, setActiveTab] = useState(isOrganizer ? 'organizer' : 'my-tickets');
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [attendeeModalEvent, setAttendeeModalEvent] = useState(null);
  const [attendeesList, setAttendeesList] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user's registrations
      const regRes = await api.getMyRegistrations();
      if (regRes.success) setMyRegistrations(regRes.data);

      // 2. Fetch created events if organizer
      if (isOrganizer) {
        const evRes = await api.getMyCreatedEvents();
        if (evRes.success) setCreatedEvents(evRes.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, isOrganizer]);

  const handleCancelRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return;
    try {
      await api.cancelRegistration(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This will remove all associated participant registrations.')) return;
    try {
      await api.deleteEvent(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenAttendees = async (event) => {
    setAttendeeModalEvent(event);
    setLoadingAttendees(true);
    try {
      const res = await api.getEventAttendees(event._id);
      if (res.success) {
        setAttendeesList(res.data);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingAttendees(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Please log in to view your dashboard.</p>
        <button onClick={() => setActivePage('login')} className="glow-btn">
          Log In
        </button>
      </div>
    );
  }

  const totalRegisteredSeats = createdEvents.reduce((acc, ev) => acc + (ev.registeredCount || 0), 0);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      {/* Header Profile Summary */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 800,
              boxShadow: '0 4px 20px var(--primary-glow)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{user.name}</h1>
                <span className="badge badge-tech" style={{ textTransform: 'capitalize' }}>{user.role}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.email}</p>
            </div>
          </div>

          {/* Quick Stats Counter */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{
              background: 'var(--bg-input)',
              padding: '0.85rem 1.4rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--bg-card-border)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>MY TICKETS</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{myRegistrations.length}</strong>
            </div>

            {isOrganizer && (
              <>
                <div style={{
                  background: 'var(--bg-input)',
                  padding: '0.85rem 1.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--bg-card-border)',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>HOSTED EVENTS</span>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--accent-purple)' }}>{createdEvents.length}</strong>
                </div>
                <div style={{
                  background: 'var(--bg-input)',
                  padding: '0.85rem 1.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--bg-card-border)',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>TOTAL ATTENDEES</span>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--accent-green)' }}>{totalRegisteredSeats}</strong>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        borderBottom: '1px solid var(--bg-card-border)',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('my-tickets')}
          style={{
            background: 'transparent',
            color: activeTab === 'my-tickets' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '1rem',
            padding: '0.75rem 1rem',
            borderBottom: activeTab === 'my-tickets' ? '2px solid var(--primary)' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Ticket size={18} />
          <span>My Registered Passes ({myRegistrations.length})</span>
        </button>

        {isOrganizer && (
          <button
            onClick={() => setActiveTab('organizer')}
            style={{
              background: 'transparent',
              color: activeTab === 'organizer' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.75rem 1rem',
              borderBottom: activeTab === 'organizer' ? '2px solid var(--primary)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Users size={18} />
            <span>Organizer Hub ({createdEvents.length})</span>
          </button>
        )}
      </div>

      {/* TAB CONTENT: MY TICKETS */}
      {activeTab === 'my-tickets' && (
        <div>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>Loading registrations...</p>
          ) : myRegistrations.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <Ticket size={40} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                No Active Event Passes
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                You have not registered for any events yet. Explore upcoming summits, hackathons, and workshops!
              </p>
              <button onClick={() => setActivePage('home')} className="glow-btn">
                Browse Events
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {myRegistrations.map((reg) => {
                const ev = reg.event;
                const formattedDate = new Date(ev?.date || Date.now()).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div key={reg._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="badge badge-workshop">{ev?.category || 'Event'}</span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--primary)',
                        background: 'rgba(99, 102, 241, 0.12)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        {reg.ticketCode}
                      </span>
                    </div>

                    <div>
                      <h4
                        onClick={() => onSelectEvent(ev?._id)}
                        style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', cursor: 'pointer', marginBottom: '0.4rem' }}
                      >
                        {ev?.title || 'Event Details'}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={14} color="var(--primary)" />
                          <span>{formattedDate} • {ev?.time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={14} color="var(--accent-red)" />
                          <span>{ev?.location}</span>
                        </div>
                        {reg.organization && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                            <Building size={14} color="var(--accent-green)" />
                            <span>{reg.organization} ({reg.designation})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '0.6rem',
                      marginTop: 'auto',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--bg-card-border)'
                    }}>
                      <button
                        onClick={() => setSelectedTicket(reg)}
                        className="btn-secondary"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '0.825rem' }}
                      >
                        <Ticket size={15} /> View Official Pass
                      </button>
                      <button
                        onClick={() => handleCancelRegistration(reg._id)}
                        className="btn-danger"
                        style={{ fontSize: '0.825rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ORGANIZER HUB */}
      {activeTab === 'organizer' && isOrganizer && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
              My Created Events ({createdEvents.length})
            </h2>
            <button
              onClick={onCreateEvent}
              className="glow-btn"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <PlusCircle size={16} /> Create New Event
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>Loading events...</p>
          ) : createdEvents.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <Calendar size={40} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                You haven't created any events yet
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Host your first tech conference, workshop, or competition!
              </p>
              <button onClick={onCreateEvent} className="glow-btn">
                Create First Event
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {createdEvents.map((ev) => {
                const formattedDate = new Date(ev.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div
                    key={ev._id}
                    className="glass-card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '280px', flex: 1 }}>
                      <img
                        src={ev.bannerUrl}
                        alt={ev.title}
                        style={{ width: '84px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span className="badge badge-tech">{ev.category}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formattedDate}</span>
                        </div>
                        <h4
                          onClick={() => onSelectEvent(ev._id)}
                          style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', cursor: 'pointer' }}
                        >
                          {ev.title}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {ev.location}
                        </span>
                      </div>
                    </div>

                    {/* Booked capacity tracker */}
                    <div style={{
                      background: 'var(--bg-input)',
                      padding: '0.6rem 1.1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--bg-card-border)',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>BOOKED</span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>
                        {ev.registeredCount} / {ev.capacity}
                      </strong>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <button
                        onClick={() => handleOpenAttendees(ev)}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 0.9rem', fontSize: '0.825rem' }}
                        title="View Registered Attendees"
                      >
                        <Eye size={15} /> Attendees ({ev.registeredCount})
                      </button>
                      <button
                        onClick={() => onEditEvent(ev._id)}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 0.9rem', fontSize: '0.825rem' }}
                        title="Edit Event"
                      >
                        <Edit size={15} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev._id)}
                        className="btn-danger"
                        style={{ padding: '0.5rem 0.9rem', fontSize: '0.825rem' }}
                        title="Delete Event"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          registration={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* Attendees Detailed List Modal for Organizers */}
      {attendeeModalEvent && (
        <div className="modal-overlay" onClick={() => setAttendeeModalEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--bg-card-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--gradient-card-header)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  Registered Participants & Attendee Info
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {attendeeModalEvent.title} ({attendeesList.length} registered)
                </p>
              </div>
              <button
                onClick={() => setAttendeeModalEvent(null)}
                style={{ background: 'transparent', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', maxHeight: '480px', overflowY: 'auto' }}>
              {loadingAttendees ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading attendee list...</p>
              ) : attendeesList.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No participants have registered for this event yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {attendeesList.map((att, idx) => (
                    <div
                      key={att._id}
                      style={{
                        padding: '1rem 1.25rem',
                        background: 'var(--bg-input)',
                        borderRadius: '12px',
                        border: '1px solid var(--bg-card-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>#{idx + 1}</span>
                          <div>
                            <strong style={{ fontSize: '1rem', color: '#fff', display: 'block' }}>{att.attendeeName}</strong>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{att.attendeeEmail}</span>
                          </div>
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: 'var(--primary)',
                          background: 'rgba(99, 102, 241, 0.12)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontWeight: 700
                        }}>
                          {att.ticketCode}
                        </span>
                      </div>

                      {/* Attendee Required Info Row */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        paddingTop: '0.4rem',
                        borderTop: '1px dashed rgba(255,255,255,0.06)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={13} color="var(--primary)" />
                          <span>Phone: <strong style={{ color: 'var(--text-primary)' }}>{att.phone || 'N/A'}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Briefcase size={13} color="var(--accent-purple)" />
                          <span>Role: <strong style={{ color: 'var(--text-primary)' }}>{att.designation || 'Attendee'}</strong></span>
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Building size={13} color="var(--accent-green)" />
                          <span>Institution/Company: <strong style={{ color: 'var(--text-primary)' }}>{att.organization || 'N/A'}</strong></span>
                        </div>
                        {att.specialRequests && att.specialRequests !== 'None' && (
                          <div style={{ gridColumn: 'span 2', color: 'var(--accent-amber)', fontSize: '0.75rem' }}>
                            Notes / Requests: {att.specialRequests}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
