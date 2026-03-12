/**
 * Profile Page Component
 * Displays the authenticated user's profile
 */

import {
  getNavbar,
  setupNavbarAuthActions,
  setupNavbarBurger,
} from '../components/navbar.js';
import { getCurrentUser, getUserInitials, logout } from '../utils/auth.js';
import { getUserProfile, updateUserProfile } from '../services/api.js';

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

  document.body.classList.remove('auth-page', 'register-mode');
  document.body.classList.add('profile-page');
  window.scrollTo({ top: 0, behavior: 'auto' });

  // Show skeleton while loading
  app.innerHTML = `
    ${getNavbar(false)}
    <main class="profile-main">
      <div class="profile-loading">
        <div class="spinner"></div>
        <p>Loading your profile…</p>
      </div>
    </main>
  `;

  setupNavbarBurger();
  setupNavbarAuthActions();
  setupProfileNavbar();

  // Fetch fresh data from API, fallback to cached
  let user = null;
  try {
    user = await getUserProfile();
    // Update local cache with fresh data
    localStorage.setItem('userData', JSON.stringify(user));
  } catch {
    user = getCurrentUser();
  }

  if (!user) {
    // Not logged in — send to login
    document.body.classList.remove('profile-page');
    const { LoginPage } = await import('./login.js');
    LoginPage();
    return;
  }

  renderProfile(app, user);
}

// ─── Render ──────────────────────────────────────────────────────────────────

function renderProfile(app, user) {
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
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently joined';

  app.innerHTML = `
    ${getNavbar(false)}

    <main class="profile-main">

      <!-- Hero Section -->
      <section class="profile-hero">
        <div class="profile-hero-bg"></div>
        <div class="profile-hero-content">

          <!-- Avatar -->
          <div class="profile-avatar">
            <span class="profile-avatar-initials">${initials}</span>
            <div class="profile-avatar-ring"></div>
          </div>

          <div class="profile-hero-info">
            <h1 class="profile-name">${fullName || 'Learning Swapper'}</h1>
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
              Member since ${memberSince}
            </p>
          </div>

          <div class="profile-hero-actions">
            <button class="btn-profile-edit" id="btnEditProfile">
              <ion-icon name="create-outline"></ion-icon>
              Edit Profile
            </button>
            <button class="btn-profile-logout" id="btnLogout">
              <ion-icon name="log-out-outline"></ion-icon>
              Log Out
            </button>
          </div>
        </div>
      </section>

      <!-- Stats Bar -->
      <section class="profile-stats">
        <div class="stat-card">
          <span class="stat-number">0</span>
          <span class="stat-label">Skills Offered</span>
          <ion-icon name="school-outline"></ion-icon>
        </div>
        <div class="stat-card">
          <span class="stat-number">0</span>
          <span class="stat-label">Sessions Done</span>
          <ion-icon name="swap-horizontal-outline"></ion-icon>
        </div>
        <div class="stat-card">
          <span class="stat-number">0</span>
          <span class="stat-label">People Helped</span>
          <ion-icon name="people-outline"></ion-icon>
        </div>
        <div class="stat-card">
          <span class="stat-number">0</span>
          <span class="stat-label">Points Earned</span>
          <ion-icon name="star-outline"></ion-icon>
        </div>
      </section>

      <!-- Content Grid -->
      <section class="profile-grid">

        <!-- About Card -->
        <div class="profile-card" id="aboutCard">
          <div class="profile-card-header">
            <ion-icon name="person-circle-outline"></ion-icon>
            <h3>About Me</h3>
          </div>
          <div class="profile-card-body" id="aboutBody">
            ${
              bio
                ? `<p class="profile-about-text">${safeBio}</p>`
                : `<p class="profile-placeholder">
              <ion-icon name="sparkles-outline"></ion-icon>
              No bio yet — tell the community who you are!
            </p>`
            }
          </div>
          <button class="card-action-btn" id="btnEditAbout">
            <ion-icon name="${bio ? 'create-outline' : 'add-outline'}"></ion-icon> ${bio ? 'Edit bio' : 'Add bio'}
          </button>
        </div>

        <!-- Skills Offered Card -->
        <div class="profile-card">
          <div class="profile-card-header">
            <ion-icon name="bulb-outline"></ion-icon>
            <h3>Skills I Can Teach</h3>
          </div>
          <div class="profile-card-body">
            <div class="skills-grid" id="skillsOffered">
              <span class="skill-tag skill-tag--empty">
                <ion-icon name="add-circle-outline"></ion-icon>
                Add a skill
              </span>
            </div>
          </div>
        </div>

        <!-- Skills Wanted Card -->
        <div class="profile-card">
          <div class="profile-card-header">
            <ion-icon name="telescope-outline"></ion-icon>
            <h3>Skills I Want to Learn</h3>
          </div>
          <div class="profile-card-body">
            <div class="skills-grid" id="skillsWanted">
              <span class="skill-tag skill-tag--empty skill-tag--want">
                <ion-icon name="add-circle-outline"></ion-icon>
                Add a skill
              </span>
            </div>
          </div>
        </div>

        <!-- Account Info Card -->
        <div class="profile-card">
          <div class="profile-card-header">
            <ion-icon name="shield-checkmark-outline"></ion-icon>
            <h3>Account Info</h3>
          </div>
          <div class="profile-card-body account-info">
            <div class="info-row">
              <span class="info-label">Name</span>
              <span class="info-value">${fullName || '—'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">${user.email || '—'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone</span>
              <span class="info-value">${user.phone || '—'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status</span>
              <span class="info-value info-badge">
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                Active
              </span>
            </div>
          </div>
        </div>

      </section>

      <!-- Edit Profile Modal -->
      <div class="modal-overlay" id="editModal" hidden>
        <div class="modal">
          <div class="modal-header">
            <h3>Edit Profile</h3>
            <button class="modal-close" id="btnCloseModal">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          <form class="modal-form" id="editProfileForm">
            <div class="modal-input-group">
              <label>First Name</label>
              <div class="modal-input">
                <ion-icon name="person-outline"></ion-icon>
                <input type="text" id="edit-firstname" value="${user.first_name || user.name || ''}" placeholder="First Name" required>
              </div>
            </div>
            <div class="modal-input-group">
              <label>Last Name</label>
              <div class="modal-input">
                <ion-icon name="person-outline"></ion-icon>
                <input type="text" id="edit-lastname" value="${user.last_name || ''}" placeholder="Last Name" required>
              </div>
            </div>
            <div class="modal-input-group">
              <label>Phone</label>
              <div class="modal-input">
                <ion-icon name="call-outline"></ion-icon>
                <input type="tel" id="edit-phone" value="${user.phone || ''}" placeholder="Phone number">
              </div>
            </div>
            <div class="form-error" id="edit-error"></div>
            <div class="modal-actions">
              <button type="button" class="btn-modal-cancel" id="btnCancelEdit">Cancel</button>
              <button type="submit" class="btn-modal-save">
                <ion-icon name="save-outline"></ion-icon>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

    </main>
  `;

  setupNavbarBurger();
  setupNavbarAuthActions();
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

  setupAboutActions(user);
}

