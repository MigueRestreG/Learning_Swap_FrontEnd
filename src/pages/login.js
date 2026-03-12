/**
 * Login Page Component
 * Renders the login / register forms and connects to the real API.
 */

import {
  getNavbar,
  setupNavbarAuthActions,
  setupNavbarBurger,
  setupNavbarSectionLinks,
} from '../components/navbar.js';
import { loginUser, registerUser } from '../services/api.js';
import { getCurrentUser, saveUserData } from '../utils/auth.js';

export function LoginPage(mode = 'login') {
  const app = document.getElementById('app');

  // Add auth-page class to body for styling
  document.body.classList.remove('register-mode');
  document.body.classList.add('auth-page');
  window.scrollTo({ top: 0, behavior: 'auto' });

  const template = `
    ${getNavbar(true)}
    <div class="auth-wrapper">
        <div class="container">
            <!-- Login Form -->
            <div class="container-form">
                <form class="sign-in" id="form-sign-in">
                <h2>Iniciar sesión</h2>

                    <!-- Social Media Icons -->
                    <div class="social-networks">
                        <ion-icon name="accessibility-outline"></ion-icon>
                        <ion-icon name="swap-horizontal-outline"></ion-icon>
                    </div>

                    <!-- Inputs -->
                    <span>usa tu correo y contraseña</span>
                    <div class="container-input">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input type="email" id="login-email" placeholder="youremail@gmail.com" required>
                    </div>
                    <div class="container-input">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input type="password" id="login-password" placeholder="•••••••" required>
                    </div>
                    <a href="#forgot-password">¿Olvidaste tu contraseña?</a>
                    <div class="form-error" id="login-error"></div>
                    <button type="submit" class="button-logIn">Iniciar sesión</button>
                </form>
            </div>

            <!-- Register Form (Hidden by default) -->
            <div class="container-form">
                <form class="sign-up" id="form-sign-up">
                  <h2>Registrarse</h2>
                    <div class="social-networks">
                        <ion-icon name="accessibility-outline"></ion-icon>
                        <ion-icon name="swap-horizontal-outline"></ion-icon>
                    </div>
                    <span>usa tu correo para registrarte.</span>
                    <div class="container-input">
                        <ion-icon name="person-circle-outline"></ion-icon>
                        <input type="text" id="register-firstname" placeholder="Nombre" required>
                    </div>
                    <div class="container-input">
                        <ion-icon name="person-circle-outline"></ion-icon>
                        <input type="text" id="register-lastname" placeholder="Apellido" required>
                    </div>
                    <div class="container-input">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input type="email" id="register-email" placeholder="youremail@gmail.com" required>
                    </div>
                    <div class="container-input">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input type="password" id="register-password" placeholder="••••••••" required>
                    </div>
                    <div class="container-input">
                        <ion-icon name="call-outline"></ion-icon>
                        <input type="tel" id="register-phone" placeholder="Tu número de teléfono" required>
                    </div>
                    <div class="form-error" id="register-error"></div>
                      <button type="submit" class="button-register">Registrarse</button>
                </form>
            </div>

            <!-- Welcome Container -->
            <div class="container-welcome">
                <div class="welcome-sign-up welcome">
                  <h3>¡Bienvenido de nuevo!</h3>
                  <p>te damos la bienvenida al nuevo mundo que te espera, ingresa tu información personal</p>
                  <button type="button" class="button-signup" id="btn-sign-up">Registrarse</button>
                </div>
                <div class="welcome-sign-in welcome">
                  <h3>¡Bienvenido!</h3>
                  <p>qué bueno verte de nuevo, inicia sesión con tu información personal</p>
                  <button type="button" class="button-star" id="btn-sign-in">Iniciar sesión</button>
                </div>
            </div>
        </div>
    </div>
    `;

  app.innerHTML = template;

  // if caller requested the register form, activate toggle immediately
  if (mode === 'register') {
    const container = document.querySelector('.container');
    if (container) container.classList.add('toggle');
    document.body.classList.add('register-mode');
  }

  // Setup navbar interactions
  setupAuthNavbar();
  setupNavbarBurger();
  setupNavbarAuthActions();
  setupNavbarSectionLinks();

  // Add event listeners for toggle functionality
  initializeAuthToggle();

  // Add form submission handlers
  setupFormHandlers();
}

