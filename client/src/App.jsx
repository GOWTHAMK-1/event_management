import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { EventDetails } from './pages/EventDetails';
import { CreateEvent } from './pages/CreateEvent';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [editEventId, setEditEventId] = useState(null);

  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    setActivePage('event-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditEvent = (id) => {
    setEditEventId(id);
    setActivePage('edit-event');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNewEvent = () => {
    setEditEventId(null);
    setActivePage('create-event');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <Home
            onSelectEvent={handleSelectEvent}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'event-details' && selectedEventId && (
          <EventDetails
            eventId={selectedEventId}
            onBack={() => setActivePage('home')}
            onEdit={handleEditEvent}
            setActivePage={setActivePage}
          />
        )}

        {(activePage === 'create-event' || activePage === 'edit-event') && (
          <CreateEvent
            editEventId={activePage === 'edit-event' ? editEventId : null}
            onDone={() => {
              setActivePage('dashboard');
              setEditEventId(null);
            }}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            onSelectEvent={handleSelectEvent}
            onEditEvent={handleEditEvent}
            onCreateEvent={handleCreateNewEvent}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'login' && <Login setActivePage={setActivePage} />}

        {activePage === 'register' && <Register setActivePage={setActivePage} />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--bg-card-border)',
        padding: '2rem 0',
        background: 'rgba(10, 14, 23, 0.95)',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container">
          <p style={{ marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
            <strong>EventHub</strong> • Full-Stack Event Management Platform (MERN Architecture)
          </p>
          <p>
            Developed with React.js, Node.js, Express.js, MongoDB & JWT Authentication.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
