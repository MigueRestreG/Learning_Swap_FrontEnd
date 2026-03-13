const API_URL = 'https://learning-swap-backend.onrender.com';

/** -----------------------------------------------
 * Internal: parse response and throw on error
 * -----------------------------------------------*/
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Respuesta del servidor no válida');
  }

  if (!response.ok) {
    // Use server message when available
    throw new Error(
      data.message || data.error || data.detail || `HTTP ${response.status}`
    );
  }
  return data;
}

/** -----------------------------------------------
 * Internal: build headers with optional auth token
 * -----------------------------------------------*/
function buildHeaders(withAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ================================================
// AUTH
// ================================================

/** Login - returns { token, user } */
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

/** Register - returns { token, user } (or just success) */
export async function registerUser(
  first_name,
  last_name,
  email,
  password,
  phone
) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ first_name, last_name, email, password, phone }),
  });
  return handleResponse(response);
}

// ================================================
// PROFILE
// ================================================

/** Get the current authenticated user's profile */
export async function getUserProfile() {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: buildHeaders(true),
  });
  return handleResponse(response);
}

/** Update the current authenticated user's profile */
export async function updateUserProfile(profileData) {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: buildHeaders(true),
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
}
