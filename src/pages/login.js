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
  clearError,
  escapeHtml,
  normalizeSkill,
} from './login/helpers.js';
import {
  handleLoginRequest,
  handleRegisterRequest,
  handleSkillsSubmitRequest,
} from './login/auth-handlers.js';
import { initializeAuthToggle, setupAuthNavbar } from './login/ui.js';

const createRegisterState = () => ({
  step: 1,
  userId: null,
  learnSkills: [],
  teachSkills: [],
  email: '',
  password: '',
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
      await handleLoginRequest();
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleSkillsSubmitRequest(registerState);
    });
  }

  nextBtn?.addEventListener('click', async () => {
    await handleRegisterRequest(registerState, showRegisterStep);
  });

  backBtn?.addEventListener('click', () => {
    showRegisterStep(1);
  });

  setupSkillInputs();
  renderSkillTags('learn');
  renderSkillTags('teach');
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
