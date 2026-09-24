const DEFAULT_REMOTE_API = 'https://event-management-api-6mpk.onrender.com';

const getApiBase = () => {
  // 1. If user set a custom URL in localStorage
  const customUrl = localStorage.getItem('custom_api_url');
  if (customUrl && customUrl.trim()) {
    return `${customUrl.trim().replace(/\/+$/, '')}/api`;
  }
  
  // 2. If environment variable is set
  if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) {
    return `${import.meta.env.VITE_API_BASE_URL.trim().replace(/\/+$/, '')}/api`;
  }

  // 3. If running on local dev (localhost), use local proxy '/api'
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return '/api';
  }

  // 4. Default for production cloud deployment: your live Render backend
  return `${DEFAULT_REMOTE_API}/api`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: res.statusText || 'Server responded with unexpected format' };
    }
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.toLowerCase().includes('failed to fetch')) {
      throw new Error(
        'Connecting to Render backend... Render free-tier servers sleep after inactivity and take ~30s to wake up on the first request. Please click Sign In/Register again now!'
      );
    }
    throw err;
  }
};

export const api = {
  // Auth API
  async login(email, password) {
    return handleFetch(`${getApiBase()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  async register(name, email, password, role) {
    return handleFetch(`${getApiBase()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  async getMe() {
    return handleFetch(`${getApiBase()}/auth/me`, {
      headers: getAuthHeaders(),
    });
  },

  // Events API
  async getEvents(params = {}) {
    const query = new URLSearchParams();
    if (params.keyword) query.append('keyword', params.keyword);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status) query.append('status', params.status);

    return handleFetch(`${getApiBase()}/events?${query.toString()}`);
  },

  async getEventById(id) {
    return handleFetch(`${getApiBase()}/events/${id}`);
  },

  async createEvent(eventData) {
    return handleFetch(`${getApiBase()}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
  },

  async updateEvent(id, eventData) {
    return handleFetch(`${getApiBase()}/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
  },

  async deleteEvent(id) {
    return handleFetch(`${getApiBase()}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  async getMyCreatedEvents() {
    return handleFetch(`${getApiBase()}/events/my/created`, {
      headers: getAuthHeaders(),
    });
  },

  // Registrations API
  async registerForEvent(eventId, payload = {}) {
    return handleFetch(`${getApiBase()}/registrations/${eventId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
  },

  async getMyRegistrations() {
    return handleFetch(`${getApiBase()}/registrations/my`, {
      headers: getAuthHeaders(),
    });
  },

  async cancelRegistration(id) {
    return handleFetch(`${getApiBase()}/registrations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  async getEventAttendees(eventId) {
    return handleFetch(`${getApiBase()}/registrations/event/${eventId}/attendees`, {
      headers: getAuthHeaders(),
    });
  },
};
