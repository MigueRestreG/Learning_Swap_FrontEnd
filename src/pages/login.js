/**
 * Login Page Component
 * Renders the login form with navbar
 */

import { getNavbar, setupNavbarBurger } from '../components/navbar.js';

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
                    <h2>Log In</h2>

                    <!-- Social Media Icons -->
                    <div class="social-networks">
                        <ion-icon name="accessibility-outline"></ion-icon>
                        <ion-icon name="swap-horizontal-outline"></ion-icon>
                    </div>

                    <!-- Inputs -->
                    <span>use your email and password</span>
                    <div class="container-input">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input type="email" id="login-email" placeholder="youremail@gmail.com" required>
                    </div>
                    <div class="container-input">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input type="password" id="login-password" placeholder="•••••••" required>
                    </div>
                    <a href="#forgot-password">forget your password?</a>
                    <button type="submit" class="button-logIn">Log In</button>
                </form>
            </div>

            <!-- Register Form (Hidden by default) -->
            <div class="container-form">
                <form class="sign-up" id="form-sign-up">
                    <h2>Register</h2>
                    <div class="social-networks">
                        <ion-icon name="accessibility-outline"></ion-icon>
                        <ion-icon name="swap-horizontal-outline"></ion-icon>
                    </div>
                    <span>use your email for registration.</span>
                    <div class="container-input">
                        <ion-icon name="person-circle-outline"></ion-icon>
                        <input type="text" id="register-firstname" placeholder="First Name" required>
                    </div>
                    <div class="container-input">
                        <ion-icon name="person-circle-outline"></ion-icon>
                        <input type="text" id="register-lastname" placeholder="Last Name" required>
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
                        <input type="tel" id="register-phone" placeholder="Your Phone Number" required>
                    </div>
                    <button type="submit" class="button-register">Register</button>
                </form>
            </div>

            <!-- Welcome Container -->
            <div class="container-welcome">
                <div class="welcome-sign-up welcome">
                    <h3>¡Welcome Again!</h3>
                    <p>welcome to the new world that awaits you, please enter your personal information</p>
                    <button type="button" class="button-signup" id="btn-sign-up">Register</button>
                </div>
                <div class="welcome-sign-in welcome">
                    <h3>¡Welcome!</h3>
                    <p>welcome back, log in with your personal information</p>
                    <button type="button" class="button-star" id="btn-sign-in">Log in</button>
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
  const email = document.getElementById('login-email')?.value;
  const password = document.getElementById('login-password')?.value;

  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }

  try {
    // TODO: Replace with actual API call
    // const response = await fetch("/api/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password })
    // });

    // For now, simulate successful login
    console.log('Login attempt:', { email, password });
    localStorage.setItem('authToken', 'mock_token_' + Date.now());

    // Redirect to home page
    const { HomePage } = await import('./home.js');
    HomePage();
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
}

/**
 * Handle register submission
 */
async function handleRegister() {
  const firstName = document.getElementById('register-firstname')?.value;
  const lastName = document.getElementById('register-lastname')?.value;
  const email = document.getElementById('register-email')?.value;
  const password = document.getElementById('register-password')?.value;
  const phone = document.getElementById('register-phone')?.value;

  if (!firstName || !lastName || !email || !password || !phone) {
    alert('Please fill in all fields');
    return;
  }

  try {
    // TODO: Replace with actual API call
    // const response = await fetch("/api/register", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ firstName, lastName, email, password, phone })
    // });

    // For now, simulate successful registration
    console.log('Register attempt:', { firstName, lastName, email, phone });
    localStorage.setItem('authToken', 'mock_token_' + Date.now());

    // Redirect to home page
    const { HomePage } = await import('./home.js');
    HomePage();
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  }
}
