import { HomePage } from './pages/home.js';
import { isAuthenticated } from './utils/auth.js';

const HOME_HASHES = new Set([
  '',
  '#home',
  '#hero',
  '#how',
  '#features',
  '#prices',
  '#why',
  '#cta',
]);

function cleanupRenderedView() {
  if (window.__homeCleanup) {
    window.__homeCleanup();
    window.__homeCleanup = null;
  }

  if (window.__homeScrollHandler) {
    window.removeEventListener('scroll', window.__homeScrollHandler);
    window.__homeScrollHandler = null;
  }

  if (window.__swapsCleanup) {
    window.__swapsCleanup();
    window.__swapsCleanup = null;
  }

  document.body.style.overflow = '';
}

async function initializeApp() {
  const path = window.location.hash || '#home';

  cleanupRenderedView();

  if (HOME_HASHES.has(path)) {
    const sectionId = path === '#home' || path === '' ? null : path.slice(1);
    HomePage(sectionId);
    return;
  }

  if (path === '#profile' && isAuthenticated()) {
    const { ProfilePage } = await import('./pages/profile.js');
    ProfilePage();
    return;
  }

  if (path === '#swaps' && isAuthenticated()) {
    const { SwapsPage } = await import('./pages/swaps.js');
    SwapsPage('matches');
    return;
  }

  if (path === '#chats' && isAuthenticated()) {
    const { SwapsPage } = await import('./pages/swaps.js');
    SwapsPage('chats');
    return;
  }

  if (path === '#profile' || path === '#swaps' || path === '#chats') {
    window.history.replaceState(null, '', '#home');
    HomePage();
    return;
  }

  window.history.replaceState(null, '', '#home');
  HomePage();
}

document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('hashchange', initializeApp);
if (document.readyState !== 'loading') {
  initializeApp();
}
