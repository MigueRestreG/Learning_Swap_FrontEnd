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
import {
  loginUser,
  registerUser,
  saveOnboardingSkills,
} from '../services/api.js';
import {
  getCurrentUser,
  getCurrentUserId,
  saveCurrentUserId,
  setOnboardingPending,
  saveUserData,
} from '../utils/auth.js';

const createRegisterState = () => ({
  step: 1,
  userId: null,
  learnSkills: [],
  teachSkills: [],
});

let registerState = createRegisterState();

export function LoginPage(mode = 'login') {
  const app = document.getElementById('app');

  if (window.__homeCleanup) {
    window.__homeCleanup();
    window.__homeCleanup = null;
  }

  if (window.__homeScrollHandler) {
    window.removeEventListener('scroll', window.__homeScrollHandler);
    window.__homeScrollHandler = null;
  }

  registerState = createRegisterState();

  // Add auth-page class to body for styling
  document.body.classList.remove('register-mode');
  document.body.classList.add('auth-page');
  window.scrollTo({ top: 0, behavior: 'auto' });

  const template = `
    ${getNavbar()}
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
                    <span>completa tus datos y luego agrega tus habilidades.</span>

                    <div class="register-step register-step--active" id="register-step-account">
                      <div class="register-step-header">
                        <span class="register-step-badge">Paso 1</span>
                        <p>Crea tu cuenta con tu información básica.</p>
                      </div>
                      <div class="register-fields-grid">
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
                      </div>
                    </div>

                    <div class="register-step" id="register-step-skills">
                      <div class="register-step-header">
                        <span class="register-step-badge">Paso 2</span>
                        <p>Agrega las habilidades que quieres aprender y enseñar.</p>
                      </div>

                      <div class="register-skills-grid">
                        <div class="skill-group">
                          <label for="register-learn-skill">Quiero aprender</label>
                          <div class="skill-input-row">
                            <div class="container-input container-input--skill">
                                <ion-icon name="book-outline"></ion-icon>
                                <input type="text" id="register-learn-skill" placeholder="Ej: Inglés">
                            </div>
                            <button type="button" class="button-skill-add" data-skill-target="learn">Agregar</button>
                          </div>
                          <div class="skills-chip-list" id="register-learn-list"></div>
                        </div>

                        <div class="skill-group">
                          <label for="register-teach-skill">Puedo enseñar</label>
                          <div class="skill-input-row">
                            <div class="container-input container-input--skill">
                                <ion-icon name="bulb-outline"></ion-icon>
                                <input type="text" id="register-teach-skill" placeholder="Ej: Programación">
                            </div>
                            <button type="button" class="button-skill-add button-skill-add--teach" data-skill-target="teach">Agregar</button>
                          </div>
                          <div class="skills-chip-list" id="register-teach-list"></div>
                        </div>
                      </div>

                      <p class="register-step-note">Presiona Enter o usa el botón agregar para guardar cada habilidad.</p>
                    </div>

                    <div class="form-error" id="register-error"></div>
                    <div class="register-actions">
                      <button type="button" class="button-register button-register-secondary" id="register-back" hidden>Volver</button>
                      <button type="button" class="button-register" id="register-next">Continuar</button>
                      <button type="submit" class="button-register" id="register-submit" hidden>Guardar habilidades</button>
                    </div>
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
  const nextBtn = document.getElementById('register-next');
  const backBtn = document.getElementById('register-back');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleLogin();
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleSkillsSubmit();
    });
  }

  nextBtn?.addEventListener('click', async () => {
    await handleRegister();
  });

  backBtn?.addEventListener('click', () => {
    showRegisterStep(1);
  });

  setupSkillInputs();
  renderSkillTags('learn');
  renderSkillTags('teach');
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
    setOnboardingPending(false);

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
  const btn = document.getElementById('register-next');

  if (registerState.userId) {
    showRegisterStep(2);
    return;
  }

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

    const userId = getUserIdFromResponse(data);

    if (userId) {
      saveCurrentUserId(userId);
    }

    setOnboardingPending(true);

    saveUserData({
      user: {
        ...(getCurrentUser() || {}),
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      },
    });

    registerState.userId =
      userId || getCurrentUser()?.id || getCurrentUserId() || null;

    if (!registerState.userId) {
      throw new Error(
        'No fue posible identificar el usuario registrado para guardar sus habilidades.'
      );
    }

    showRegisterStep(2);
  } catch (error) {
    showError(
      errorEl,
      error.message || 'El registro falló. Inténtalo de nuevo.'
    );
  } finally {
    setLoading(btn, false);
  }
}

async function handleSkillsSubmit() {
  const errorEl = document.getElementById('register-error');
  const btn = document.getElementById('register-submit');

  if (!registerState.userId) {
    registerState.userId = getCurrentUserId() || registerState.userId;
  }

  if (!registerState.userId) {
    showError(
      errorEl,
      'Primero debes completar el registro antes de guardar las habilidades.'
    );
    showRegisterStep(1);
    return;
  }

  setLoading(btn, true, 'Guardar habilidades');
  clearError(errorEl);

  try {
    await saveOnboardingSkills(
      registerState.userId,
      registerState.learnSkills,
      registerState.teachSkills
    );

    setOnboardingPending(false);

    const currentUser = getCurrentUser() || {};
    saveUserData({
      user: {
        ...currentUser,
        id: registerState.userId,
        learn_skills: [...registerState.learnSkills],
        teach_skills: [...registerState.teachSkills],
      },
    });

    const { ProfilePage } = await import('./profile.js');
    ProfilePage();
  } catch (error) {
    showError(
      errorEl,
      error.message ||
        'No se pudieron guardar las habilidades. Inténtalo de nuevo.'
    );
  } finally {
    setLoading(btn, false, 'Guardar habilidades');
  }
}

function setupSkillInputs() {
  const learnInput = document.getElementById('register-learn-skill');
  const teachInput = document.getElementById('register-teach-skill');

  [learnInput, teachInput].forEach((input) => {
    if (!input) return;
    input.disabled = false;
    input.readOnly = false;
  });

  document.querySelectorAll('.container-input--skill').forEach((wrapper) => {
    wrapper.addEventListener('click', () => {
      const input = wrapper.querySelector('input');
      input?.focus();
    });
  });

  document.querySelectorAll('[data-skill-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.skillTarget;
      addSkill(target);
    });
  });

  learnInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill('learn');
    }
  });

  teachInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill('teach');
    }
  });
}

function addSkill(target) {
  const input = document.getElementById(
    target === 'learn' ? 'register-learn-skill' : 'register-teach-skill'
  );
  const value = normalizeSkill(input?.value || '');

  if (!value) return;

  const key = target === 'learn' ? 'learnSkills' : 'teachSkills';
  const alreadyExists = registerState[key].some(
    (skill) => skill.toLowerCase() === value.toLowerCase()
  );

  if (!alreadyExists) {
    registerState[key].push(value);
    renderSkillTags(target);
  }

  input.value = '';
  input.focus();
}

function removeSkill(target, index) {
  const key = target === 'learn' ? 'learnSkills' : 'teachSkills';
  registerState[key] = registerState[key].filter(
    (_, itemIndex) => itemIndex !== index
  );
  renderSkillTags(target);
}

function renderSkillTags(target) {
  const list = document.getElementById(
    target === 'learn' ? 'register-learn-list' : 'register-teach-list'
  );

  if (!list) return;

  const items =
    target === 'learn' ? registerState.learnSkills : registerState.teachSkills;

  if (!items.length) {
    list.innerHTML = `
      <span class="skill-empty-state">
        ${target === 'learn' ? 'Aún no agregas habilidades para aprender.' : 'Aún no agregas habilidades para enseñar.'}
      </span>
    `;
    return;
  }

  list.innerHTML = items
    .map(
      (skill, index) => `
        <span class="skill-chip ${target === 'teach' ? 'skill-chip--teach' : ''}">
          ${escapeHtml(skill)}
          <button type="button" class="skill-chip-remove" data-skill-remove="${target}" data-skill-index="${index}" aria-label="Eliminar ${escapeHtml(skill)}">
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </span>
      `
    )
    .join('');

  list.querySelectorAll('[data-skill-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      removeSkill(
        button.dataset.skillRemove,
        Number(button.dataset.skillIndex)
      );
    });
  });
}

function showRegisterStep(step) {
  registerState.step = step;

  const accountStep = document.getElementById('register-step-account');
  const skillsStep = document.getElementById('register-step-skills');
  const nextBtn = document.getElementById('register-next');
  const backBtn = document.getElementById('register-back');
  const submitBtn = document.getElementById('register-submit');
  const errorEl = document.getElementById('register-error');

  accountStep?.classList.toggle('register-step--active', step === 1);
  skillsStep?.classList.toggle('register-step--active', step === 2);

  if (nextBtn) nextBtn.hidden = step !== 1;
  if (backBtn) backBtn.hidden = step !== 2;
  if (submitBtn) submitBtn.hidden = step !== 2;

  if (step === 2) {
    const learnInput = document.getElementById('register-learn-skill');
    const teachInput = document.getElementById('register-teach-skill');

    [learnInput, teachInput].forEach((input) => {
      if (!input) return;
      input.disabled = false;
      input.readOnly = false;
    });

    setTimeout(() => {
      learnInput?.focus();
    }, 0);
  }

  clearError(errorEl);
}

function getUserIdFromResponse(data) {
  const candidates = [
    data?.user?.id,
    data?.data?.user?.id,
    data?.profile?.id,
    data?.id,
    data?.user_id,
    data?.data?.id,
    data?.data?.user_id,
  ];

  const found = candidates.find(
    (candidate) =>
      candidate !== undefined && candidate !== null && candidate !== ''
  );

  return found ?? null;
}

function normalizeSkill(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
function setLoading(btn, loading, defaultLabel = '') {
  if (!btn) return;
  btn.disabled = loading;
  if (!btn.dataset.label) {
    btn.dataset.label = defaultLabel || btn.textContent;
  }
  btn.textContent = loading
    ? 'Cargando…'
    : btn.dataset.label || btn.textContent;
  if (!defaultLabel && !btn.dataset.label && !loading) {
    btn.textContent = btn.classList.contains('button-logIn')
      ? 'Iniciar sesión'
      : 'Registrarse';
  }
}