function setupAboutActions(user) {
  const btnEditAbout = document.getElementById('btnEditAbout');
  const aboutBody = document.getElementById('aboutBody');
  if (!btnEditAbout || !aboutBody) return;

  const renderEditor = (currentBio = '') => {
    const escapedBio = escapeHtml(currentBio);
    aboutBody.innerHTML = `
      <div class="about-editor">
        <label class="about-editor-label" for="aboutBioInput">About me</label>
        <textarea id="aboutBioInput" class="about-editor-textarea" rows="4" maxlength="350" placeholder="Tell the community who you are...">${escapedBio}</textarea>
        <div class="about-editor-actions">
          <button type="button" class="about-editor-btn about-editor-btn--cancel" id="btnCancelAbout">Cancel</button>
          <button type="button" class="about-editor-btn about-editor-btn--save" id="btnSaveAbout">Save</button>
        </div>
        <p class="about-editor-error" id="aboutEditorError"></p>
      </div>
    `;

    btnEditAbout.hidden = true;

    const bioInput = document.getElementById('aboutBioInput');
    const saveBtn = document.getElementById('btnSaveAbout');
    const cancelBtn = document.getElementById('btnCancelAbout');
    const errorEl = document.getElementById('aboutEditorError');

    bioInput?.focus();

    cancelBtn?.addEventListener('click', () => {
      const app = document.getElementById('app');
      renderProfile(app, user);
    });

    saveBtn?.addEventListener('click', async () => {
      const normalizedBio = bioInput?.value.trim() || '';
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
      errorEl.textContent = '';

      try {
        const updated = await updateUserProfile({
          bio: normalizedBio,
          about_me: normalizedBio,
        });

        const freshUser = {
          ...user,
          ...(updated.user || updated),
        };

        if (normalizedBio) {
          freshUser.bio = normalizedBio;
          freshUser.about_me = normalizedBio;
        } else {
          delete freshUser.bio;
          delete freshUser.about_me;
        }

        localStorage.setItem('userData', JSON.stringify(freshUser));

        const app = document.getElementById('app');
        renderProfile(app, freshUser);
      } catch (err) {
        errorEl.textContent =
          err.message || 'Could not save your bio. Please try again.';
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
      }
    });
  };

  btnEditAbout.addEventListener('click', () => {
    const currentBio = (user.bio || user.about_me || '').trim();
    renderEditor(currentBio);
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
  const errorEl = document.getElementById('edit-error');
  const saveBtn = document.querySelector('.btn-modal-save');

  const first_name = firstNameEl?.value.trim();
  const last_name = lastNameEl?.value.trim();
  const phone = phoneEl?.value.trim();

  if (!first_name || !last_name) {
    errorEl.textContent = 'First and last name are required.';
    errorEl.style.display = 'block';
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving…';
  errorEl.style.display = 'none';

  try {
    const updated = await updateUserProfile({ first_name, last_name, phone });
    const freshUser = updated.user || updated;
    localStorage.setItem('userData', JSON.stringify(freshUser));
    closeModal();
    // Re-render with updated data
    const app = document.getElementById('app');
    renderProfile(app, freshUser);
  } catch (err) {
    errorEl.textContent = err.message || 'Failed to save. Try again.';
    errorEl.style.display = 'block';
    saveBtn.disabled = false;
    saveBtn.innerHTML =
      '<ion-icon name="save-outline"></ion-icon> Save Changes';
  }
}
