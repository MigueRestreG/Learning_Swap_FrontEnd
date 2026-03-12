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
    throw new Error('Error de red: revisa tu conexión.');
  }

  // Token expired / invalid → kick user out
  if (response.status === 401) {
    logout();
    throw new Error('La sesión expiró. Inicia sesión de nuevo.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Respuesta del servidor no válida.');
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP ${response.status}`);
  }

  return data;
}
