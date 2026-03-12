/**
 * Auth Utilities
 * Helper functions for authentication state management
 */

const TOKEN_KEY = 'token';
const USER_KEY = 'userData';

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated() {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = getCurrentUser();
  return !!token || !!user;
}

/**
 * Save user data to localStorage after login/register
 */
export function saveUserData(data) {
  const token = data?.token || data?.access_token || data?.authToken;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  // Store user info separately for quick access
  const user = data.user || data;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
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

/**
 * Clear all auth data and navigate to home
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

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
