const getApiBase = () => {
  const customUrl = localStorage.getItem('custom_api_url');
  if (customUrl && customUrl.trim()) {
    return `${customUrl.trim().replace(/\/+$/, '')}/api`;
  }
  if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) {
    return `${import.meta.env.VITE_API_BASE_URL.trim().replace(/\/+$/, '')}/api`;
  }
  return '/api';
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
        'Backend connection failed. If your Render backend was asleep, please wait ~30 seconds for it to wake up, or verify VITE_API_BASE_URL in Vercel environment variables.'
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
