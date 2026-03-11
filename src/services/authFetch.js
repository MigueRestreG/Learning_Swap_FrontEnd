import { logout } from '../utils/auth.js';

/**
 * Authenticated fetch wrapper.
 * Automatically injects the Bearer token and handles 401 → logout.
 */
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (networkErr) {
    throw new Error('Network error – check your connection.');
  }

  // Token expired / invalid → kick user out
  if (response.status === 401) {
    logout();
    throw new Error('Session expired. Please log in again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Invalid server response.');
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP ${response.status}`);
  }

  return data;
}
