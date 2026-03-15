/**
 * Profile Page Component
 * Displays the authenticated user's profile
 */

import {
  getNavbar,
  setupNavbarAuthActions,
  setupNavbarBurger,
  setupNavbarSectionLinks,
} from '../components/navbar.js';
import {
  getCurrentUser,
  getCurrentUserId,
  getUserInitials,
  logout,
} from '../utils/auth.js';
import {
  getMatches,
  getMyProfile,
  updateUserByIdFormData,
} from '../services/api.js';
import { saveUserData } from '../utils/auth.js';

export async function ProfilePage() {
  const app = document.getElementById('app');

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

  document.body.classList.remove('auth-page', 'register-mode', 'swaps-page');
  document.body.classList.add('profile-page');
  document.body.style.overflow = '';
  window.history.replaceState(null, '', '#profile');
  window.scrollTo({ top: 0, behavior: 'auto' });

  // Show skeleton while loading
  app.innerHTML = `
    ${getNavbar()}
    <main class="profile-main">
      <div class="profile-loading">
        <div class="spinner"></div>
        <p>Cargando tu perfil…</p>
      </div>
    </main>
  `;

  setupNavbarBurger();
  setupNavbarAuthActions();
  setupNavbarSectionLinks();
  setupProfileNavbar();

  // Fetch fresh data from DB only via user id endpoint
  let user = null;
  const localUser = getCurrentUser();
  const currentUserId =
    localUser?.id || localUser?.user_id || getCurrentUserId();

  try {
    user = await getMyProfile();

    user = normalizeUserResponse(getProfilePayload(user));
    // Update local cache with fresh data
    saveUserData({ user });
  } catch {
    user = localUser;
  }

  if (!user) {
    // Not logged in — send to login
    document.body.classList.remove('profile-page');
    const { LoginPage } = await import('./login.js');
    LoginPage();
    return;
  }

  const profileStats = await getProfileStats(user);

  renderProfile(app, user, profileStats);
}

// ─── Render ──────────────────────────────────────────────────────────────────

