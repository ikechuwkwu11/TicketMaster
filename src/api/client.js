/**
 * TicketMaster API client for Django REST Framework.
 * Base URL: VITE_API_BASE_URL (default http://localhost:8000/api)
 */

// Prefer same-origin /api (Vite proxies to Django). Override with full URL if needed.
const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || '/api'
).replace(/\/$/, '');

const TOKEN_KEY = 'tm-admin-access';
const REFRESH_KEY = 'tm-admin-refresh';

export function getAccessToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = await res.json();
  if (data.access) setTokens({ access: data.access });
  return data.access || null;
}

export async function request(path, options = {}, retry = true) {
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && retry && getRefreshToken()) {
    const next = await refreshAccessToken();
    if (next) return request(path, options, false);
  }

  if (!res.ok) {
    let detail = `API ${res.status}`;
    try {
      const body = await res.json();
      detail =
        body.detail ||
        (typeof body === 'object' ? JSON.stringify(body) : detail);
    } catch {
      /* ignore */
    }
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export const api = {
  bootstrap: () => request('/bootstrap/'),

  // Auth
  login: (username, password) =>
    request('/auth/admin/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  me: () => request('/auth/admin/me/'),

  // Sections
  getSections: () => request('/sections/'),
  updateSection: (key, data) =>
    request(`/sections/${key}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Events
  getEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/events/${qs ? `?${qs}` : ''}`);
  },
  getEventsBySection: () => request('/events/by_section/'),
  getEvent: (slug) => request(`/events/${slug}/`),
  createEvent: (data) =>
    request('/events/', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (slugOrId, data) =>
    request(`/events/${slugOrId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteEvent: (slugOrId) =>
    request(`/events/${slugOrId}/`, { method: 'DELETE' }),

  // Tickets
  getTicketsCatalog: () => request('/tickets/catalog/'),
  getTicket: (slug) => request(`/tickets/${slug}/`),
  createTicket: (data) =>
    request('/tickets/', { method: 'POST', body: JSON.stringify(data) }),
  updateTicket: (slugOrId, data) =>
    request(`/tickets/${slugOrId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTicket: (slugOrId) =>
    request(`/tickets/${slugOrId}/`, { method: 'DELETE' }),

  // Images
  getImages: () => request('/images/'),
  createImage: (data) => {
    if (data instanceof FormData) {
      return request('/images/', { method: 'POST', body: data });
    }
    return request('/images/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  deleteImage: (id) => {
    const pk = String(id).replace(/^img-/, '');
    return request(`/images/${pk}/`, { method: 'DELETE' });
  },

  resetCatalog: () => request('/catalog/reset/', { method: 'POST', body: '{}' }),
};

export default api;
