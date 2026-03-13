import { HomePage } from './pages/home.js';

function initializeApp() {
  HomePage();
}

// Call immediately since Vite handles everything
document.addEventListener('DOMContentLoaded', initializeApp);
if (document.readyState !== 'loading') {
  initializeApp();
}