function renderProfile(app, user, profileStats = createEmptyProfileStats()) {
  const avatarUrl = user.avatar_url || user.avatar || '';
  const initials = getUserInitials(
    user.first_name || user.name,
    user.last_name
  );
  const bio = (user.bio || user.about_me || '').trim();
  const safeBio = escapeHtml(bio).replace(/\n/g, '<br>');
  const fullName = [user.first_name || user.name, user.last_name]
    .filter(Boolean)
    .join(' ');
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
      })
    : 'Se unió recientemente';
  const teachSkills = getSkillList(user, 'teach');
  const learnSkills = getSkillList(user, 'learn');
  const offeredSkillsCount =
    profileStats.offeredSkills ?? countUniqueSkills(teachSkills);
  const sessionsCount = profileStats.sessions ?? 0;

  app.innerHTML = `
    ${getNavbar()}

    <main class="profile-main">
      
      <!-- Hero Section -->
      <section class="profile-hero">
        <div class="profile-hero-bg"></div>
        <div class="profile-hero-content">

          <!-- Avatar -->
          <div class="profile-avatar">
            ${
              avatarUrl
                ? `<img class="profile-avatar-image" src="${escapeHtml(avatarUrl)}" alt="Foto de perfil" />`
                : `<span class="profile-avatar-initials">${initials}</span>`
            }
            <div class="profile-avatar-ring"></div>
          </div>

          <div class="profile-hero-info">
            <h1 class="profile-name">${fullName || 'Usuario de Learning Swap'}</h1>
            <p class="profile-email">
              <ion-icon name="mail-outline"></ion-icon>
              ${user.email || ''}
            </p>
            ${
              user.phone
                ? `
            <p class="profile-phone">
              <ion-icon name="call-outline"></ion-icon>
              ${user.phone}
            </p>`
                : ''
            }
            <p class="profile-since">
              <ion-icon name="calendar-outline"></ion-icon>
              Miembro desde ${memberSince}
            </p>
          </div>

          <div class="profile-hero-actions">
            <button class="btn-profile-edit" id="btnEditProfile">
              <ion-icon name="create-outline"></ion-icon>
              Editar perfil
            </button>
            <button class="btn-profile-logout" id="btnLogout">
              <ion-icon name="log-out-outline"></ion-icon>
              Cerrar sesión
            </button>
          </div>
        </div>
      </section>

      <!-- Stats Bar -->
      <section class="profile-stats">
        <div class="stat-card">
          <span class="stat-number">${offeredSkillsCount}</span>
          <span class="stat-label">Habilidades ofrecidas</span>
          <ion-icon name="school-outline"></ion-icon>
        </div>
        <div class="stat-card">
          <span class="stat-number">${sessionsCount}</span>
          <span class="stat-label">Sesiones realizadas</span>
          <ion-icon name="swap-horizontal-outline"></ion-icon>
        </div>
        <div class="stat-card">
          <span class="stat-number">0</span>
          <span class="stat-label">Personas ayudadas</span>
          <ion-icon name="people-outline"></ion-icon>
        </div>
        <div class="stat-card">
          <span class="stat-number">0</span>
          <span class="stat-label">Puntos ganados</span>
          <ion-icon name="star-outline"></ion-icon>
        </div>
      </section>

      <!-- Content Grid -->
      <section class="profile-grid">

        <!-- About Card -->
        <div class="profile-card" id="aboutCard">
          <div class="profile-card-header">
            <ion-icon name="person-circle-outline"></ion-icon>
            <h3>Sobre mí</h3>
          </div>
          <div class="profile-card-body" id="aboutBody">
            ${
              bio
                ? `<p class="profile-about-text">${safeBio}</p>`
                : `<p class="profile-placeholder">
              <ion-icon name="sparkles-outline"></ion-icon>
              Aún no tienes biografía — ¡cuéntale a la comunidad quién eres!
            </p>`
            }
          </div>
        </div>

        <!-- Skills Offered Card -->
        <div class="profile-card">
          <div class="profile-card-header">
            <ion-icon name="bulb-outline"></ion-icon>
            <h3>Habilidades que puedo enseñar</h3>
          </div>
          <div class="profile-card-body">
            <div class="skills-grid" id="skillsOffered">
              ${renderSkills(teachSkills, 'teach')}
            </div>
          </div>
        </div>

        <!-- Skills Wanted Card -->
        <div class="profile-card">
          <div class="profile-card-header">
            <ion-icon name="telescope-outline"></ion-icon>
            <h3>Habilidades que quiero aprender</h3>
          </div>
          <div class="profile-card-body">
            <div class="skills-grid" id="skillsWanted">
              ${renderSkills(learnSkills, 'learn')}
            </div>
          </div>
        </div>

        <!-- Account Info Card -->
        <div class="profile-card">
          <div class="profile-card-header">
            <ion-icon name="shield-checkmark-outline"></ion-icon>
            <h3>Información de la cuenta</h3>
          </div>
          <div class="profile-card-body account-info">
            <div class="info-row">
              <span class="info-label">Nombre</span>
              <span class="info-value">${fullName || '—'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Correo</span>
              <span class="info-value">${user.email || '—'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Teléfono</span>
              <span class="info-value">${user.phone || '—'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Estado</span>
              <span class="info-value info-badge">
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                Activa
              </span>
            </div>
          </div>
        </div>

      </section>

      <!-- Edit Profile Modal -->
      <div class="modal-overlay" id="editModal" hidden>
        <div class="modal">
          <div class="modal-header">
            <h3>Editar perfil</h3>
            <button class="modal-close" id="btnCloseModal">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          <form class="modal-form" id="editProfileForm">
            <div class="modal-input-group">
              <label>Nombre</label>
              <div class="modal-input">
                <ion-icon name="person-outline"></ion-icon>
                <input type="text" id="edit-firstname" value="${user.first_name || user.name || ''}" placeholder="Nombre" required>
              </div>
            </div>
            <div class="modal-input-group">
              <label>Apellido</label>
              <div class="modal-input">
                <ion-icon name="person-outline"></ion-icon>
                <input type="text" id="edit-lastname" value="${user.last_name || ''}" placeholder="Apellido" required>
              </div>
            </div>
            <div class="modal-input-group">
              <label>Teléfono</label>
              <div class="modal-input">
                <ion-icon name="call-outline"></ion-icon>
                <input type="tel" id="edit-phone" value="${user.phone || ''}" placeholder="Número de teléfono">
              </div>
            </div>
            <div class="modal-input-group">
              <label>Biografía</label>
              <div class="modal-input modal-input--textarea">
                <textarea id="edit-bio" rows="3" placeholder="Cuéntale a la comunidad quién eres">${escapeHtml(user.bio || user.about_me || '')}</textarea>
              </div>
            </div>
            <div class="modal-input-group">
              <label>Foto de perfil</label>
              <div class="modal-input modal-input--file">
                <input type="file" id="edit-avatar" accept="image/*">
              </div>
            </div>
            <div class="form-error" id="edit-error"></div>
            <div class="modal-actions">
              <button type="button" class="btn-modal-cancel" id="btnCancelEdit">Cancelar</button>
              <button type="submit" class="btn-modal-save">
                <ion-icon name="save-outline"></ion-icon>
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>

    </main>
  `;

  setupNavbarBurger();
  setupNavbarAuthActions();
  setupNavbarSectionLinks();
  setupProfileNavbar();
  setupProfileActions(user);
}

