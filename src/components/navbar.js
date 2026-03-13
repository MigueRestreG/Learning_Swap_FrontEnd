/**
 * Navbar Component - Shared across all pages
 * Returns the navbar HTML structure
 */

export function getNavbar(isAuthPage = false) {
  return `
        <!-- NAVBAR -->
        <header class="navbar">
            <div class="navbar-container">
                <a class="navbar-brand" href="#home" data-link>
                    <img class="navbar-logo" src="/assets/icons/logo.svg" alt="Learning Swap Exchange" />
                    <span>Learning Swap</span>
                </a>

                <nav class="navbar-links">
                    <a href="#how" class="nav-link">How it works</a>
                    <a href="#features" class="nav-link">Features</a>
                    <a href="#why" class="nav-link">Why us</a>
                    <a href="#cta" class="nav-link">Get started</a>
                </nav>

                <div class="navbar-actions">
                    <button class="btn secondary" id="btnLogin">Log in</button>
                    <button class="btn primary" id="btnSignup">Create account</button>
                </div>

                <button
                    class="navbar-burger"
                    id="navToggle"
                    aria-label="Toggle menu"
                    aria-expanded="false"
                    aria-controls="navMobile"
                >
                    <span></span><span></span><span></span>
                </button>
            </div>

            <div class="navbar-mobile" id="navMobile">
                <a href="#how" class="nav-link">How it works</a>
                <a href="#features" class="nav-link">Features</a>
                <a href="#why" class="nav-link">Why us</a>
                <a href="#cta" class="nav-link">Get started</a>
                <div class="navbar-mobile-actions">
                    <button class="btn secondary" id="btnLoginMobile">Log in</button>
                    <button class="btn primary" id="btnSignupMobile">Create account</button>
                </div>
            </div>
        </header>
    `;
}

/**
 * Setup navbar navigation for authentication pages
 * Redirects back to homepage when clicking the logo
 */
export function setupAuthNavbar() {
  const logoLink = document.querySelector('.navbar-brand');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Import HomePage to avoid circular dependency
      import('../pages/home.js').then(({ HomePage }) => {
        HomePage();
      });
    });
  }
}

/**
 * Setup navbar burger for mobile menu toggle
 */
export function setupNavbarBurger() {
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      navMobile.classList.toggle('active');
      navToggle.setAttribute(
        'aria-expanded',
        navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
      );
    });
  }
}
