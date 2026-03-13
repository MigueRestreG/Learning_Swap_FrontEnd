import { HomePage } from './pages/home.js';
import { isAuthenticated } from './utils/auth.js';


async function initializeApp() {
  const path = window.location.hash || '';

  if (path === '#profile' && isAuthenticated()) {
    const { ProfilePage } = await import('./pages/profile.js');
    ProfilePage();
  } else {
    HomePage();
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);
if (document.readyState !== 'loading') {
  initializeApp();
}