// ─── Setup actions ────────────────────────────────────────────────────────────

function setupProfileNavbar() {
  const logoLink = document.querySelector('.navbar-brand');
  if (logoLink) {
    logoLink.addEventListener('click', async (e) => {
      e.preventDefault();
      document.body.classList.remove('profile-page');
      const { HomePage } = await import('./home.js');
      HomePage();
    });
  }
  // Home nav links
  const btnLogin = document.getElementById('btnLogin');
  const btnSignup = document.getElementById('btnSignup');
  const goLogin = async () => {
    document.body.classList.remove('profile-page');
    const { LoginPage } = await import('./login.js');
    LoginPage();
  };
  btnLogin?.addEventListener('click', goLogin);
  btnSignup?.addEventListener('click', goLogin);
}

function setupProfileActions(user) {
  // Logout
  document.getElementById('btnLogout')?.addEventListener('click', () => {
    document.body.classList.remove('profile-page');
    logout();
  });

  // Open edit modal
  const modal = document.getElementById('editModal');
  document.getElementById('btnEditProfile')?.addEventListener('click', () => {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  });
  document
    .getElementById('btnCloseModal')
    ?.addEventListener('click', closeModal);
  document
    .getElementById('btnCancelEdit')
    ?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Edit form submit
  document
    .getElementById('editProfileForm')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleEditProfile();
    });
}

function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function closeModal() {
  const modal = document.getElementById('editModal');
  if (modal) modal.hidden = true;
  document.body.style.overflow = '';
}