/**
 * Setup navbar buttons for auth pages to go back to home
 */
function setupAuthNavbar() {
  const logoLink = document.querySelector('.navbar-brand');
  if (logoLink) {
    logoLink.addEventListener('click', async (e) => {
      e.preventDefault();
      document.body.classList.remove('auth-page', 'register-mode');
      const { HomePage } = await import('./home.js');
      HomePage();
    });
  }

  // buttons on auth pages should switch mode or navigate
  const navAction = async (targetMode) => {
    document.body.classList.remove('auth-page', 'register-mode');
    const { LoginPage } = await import('./login.js');
    LoginPage(targetMode);
  };

  ['btnLogin', 'btnLoginMobile'].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        navAction('login');
      });
    }
  });

  ['btnSignup', 'btnSignupMobile'].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        navAction('register');
      });
    }
  });
}

/**
 * Initialize Login/Register toggle functionality
 */
function initializeAuthToggle() {
  const container = document.querySelector('.container');
  const btnSignUp = document.getElementById('btn-sign-up');
  const btnSignIn = document.getElementById('btn-sign-in');

  if (btnSignUp) {
    btnSignUp.addEventListener('click', () => {
      container.classList.add('toggle');
      document.body.classList.add('register-mode');
    });
  }

  if (btnSignIn) {
    btnSignIn.addEventListener('click', () => {
      container.classList.remove('toggle');
      document.body.classList.remove('register-mode');
    });
  }
}

/**
 * Setup form submission handlers
 */
function setupFormHandlers() {
  const loginForm = document.getElementById('form-sign-in');
  const registerForm = document.getElementById('form-sign-up');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleLogin();
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleRegister();
    });
  }
}

/**
 * Handle login submission
 */
async function handleLogin() {
  const email = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  const errorEl = document.getElementById('login-error');
  const btn = document.querySelector('#form-sign-in .button-logIn');

  if (!email || !password) {
    showError(errorEl, 'Por favor completa todos los campos.');
    return;
  }

  setLoading(btn, true);
  clearError(errorEl);

  try {
    const data = await loginUser(email, password);
    saveUserData(data);

    if (!getCurrentUser()) {
      saveUserData({ user: { email } });
    }

    // Navigate to profile
    const { ProfilePage } = await import('./profile.js');
    ProfilePage();
  } catch (error) {
    showError(
      errorEl,
      error.message || 'El inicio de sesión falló. Inténtalo de nuevo.'
    );
  } finally {
    setLoading(btn, false);
  }
}

/**
 * Handle register submission
 */
async function handleRegister() {
  const firstName = document.getElementById('register-firstname')?.value.trim();
  const lastName = document.getElementById('register-lastname')?.value.trim();
  const email = document.getElementById('register-email')?.value.trim();
  const password = document.getElementById('register-password')?.value;
  const phone = document.getElementById('register-phone')?.value.trim();
  const errorEl = document.getElementById('register-error');
  const btn = document.querySelector('#form-sign-up .button-register');

  if (!firstName || !lastName || !email || !password || !phone) {
    showError(errorEl, 'Por favor completa todos los campos.');
    return;
  }

  setLoading(btn, true);
  clearError(errorEl);

  try {
    const data = await registerUser(
      firstName,
      lastName,
      email,
      password,
      phone
    );
    saveUserData(data);

    if (!getCurrentUser()) {
      saveUserData({
        user: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
        },
      });
    }

    // Navigate to profile
    const { ProfilePage } = await import('./profile.js');
    ProfilePage();
  } catch (error) {
    showError(
      errorEl,
      error.message || 'El registro falló. Inténtalo de nuevo.'
    );
  } finally {
    setLoading(btn, false);
  }
}

/** Show inline error message */
function showError(el, message) {
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
}

/** Clear inline error message */
function clearError(el) {
  if (!el) return;
  el.textContent = '';
  el.style.display = 'none';
}

/** Toggle loading state on submit button */
function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading
    ? 'Cargando…'
    : btn.dataset.label || btn.textContent;
  if (!btn.dataset.label && !loading) {
    btn.textContent = btn.classList.contains('button-logIn')
      ? 'Iniciar sesión'
      : 'Registrarse';
  }
}
