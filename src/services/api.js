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

/** Get the current authenticated user's profile */
export async function getUserProfile() {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: buildHeaders(true),
  });
  return handleResponse(response);
}

/** Get profile data by user id from database */
export async function getUserById(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'GET',
    headers: buildHeaders(),
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

/** Update profile by user id with strict JSON payload */
export async function updateUserById(userId, profileData = {}) {
  const body = {
    first_name: profileData.first_name ?? '',
    last_name: profileData.last_name ?? '',
    bio: profileData.bio ?? '',
    avatar_url: profileData.avatar_url ?? '',
    phone: profileData.phone ?? '',
  };

  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body),
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
