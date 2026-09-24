import React from 'react';
import { X, CheckCircle2, QrCode, Calendar, MapPin, Download, Phone, Building, Briefcase } from 'lucide-react';

export const TicketModal = ({ registration, onClose }) => {
  if (!registration) return null;

  const event = registration.event;
  const formattedDate = new Date(event?.date || Date.now()).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--bg-card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--gradient-card-header)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
            }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>Official Event Admission Pass</h3>
              <p style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>● Registration Verified & Confirmed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Digital Ticket Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Event Details Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
            border: '1px dashed var(--primary)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            position: 'relative',
          }}>
            <span className="badge badge-tech" style={{ marginBottom: '0.5rem' }}>
              {event?.category || 'Event Pass'}
            </span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', lineHeight: 1.3 }}>
              {event?.title}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={14} color="var(--primary)" />
                <span>{formattedDate} • {event?.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} color="var(--accent-red)" />
                <span>{event?.location}</span>
              </div>
            </div>
          </div>

          {/* Attendee Full Registered Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            background: 'var(--bg-input)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--bg-card-border)',
            fontSize: '0.85rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>ATTENDEE NAME</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{registration.attendeeName}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>EMAIL ADDRESS</span>
              <span style={{ color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{registration.attendeeEmail}</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>PHONE NUMBER</span>
              <span style={{ color: 'var(--text-primary)' }}>{registration.phone || 'N/A'}</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>DESIGNATION</span>
              <span style={{ color: 'var(--text-secondary)' }}>{registration.designation || 'Attendee'}</span>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>COLLEGE / INSTITUTION / COMPANY</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{registration.organization || 'N/A'}</span>
            </div>

            <div style={{ gridColumn: 'span 2', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>UNIQUE PASS CODE</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--primary)',
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '0.06em'
              }}>
                {registration.ticketCode}
              </span>
            </div>
          </div>

          {/* Barcode / Scan Verification & Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--bg-card-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <QrCode size={40} color="var(--text-secondary)" />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Present at venue check-in</span><br/>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Authorized Entry Pass</span>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.825rem' }}
            >
              <Download size={15} />
              <span>Print Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
