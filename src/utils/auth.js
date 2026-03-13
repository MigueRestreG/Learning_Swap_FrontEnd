/**
 * Auth Utilities
 * Helper functions for authentication state management
 */

const TOKEN_KEY = 'token';
const USER_KEY = 'userData';
const CURRENT_USER_ID_KEY = 'currentUser';
const PENDING_ONBOARDING_KEY = 'pendingOnboarding';

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated() {
  if (isOnboardingPending()) return false;
  const token = localStorage.getItem(TOKEN_KEY);
  const user = getCurrentUser();
  return !!token || !!user;
}

/**
 * Save user data to localStorage after login/register
 */
export function saveUserData(data) {
  const token =
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.authToken ||
    data?.user?.token ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.data?.access_token;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  const directUserId =
    data?.user_id ||
    data?.user?.id ||
    data?.data?.user_id ||
    data?.data?.user?.id ||
    data?.profile?.id ||
    data?.id;

  if (
    directUserId !== undefined &&
    directUserId !== null &&
    directUserId !== ''
  ) {
    saveCurrentUserId(directUserId);
  }

  const current = getCurrentUser() || {};
  const candidate =
    data?.user ||
    data?.data?.user ||
    data?.profile ||
    (data && typeof data === 'object' ? data : null);

  if (!candidate || typeof candidate !== 'object') return;

  const hasIdentityFields =
    'id' in candidate ||
    'email' in candidate ||
    'first_name' in candidate ||
    'last_name' in candidate ||
    'name' in candidate ||
    'phone' in candidate ||
    'bio' in candidate ||
    'about_me' in candidate;

  if (!hasIdentityFields) return;

  const user = { ...current, ...candidate };
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  if (user.id !== undefined && user.id !== null && user.id !== '') {
    saveCurrentUserId(user.id);
  }
}

/**
 * Get stored user data from localStorage
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Get the stored auth token
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveCurrentUserId(userId) {
  localStorage.setItem(CURRENT_USER_ID_KEY, String(userId));
}

export function getCurrentUserId() {
  return localStorage.getItem(CURRENT_USER_ID_KEY);
}

export function setOnboardingPending(value) {
  if (value) {
    localStorage.setItem(PENDING_ONBOARDING_KEY, '1');
    return;
  }
  localStorage.removeItem(PENDING_ONBOARDING_KEY);
}

export function isOnboardingPending() {
  return localStorage.getItem(PENDING_ONBOARDING_KEY) === '1';
}

/**
 * Clear all auth data and navigate to home
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(CURRENT_USER_ID_KEY);
  localStorage.removeItem(PENDING_ONBOARDING_KEY);

  // Remove auth classes from body
  document.body.classList.remove('auth-page', 'register-mode');

  // Navigate to home
  import('../pages/home.js').then(({ HomePage }) => {
    HomePage();
  });
}

/**
 * Get user initials from name (for avatar)
 */
export function getUserInitials(firstName = '', lastName = '') {
  const f = (firstName || '').trim().charAt(0).toUpperCase();
  const l = (lastName || '').trim().charAt(0).toUpperCase();
  return f + l || '?';
}
