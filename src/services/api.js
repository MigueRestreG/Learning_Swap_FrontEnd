const API_URL = import.meta.env.VITE_API_URL;

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

/** Save onboarding skills after registration */
export async function saveOnboardingSkills(
  user_id,
  learn_skills = [],
  teach_skills = []
) {
  const response = await fetch(`${API_URL}/onboarding/skills`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      user_id,
      learn_skills,
      teach_skills,
    }),
  });
  return handleResponse(response);
}

// ================================================
// PROFILE
// ================================================

/** Get profile data by user id from database */
export async function getUserById(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'GET',
    headers: buildHeaders(true),
  });
  return handleResponse(response);
}

/** Update profile by user id with FormData (supports local avatar file upload) */
export async function updateUserByIdFormData(
  userId,
  profileData = {},
  avatarFile = null
) {
  const formData = new FormData();

  const first_name = profileData.first_name;
  const last_name = profileData.last_name;
  const phone = profileData.phone;
  const bio = profileData.bio;

  if (first_name) formData.append('first_name', first_name);
  if (last_name) formData.append('last_name', last_name);
  if (phone) formData.append('phone', phone);
  if (bio) formData.append('bio', bio);

  if (avatarFile) {
    formData.append('foto', avatarFile, avatarFile.name);
  }

  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    body: formData,
  });

  return handleResponse(response);
}

// ================================================
// MATCHES / CHAT
// ================================================

/** Get discovery feed for a user id */
export async function getFeed(userId) {
  if (!userId) {
    throw new Error('No se encontró el usuario para cargar el feed');
  }

  const response = await fetch(`${API_URL}/feed/${userId}`, {
    method: 'GET',
    headers: buildHeaders(true),
  });

  return handleResponse(response);
}

/** Record swipe decision to potentially create a match */
export async function sendSwipe(userFromId, userToId, action) {
  if (!userFromId || !userToId) {
    throw new Error('No se pudo registrar el swipe por datos incompletos');
  }

  if (action !== 'like' && action !== 'pass') {
    throw new Error('La acción del swipe debe ser like o pass');
  }

  const response = await fetch(`${API_URL}/swipe`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify({
      user_from_id: Number(userFromId),
      user_to_id: Number(userToId),
      action,
    }),
  });

  return handleResponse(response);
}

/** Get matches list for a user id */
export async function getMatches(userId) {
  if (!userId) {
    throw new Error('No se encontró el usuario para cargar matches');
  }

  const response = await fetch(`${API_URL}/matches/${userId}`, {
    method: 'GET',
    headers: buildHeaders(true),
  });

  return handleResponse(response);
}

/** Get chat history by room id */
export async function getMessages(roomId) {
  if (!roomId) {
    throw new Error('No se encontró la sala del chat');
  }

  const response = await fetch(`${API_URL}/messages/${roomId}`, {
    method: 'GET',
    headers: buildHeaders(true),
  });

  return handleResponse(response);
}
