/**
 * API client stub prepared for Django REST Framework backend.
 * Set VITE_API_BASE_URL in .env (e.g. http://localhost:8000/api)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = new Error(`API ${res.status}`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/events/${qs ? `?${qs}` : ''}`);
  },
  getEvent: (slug) => request(`/events/${slug}/`),
  search: (q) => request(`/events/?search=${encodeURIComponent(q)}`),
  getWatchlist: () => request('/watchlist/'),
  addToWatchlist: (eventId) =>
    request('/watchlist/', {
      method: 'POST',
      body: JSON.stringify({ event_id: eventId }),
    }),
  removeFromWatchlist: (eventId) =>
    request(`/watchlist/${eventId}/`, { method: 'DELETE' }),
};

export default api;