async function handleEditProfile() {
  const firstNameEl = document.getElementById('edit-firstname');
  const lastNameEl = document.getElementById('edit-lastname');
  const phoneEl = document.getElementById('edit-phone');
  const bioEl = document.getElementById('edit-bio');
  const avatarEl = document.getElementById('edit-avatar');
  const errorEl = document.getElementById('edit-error');
  const saveBtn = document.querySelector('.btn-modal-save');
  const userId =
    getCurrentUser()?.id || getCurrentUser()?.user_id || getCurrentUserId();

  const first_name = firstNameEl?.value.trim();
  const last_name = lastNameEl?.value.trim();
  const phone = phoneEl?.value.trim();
  const bio = bioEl?.value.trim();
  const avatarFile = avatarEl?.files?.[0] || null;

  if (!first_name || !last_name) {
    errorEl.textContent = 'El nombre y el apellido son obligatorios.';
    errorEl.style.display = 'block';
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = 'Guardando…';
  errorEl.style.display = 'none';

  try {
    if (!userId) {
      throw new Error('No se encontró user_id para actualizar el perfil.');
    }

    const updated = await updateUserByIdFormData(
      userId,
      {
        first_name,
        last_name,
        bio,
        phone,
      },
      avatarFile
    );

    const freshUser = normalizeUserResponse(getProfilePayload(updated));
    localStorage.setItem('userData', JSON.stringify(freshUser));
    const updatedStats = await getProfileStats(freshUser);
    closeModal();
    // Re-render with updated data
    const app = document.getElementById('app');
    renderProfile(app, freshUser, updatedStats);
  } catch (err) {
    errorEl.textContent =
      err.message || 'No se pudo guardar. Inténtalo de nuevo.';
    errorEl.style.display = 'block';
    saveBtn.disabled = false;
    saveBtn.innerHTML =
      '<ion-icon name="save-outline"></ion-icon> Guardar cambios';
  }
}

function normalizeUserResponse(payload = {}) {
  return {
    ...payload,
    id: payload.id ?? payload.user_id,
    user_id: payload.user_id ?? payload.id,
    first_name:
      payload.first_name ??
      payload.nombre ??
      payload.firstName ??
      payload.name ??
      '',
    last_name: payload.last_name ?? '',
    email: payload.email ?? '',
    phone: payload.phone ?? payload.telefono ?? payload.mobile ?? null,
    bio: payload.bio ?? payload.about_me ?? '',
    about_me: payload.about_me ?? payload.bio ?? '',
    avatar_url:
      payload.avatar_url ??
      payload.avatar ??
      payload.foto_url ??
      payload.photo_url ??
      payload.image_url ??
      '',
    learn_skills:
      payload.learn_skills ??
      payload.learning_skills ??
      payload.skills_to_learn ??
      [],
    teach_skills:
      payload.teach_skills ??
      payload.teaching_skills ??
      payload.skills_to_teach ??
      payload.skills ??
      [],
  };
}

function getProfilePayload(payload = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {};
  }

  return (
    payload.user ||
    payload.profile ||
    payload.data?.user ||
    payload.data ||
    payload
  );
}

function createEmptyProfileStats() {
  return {
    offeredSkills: 0,
    sessions: 0,
  };
}

async function getProfileStats(user = {}) {
  const teachSkills = getSkillList(user, 'teach');
  const offeredSkills = countUniqueSkills(teachSkills);

  try {
    const matchesPayload = await getMatches();
    const matches = normalizeMatchesPayload(matchesPayload);
    const matchesWithRoom = matches.filter((match) => {
      return hasValidRoomId(match?.room_id ?? match?.roomId ?? match?.chat_room_id);
    });
    const sessions = matchesWithRoom.length > 0 ? matchesWithRoom.length : matches.length;

    return {
      offeredSkills,
      sessions,
    };
  } catch {
    return {
      offeredSkills,
      sessions: 0,
    };
  }
}

function countUniqueSkills(skills = []) {
  if (!Array.isArray(skills) || skills.length === 0) return 0;

  const uniqueSkills = new Set(
    skills
      .map((skill) => String(skill || '').trim().toLowerCase())
      .filter(Boolean)
  );

  return uniqueSkills.size;
}

function normalizeMatchesPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.matches)) return payload.matches;
  if (Array.isArray(payload?.data?.matches)) return payload.data.matches;
  return [];
}

function hasValidRoomId(roomId) {
  return roomId !== undefined && roomId !== null && String(roomId).trim() !== '';
}

function getSkillList(user = {}, type = 'teach') {
  const source =
    type === 'teach'
      ? user.teach_skills || user.skills_to_teach || user.teaching_skills || []
      : user.learn_skills || user.skills_to_learn || user.learning_skills || [];

  if (!Array.isArray(source)) return [];

  return source
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') {
        return (
          item.name ||
          item.skill ||
          item.title ||
          item.label ||
          item.value ||
          ''
        )
          .toString()
          .trim();
      }
      return '';
    })
    .filter(Boolean);
}

function renderSkills(skills = [], type = 'teach') {
  if (!skills.length) {
    const emptyClass =
      type === 'learn'
        ? 'skill-tag--empty skill-tag--want'
        : 'skill-tag--empty';
    return `
      <span class="skill-tag ${emptyClass}">
        <ion-icon name="add-circle-outline"></ion-icon>
        Agregar una habilidad
      </span>
    `;
  }

  return skills
    .map(
      (skill) => `
        <span class="skill-tag ${type === 'learn' ? 'skill-tag--want' : ''}">${escapeHtml(skill)}</span>
      `
    )
    .join('');
}
