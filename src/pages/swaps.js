import {
  getFeed,
  getMatches,
  getMessages,
  getUserById,
  sendSwipe,
} from '../services/api.js';
import { getCurrentUser, getCurrentUserId, isAuthenticated } from '../utils/auth.js';

const DEFAULT_MATCH_AVATAR = '/assets/users-cards-icons/user2.jpg';
const MAX_CHAT_NOTIFICATIONS = 20;
const CHAT_NOTIFICATION_STORE = {
  items: [],
  unreadCount: 0,
  nextId: 1,
};

const WEBRTC_ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];
const WEBRTC_MEDIA_CONSTRAINTS = {
  video: true,
  audio: true,
};

const FEED_CATEGORY_RULES = [
  {
    key: 'programacion',
    title: 'Programacion',
    subtitle: 'Perfiles de desarrollo y tecnologia',
    keywords: [
      'programacion',
      'programar',
      'desarrollo',
      'developer',
      'desarrollador',
      'desarrolladora',
      'frontend',
      'backend',
      'fullstack',
      'full stack',
      'javascript',
      'js',
      'typescript',
      'ts',
      'python',
      'java',
      'golang',
      'go',
      'node',
      'nodejs',
      'react',
      'vue',
      'angular',
      'api',
      'rest',
      'graphql',
      'sql',
      'mongodb',
      'postgres',
      'postgresql',
      'mysql',
      'firebase',
      'docker',
      'kubernetes',
      'devops',
      'ci/cd',
      'c#',
      'c++',
      'dotnet',
      '.net',
      'php',
      'ruby',
      'swift',
      'kotlin',
      'flask',
      'django',
      'laravel',
      'spring',
      'algoritmos',
      'estructura de datos',
      'software',
    ],
  },
  {
    key: 'idiomas',
    title: 'Idiomas',
    subtitle: 'Perfiles para intercambio de idiomas',
    keywords: [
      'idioma',
      'idiomas',
      'language',
      'languages',
      'ingles',
      'english',
      'frances',
      'french',
      'portugues',
      'portuguese',
      'espanol',
      'spanish',
      'aleman',
      'german',
      'italiano',
      'italian',
      'chino',
      'chinese',
      'mandarin',
      'japones',
      'japanese',
      'ruso',
      'russian',
      'coreano',
      'korean',
      'traduccion',
      'translation',
      'pronunciacion',
      'gramatica',
      'conversation',
      'conversacion',
    ],
  },
  {
    key: 'diseno',
    title: 'Diseno',
    subtitle: 'Perfiles creativos y visuales',
    keywords: [
      'diseno',
      'design',
      'graphic design',
      'diseno grafico',
      'ux',
      'ui',
      'ux/ui',
      'figma',
      'photoshop',
      'illustrator',
      'after effects',
      'premiere',
      'canva',
      'branding',
      'creatividad',
      'animacion',
      '3d',
      'motion',
      'prototipo',
      'wireframe',
      'product design',
    ],
  },
  {
    key: 'negocios',
    title: 'Negocios y Productividad',
    subtitle: 'Perfiles de liderazgo, gestion y crecimiento',
    keywords: [
      'negocio',
      'negocios',
      'business',
      'marketing',
      'marketing digital',
      'ventas',
      'sales',
      'liderazgo',
      'management',
      'gestion',
      'finanzas',
      'finance',
      'emprendimiento',
      'startup',
      'productividad',
      'comunicacion',
      'scrum',
      'agile',
      'project management',
      'product manager',
      'negociacion',
      'oratoria',
      'excel',
      'power bi',
    ],
  },
  {
    key: 'otros',
    title: 'Otras habilidades',
    subtitle: 'Perfiles con intereses diversos',
    keywords: [],
  },
];

export async function SwapsPage(view = 'matches') {
  const app = document.getElementById('app');

  if (!isAuthenticated()) {
    const { HomePage } = await import('./home.js');
    HomePage();
    return;
  }

  cleanupSwapView();

  document.body.classList.remove('auth-page', 'register-mode', 'profile-page');
  document.body.classList.add('swaps-page');
  document.body.style.overflow = '';
  window.scrollTo({ top: 0, behavior: 'auto' });

  const user = getCurrentUser();
  const currentUserId = getCurrentUserId();
  const isChatsView = view === 'chats';
  const profileLabel = user?.first_name || user?.name || 'Learning Swap';

  window.history.replaceState(null, '', isChatsView ? '#chats' : '#swaps');

  app.innerHTML = `
    <main class="swaps-dashboard">
      <div class="dashboard-container">
        <aside class="sidebar">
          <button class="logo logo-button" type="button" data-nav-home aria-label="Ir al inicio">
            <img class="logo-dashboard" src="/assets/logos/logo.png" alt="logo learning swap" />
            <h2>Learning Swap</h2>
          </button>

          <nav class="nav-menu" aria-label="Navegación de Swap">
            <ul>
              <li>
                <button class="nav-menu-link" type="button" data-nav-home>
                  <ion-icon name="home-outline"></ion-icon>
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button class="nav-menu-link" type="button" data-nav-profile>
                  <ion-icon name="person-circle-outline"></ion-icon>
                  <span>Profile</span>
                </button>
              </li>
              <li>
                <button
                  class="nav-menu-link ${isChatsView ? 'is-active' : ''}"
                  type="button"
                  data-nav-chats
                  ${isChatsView ? 'aria-current="page"' : ''}
                >
                  <ion-icon name="chatbubbles-outline"></ion-icon>
                  <span>Chats</span>
                </button>
              </li>
              <li>
                <button
                  class="nav-menu-link ${!isChatsView ? 'is-active' : ''}"
                  type="button"
                  data-nav-matches
                  ${!isChatsView ? 'aria-current="page"' : ''}
                >
                  <ion-icon name="people-circle-outline"></ion-icon>
                  <span>Matches</span>
                </button>
              </li>
              <li>
  <button class="nav-menu-link" type="button" data-nav-memberships>
    <ion-icon name="diamond-outline"></ion-icon>
    <span>Membresías</span>
  </button>
</li>
            </ul>
          </nav>

          <div class="card-information">
            <p>learning swap information</p>
            <p>
              Bienvenido/a al tablero principal de Learning Swap, aca podras
              descubrir a personas destacadas en lo que aman y podras compartir
              con ellas conocimientos y mucho mas.
            </p>
            <p>no esperes mas para empezar a conectarte con los demas.</p>
          </div>
        </aside>

        <section class="main-content">
          <header class="top-bar">
            <label class="search-bar" aria-label="search bar">
              <ion-icon name="search-outline"></ion-icon>
              <input type="text" placeholder="search..." />
            </label>

            <div class="user-actions">
              <span class="membership" aria-hidden="true"></span>
              <button class="icon-action" type="button" aria-label="Idioma">
                <ion-icon name="earth-outline"></ion-icon>
              </button>
              <button
                class="icon-action notifications-btn"
                type="button"
                data-notifications-toggle
                aria-label="Notificaciones"
                aria-expanded="false"
                aria-controls="notifications-panel"
              >
                <ion-icon name="notifications-outline"></ion-icon>
                <span class="notifications-badge" data-notifications-badge hidden>
                  0
                </span>
              </button>
              <button class="icon-action" type="button" data-nav-profile aria-label="Ir al perfil">
                <ion-icon name="person-circle-outline"></ion-icon>
              </button>
              <span class="user-chip">${escapeHtml(profileLabel)}</span>
            </div>

            <section
              id="notifications-panel"
              class="notifications-panel"
              aria-label="Notificaciones recientes"
              hidden
            >
              <header class="notifications-panel-header">
                <h3>Notificaciones</h3>
              </header>
              <p id="notifications-empty" class="notifications-empty-state">
                Aún no tienes mensajes nuevos.
              </p>
              <ul id="notifications-list" class="notifications-list"></ul>
            </section>
          </header>

          <section class="dashboard-body">
            <div class="content-left">
              <div class="welcome-banner">
                <div>
                  <h2>
                    ${
                      isChatsView
                        ? '¡Hola!, bienvenido a tus conversaciones'
                        : '¡Hola!, bienvenido al tablero de matches'
                    }
                  </h2>
                  <p>
                    ${
                      isChatsView
                        ? `Bienvenido ${escapeHtml(profileLabel)}, aquí podrás continuar tus conversaciones y abrir nuevas salas de chat con tus matches.`
                        : `Bienvenido ${escapeHtml(profileLabel)}, aquí podrás descubrir personas y experiencias maravillosas haciendo match entre ellas. Tus conversaciones estarán siempre en la vista de chats.`
                    }
                  </p>
                </div>
                <button type="button" ${isChatsView ? 'data-nav-prices' : 'data-nav-chats'}>
                  ${isChatsView ? 'Planes' : 'Ir a chats'}
                </button>
              </div>

              ${
                isChatsView
                  ? `<section class="matches-chat-section" aria-label="Mis matches y chat">
                      <div class="matches-panel">
                        <div class="matches-panel-header">
                          <h3>Conversaciones</h3>
                          <button id="btn-refresh-matches" class="matches-refresh-btn" type="button">
                            Actualizar
                          </button>
                        </div>
                        <p class="matches-panel-helper">
                          Selecciona un chat para cargar historial y recibir mensajes nuevos en tiempo real.
                        </p>
                        <div id="matches-status" class="matches-status is-muted" role="status"></div>
                        <div id="matches-list" class="matches-list" aria-live="polite"></div>
                      </div>

                      <div id="chat-empty" class="chat-empty-state">
                        <h3>Selecciona un match</h3>
                        <p>
                          El historial de la sala y los mensajes nuevos aparecerán aquí.
                        </p>
                      </div>

                      <section id="chat-container" class="chat-panel" hidden aria-label="Ventana de chat">
                        <header class="chat-panel-header">
                          <div>
                            <h3 id="chat-header">Chat</h3>
                            <p id="chat-room-helper">Selecciona una conversación para empezar.</p>
                          </div>
                          <div class="chat-panel-actions">
                            <button id="chat-call-btn" type="button" class="chat-call-btn">
                              Llamar
                            </button>
                            <button id="chat-hangup-btn" type="button" class="chat-hangup-btn" hidden>
                              Colgar llamada
                            </button>
                            <button id="chat-close-btn" type="button" class="chat-close-btn">
                              Cerrar
                            </button>
                            <button id="chat-finish-btn" type="button" class="chat-finish-btn">
                              Cerrar swap
                            </button>
                          </div>
                        </header>

                        <section id="call-panel" class="call-panel" hidden aria-label="Panel de videollamada">
                          <div class="call-videos-grid">
                            <article class="call-video-card">
                              <video id="remote-video" autoplay playsinline></video>
                              <p>Participante</p>
                            </article>

                            <article class="call-video-card call-video-card--local">
                              <video id="local-video" autoplay playsinline muted></video>
                              <p>Tú</p>
                            </article>
                          </div>
                          <p id="call-status" class="call-status is-muted">Listo para iniciar llamada.</p>
                        </section>

                        <div id="chat-messages" class="chat-messages" aria-live="polite"></div>

                        <form id="chat-form" class="chat-input-row">
                          <input
                            id="chat-input"
                            type="text"
                            placeholder="Escribe tu mensaje..."
                            maxlength="800"
                            autocomplete="off"
                          />
                          <button id="btn-enviar" type="submit">Enviar</button>
                        </form>
                      </section>
                    </section>`
                  : `<section class="chat-shortcut-panel" aria-label="Acceso a chats">
                      <h3>Tus chats están en una vista dedicada</h3>
                      <p>
                        Para mantener el tablero de swaps limpio, las conversaciones se gestionan ahora en la sección de chats.
                      </p>
                      <button class="matches-refresh-btn" type="button" data-nav-chats>
                        Abrir chats
                      </button>
                    </section>`
              }
            </div>
          </section>

          ${
            isChatsView
              ? ''
              : `
                <section class="users-grid-section users-grid-section--feed-board">
                  <div class="section-header section-header--feed">
                    <div class="section-header-copy">
                      <h2>Perfiles sugeridos</h2>
                      <h3>Carruseles filtrados por categoria</h3>
                    </div>
                    <button id="btn-refresh-feed" class="matches-refresh-btn" type="button">
                      Actualizar feed
                    </button>
                  </div>

                  <div id="feed-status" class="matches-status feed-carousel-status is-muted" role="status"></div>
                  <div id="feed-categories-root" class="feed-categories-root">
                    ${renderFeedLoadingState()}
                  </div>
                </section>
              `
          }

          <div
            id="notifications-toast-stack"
            class="notifications-toast-stack"
            aria-live="polite"
          ></div>
        </section>
      </div>
    </main>
  `;

  window.__swapsCleanup = setupSwapsInteractions(currentUserId, {
    isChatsView,
  });
}

function cleanupSwapView() {
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
}

function renderFeedLoadingState() {
  return `
    <article class="nft-card nft-card--feed-state">
      <p class="feed-card-empty-text">Cargando perfiles sugeridos...</p>
    </article>
  `;
}

function renderFeedEmptyState() {
  return `
    <article class="nft-card nft-card--feed-state">
      <p class="feed-card-empty-text">
        No hay perfiles disponibles en tu feed por ahora.
      </p>
    </article>
  `;
}

function renderFeedCategoryCarousel(category, index) {
  const carouselId = `feed-${escapeHtml(category.key)}-${index}`;
  const cardsMarkup = category.profiles.map((profile) => renderFeedSwipeCard(profile)).join('');

  return `
    <section class="users-grid-section users-grid-section--feed-category">
      <div class="section-header">
        <div class="section-header-copy">
          <h3>${escapeHtml(category.title)}</h3>
          <p class="feed-category-subtitle">${escapeHtml(category.subtitle)}</p>
        </div>
      </div>

      <div class="carousel" data-carousel="${carouselId}">
        <button
          class="prev"
          type="button"
          aria-label="Ver perfiles anteriores de ${escapeHtml(category.title)}"
        >
          ‹
        </button>

        <div class="carousel-container">
          <div class="card-wrapper">
            ${cardsMarkup}
          </div>
        </div>

        <button
          class="next"
          type="button"
          aria-label="Ver perfiles siguientes de ${escapeHtml(category.title)}"
        >
          ›
        </button>
      </div>
    </section>
  `;
}

function renderFeedSwipeCard(profile = {}) {
  const profileId = getFeedProfileId(profile);
  const fullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  const avatarUrl = getMatchAvatar(profile);
  const bioText = String(profile?.bio || '').trim() || 'Sin bio registrada todavía.';
  const learnSkills = normalizeSkillList(
    profile?.skills_to_learn || profile?.learn_skills
  );
  const teachSkills = normalizeSkillList(
    profile?.skills_to_teach || profile?.teach_skills
  );

  const learnText = learnSkills.length ? learnSkills.join(', ') : 'Por definir';
  const teachText = teachSkills.length ? teachSkills.join(', ') : 'Por definir';

  return `
    <article class="nft-card nft-card--swipe" data-feed-card-id="${escapeHtml(profileId || '')}">
      <div class="main-image">
        <img
          class="feed-card-avatar"
          data-feed-avatar-id="${escapeHtml(profileId || '')}"
          src="${escapeHtml(avatarUrl)}"
          alt="Perfil de ${escapeHtml(fullName || 'usuario')}"
        />
        <span class="badge">Descubrir</span>
      </div>

      <div class="card-body">
        <h3>${escapeHtml(fullName || `Usuario #${profileId || 'sin id'}`)}</h3>
        <p class="feed-card-bio">${escapeHtml(bioText)}</p>
        <p class="feed-card-skills">Aprende: ${escapeHtml(learnText)}</p>
        <p class="feed-card-skills">Enseña: ${escapeHtml(teachText)}</p>
      </div>

      <div class="card-footer feed-card-footer">
        <button
          class="swipe-btn swipe-btn-pass feed-swipe-btn"
          type="button"
          data-action="pass"
          data-user-id="${escapeHtml(profileId || '')}"
          ${profileId ? '' : 'disabled'}
        >
          Pass
        </button>
        <button
          class="swipe-btn swipe-btn-like feed-swipe-btn"
          type="button"
          data-action="like"
          data-user-id="${escapeHtml(profileId || '')}"
          ${profileId ? '' : 'disabled'}
        >
          Like
        </button>
      </div>
    </article>
  `;
}

function renderFeedCategoryBoard(profiles = []) {
  const categories = groupFeedProfilesByCategory(profiles);
  if (categories.length === 0) {
    return renderFeedEmptyState();
  }

  return categories
    .map((category, index) => renderFeedCategoryCarousel(category, index))
    .join('');
}

function groupFeedProfilesByCategory(profiles = []) {
  const groupsMap = new Map();
  const fallbackRule = FEED_CATEGORY_RULES.find((rule) => rule.key === 'otros') || {
    key: 'otros',
    title: 'Otras habilidades',
    subtitle: 'Perfiles con intereses diversos',
    keywords: [],
  };

  FEED_CATEGORY_RULES.forEach((rule) => {
    if (rule.key === fallbackRule.key) return;
    groupsMap.set(rule.key, {
      ...rule,
      profiles: [],
    });
  });

  const fallbackGroup = {
    ...fallbackRule,
    profiles: [],
  };

  profiles.forEach((profile) => {
    const categoryKey = resolveFeedCategoryKey(profile);
    if (categoryKey === fallbackGroup.key) {
      fallbackGroup.profiles.push(profile);
      return;
    }

    const group = groupsMap.get(categoryKey);
    if (group) {
      group.profiles.push(profile);
      return;
    }

    fallbackGroup.profiles.push(profile);
  });

  return [...groupsMap.values(), fallbackGroup].filter(
    (group) => group.profiles.length > 0
  );
}

function resolveFeedCategoryKey(profile = {}) {
  const normalizedHints = collectProfileCategoryHints(profile)
    .map((hint) => normalizeFeedCategoryText(hint))
    .filter(Boolean);

  if (normalizedHints.length === 0) {
    return 'otros';
  }

  const directCategoryHint = normalizeFeedCategoryText(
    profile?.category || profile?.interest || ''
  );

  const candidateScores = [];

  for (const rule of FEED_CATEGORY_RULES) {
    if (rule.key === 'otros') continue;

    const score = computeCategoryScore(rule, normalizedHints, directCategoryHint);
    if (score > 0) {
      candidateScores.push({ key: rule.key, score });
    }
  }

  if (candidateScores.length === 0) {
    return 'otros';
  }

  candidateScores.sort((a, b) => b.score - a.score);
  return candidateScores[0].key;
}

function computeCategoryScore(rule, normalizedHints, directCategoryHint) {
  const normalizedKeywords = (rule.keywords || [])
    .map((keyword) => normalizeFeedCategoryText(keyword))
    .filter(Boolean);

  if (normalizedKeywords.length === 0) return 0;

  let score = 0;

  normalizedHints.forEach((hint) => {
    normalizedKeywords.forEach((keyword) => {
      if (hint === keyword) {
        score += 4;
      } else if (hint.includes(keyword)) {
        score += 2;
      }
    });
  });

  if (directCategoryHint) {
    if (directCategoryHint === normalizeFeedCategoryText(rule.key)) {
      score += 8;
    }

    if (directCategoryHint.includes(normalizeFeedCategoryText(rule.title))) {
      score += 5;
    }

    normalizedKeywords.forEach((keyword) => {
      if (directCategoryHint.includes(keyword)) {
        score += 3;
      }
    });
  }

  return score;
}

function collectProfileCategoryHints(profile = {}) {
  const teachSkills = normalizeSkillList(
    profile?.skills_to_teach || profile?.teach_skills,
    { limit: 30 }
  );
  const learnSkills = normalizeSkillList(
    profile?.skills_to_learn || profile?.learn_skills,
    { limit: 30 }
  );

  const extraHints = [
    profile?.interest,
    profile?.category,
    profile?.primary_skill,
    profile?.headline,
    profile?.bio,
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  return [...teachSkills, ...learnSkills, ...extraHints];
}

function normalizeFeedCategoryText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9#+./\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function setupSwapsInteractions(currentUserId, options = {}) {
  const cleanups = [];
  const state = {
    userId: currentUserId ? String(currentUserId) : null,
    socket: null,
    activeRoomId: null,
  };

  const registerNavigation = (selector, hash) => {
    document.querySelectorAll(selector).forEach((element) => {
      const handler = () => {
        window.location.hash = hash;
      };

      element.addEventListener('click', handler);
      cleanups.push(() => {
        element.removeEventListener('click', handler);
      });
    });
  };

  registerNavigation('[data-nav-home]', '#home');
  registerNavigation('[data-nav-profile]', '#profile');
  registerNavigation('[data-nav-matches]', '#swaps');
  registerNavigation('[data-nav-chats]', '#chats');
  registerNavigation('[data-nav-prices]', '#prices');
  registerNavigation('[data-nav-memberships]', '#memberships');

  cleanups.push(
    setupMatchesChat(state, {
      autoOpenFirstMatch: Boolean(options.isChatsView),
    })
  );

  return () => {
    if (state.socket) {
      try {
        state.socket.close();
      } catch {
        // Ignore close errors on cleanup.
      }
      state.socket = null;
    }

    cleanups.forEach((cleanup) => {
      cleanup?.();
    });
  };
}

function setupSwapsCarousels() {
  const cleanups = [];
  const carousels = document.querySelectorAll('.swaps-dashboard .carousel');

  carousels.forEach((carousel) => {
    const container = carousel.querySelector('.carousel-container');
    const wrapper = carousel.querySelector('.card-wrapper');
    const firstCard = wrapper?.querySelector('.nft-card');
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');

    if (!container || !wrapper || !prev || !next) return;

    const getStep = () => {
      const cardWidth =
        firstCard?.getBoundingClientRect().width || container.clientWidth * 0.8;
      const gap = Number.parseFloat(window.getComputedStyle(wrapper).gap || '0');
      return cardWidth + gap;
    };

    const handlePrev = () => {
      container.scrollBy({
        left: -getStep(),
        behavior: 'smooth',
      });
    };

    const handleNext = () => {
      container.scrollBy({
        left: getStep(),
        behavior: 'smooth',
      });
    };

    prev.addEventListener('click', handlePrev);
    next.addEventListener('click', handleNext);

    cleanups.push(() => {
      prev.removeEventListener('click', handlePrev);
      next.removeEventListener('click', handleNext);
    });
  });

  return () => {
    cleanups.forEach((cleanup) => {
      cleanup();
    });
  };
}

function setupMatchesChat(state, options = {}) {
  const matchesList = document.getElementById('matches-list');
  const matchesStatus = document.getElementById('matches-status');
  const refreshMatchesButton = document.getElementById('btn-refresh-matches');
  const refreshFeedButton = document.getElementById('btn-refresh-feed');
  const feedStatus = document.getElementById('feed-status');
  const feedCategoriesRoot = document.getElementById('feed-categories-root');
  const chatContainer = document.getElementById('chat-container');
  const chatEmptyState = document.getElementById('chat-empty');
  const chatHeader = document.getElementById('chat-header');
  const chatRoomHelper = document.getElementById('chat-room-helper');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const closeChatButton = document.getElementById('chat-close-btn');
  const finishSwapButton = document.getElementById('chat-finish-btn');
  const callPanel = document.getElementById('call-panel');
  const callStatus = document.getElementById('call-status');
  const localVideo = document.getElementById('local-video');
  const remoteVideo = document.getElementById('remote-video');
  const callStartButton = document.getElementById('chat-call-btn');
  const callHangupButton = document.getElementById('chat-hangup-btn');
  const notificationsButton = document.querySelector(
    '[data-notifications-toggle]'
  );
  const notificationsPanel = document.getElementById('notifications-panel');
  const notificationsList = document.getElementById('notifications-list');
  const notificationsEmpty = document.getElementById('notifications-empty');
  const notificationsBadge = document.querySelector(
    '[data-notifications-badge]'
  );
  const notificationsToastStack = document.getElementById(
    'notifications-toast-stack'
  );

  const hasFeedCarousel =
    Boolean(refreshFeedButton) && Boolean(feedStatus) && Boolean(feedCategoriesRoot);
  const hasChatPanel =
    Boolean(matchesList) &&
    Boolean(matchesStatus) &&
    Boolean(refreshMatchesButton) &&
    Boolean(chatContainer) &&
    Boolean(chatEmptyState) &&
    Boolean(chatHeader) &&
    Boolean(chatRoomHelper) &&
    Boolean(chatMessages) &&
    Boolean(chatForm) &&
    Boolean(chatInput) &&
    Boolean(closeChatButton) &&
    Boolean(finishSwapButton);
  const hasCallUI =
    hasChatPanel &&
    Boolean(callPanel) &&
    Boolean(callStatus) &&
    Boolean(localVideo) &&
    Boolean(remoteVideo) &&
    Boolean(callStartButton) &&
    Boolean(callHangupButton);
  const hasNotificationUI =
    Boolean(notificationsButton) &&
    Boolean(notificationsPanel) &&
    Boolean(notificationsList) &&
    Boolean(notificationsEmpty) &&
    Boolean(notificationsBadge) &&
    Boolean(notificationsToastStack);

  if (!hasFeedCarousel && !hasChatPanel && !hasNotificationUI) {
    return () => {};
  }

  const closedSwapsStorageKey = state.userId
    ? `learning-swap:closed-swaps:${state.userId}`
    : 'learning-swap:closed-swaps:guest';
  const closedRoomIds = readClosedSwapRooms(closedSwapsStorageKey);

  const cleanups = [];
  let disposed = false;
  let latestMatchesRequest = 0;
  let latestHistoryRequest = 0;
  let autoOpenDone = false;
  let rowCleanups = [];
  let feedActionCleanups = [];
  let feedCarouselControlsCleanup = () => {};
  let feedQueue = [];
  let swipeInProgress = false;
  let notificationsOpen = false;
  const avatarCache = new Map();
  const callState = {
    roomId: null,
    active: false,
    signalSocket: null,
    signalClosing: false,
    peerConnection: null,
    localStream: null,
    pendingCandidates: [],
    remoteDescriptionReady: false,
  };

  const persistClosedSwaps = () => {
    persistClosedSwapRooms(closedSwapsStorageKey, closedRoomIds);
  };

  const isClosedSwapRoom = (roomId) => {
    if (!roomId) return false;
    return closedRoomIds.has(String(roomId));
  };

  const closeSwapRoom = (roomId) => {
    if (!roomId) return;
    closedRoomIds.add(String(roomId));
    persistClosedSwaps();
  };

  const setMatchesStatus = (text, tone = 'muted') => {
    if (!hasChatPanel) return;

    matchesStatus.textContent = text;
    matchesStatus.classList.remove('is-muted', 'is-success', 'is-error');
    matchesStatus.classList.add(`is-${tone}`);
  };

  const setFeedStatus = (text, tone = 'muted') => {
    if (!hasFeedCarousel) return;

    feedStatus.textContent = text;
    feedStatus.classList.remove('is-muted', 'is-success', 'is-error');
    feedStatus.classList.add(`is-${tone}`);
  };

  const setFeedButtonsDisabled = (disabled) => {
    if (!hasFeedCarousel) return;

    feedCategoriesRoot.querySelectorAll('.feed-swipe-btn').forEach((button) => {
      const hasTarget = Boolean(button.getAttribute('data-user-id'));
      button.disabled = disabled || !hasTarget;
    });
  };

  const setCallPanelVisible = (show) => {
    if (!hasCallUI) return;
    callPanel.hidden = !show;
  };

  const setCallStatus = (text, tone = 'muted') => {
    if (!hasCallUI) return;

    callStatus.textContent = text;
    callStatus.classList.remove('is-muted', 'is-success', 'is-error');
    callStatus.classList.add(`is-${tone}`);
  };

  const setCallButtons = () => {
    if (!hasCallUI) return;

    const hasActiveRoom = Boolean(state.activeRoomId);
    callStartButton.disabled = !hasActiveRoom || callState.active;
    callHangupButton.hidden = !callState.active;
    callHangupButton.disabled = !callState.active;
  };

  const clearVideoElements = () => {
    if (!hasCallUI) return;
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
  };

  const stopLocalStream = () => {
    if (!callState.localStream) return;

    callState.localStream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {
        // Ignore track stop errors on cleanup.
      }
    });

    callState.localStream = null;
  };

  const closePeerConnection = () => {
    if (!callState.peerConnection) return;

    try {
      callState.peerConnection.ontrack = null;
      callState.peerConnection.onicecandidate = null;
      callState.peerConnection.onconnectionstatechange = null;
      callState.peerConnection.close();
    } catch {
      // Ignore close errors.
    }

    callState.peerConnection = null;
    callState.pendingCandidates = [];
    callState.remoteDescriptionReady = false;
  };

  const closeSignalSocket = () => {
    if (!callState.signalSocket) return;

    const activeSocket = callState.signalSocket;
    callState.signalClosing = true;
    callState.signalSocket = null;

    try {
      activeSocket.onmessage = null;
      activeSocket.onopen = null;
      activeSocket.onerror = null;
      activeSocket.onclose = null;
      activeSocket.close();
    } catch {
      // Ignore close errors.
    }
  };

  const sendSignalMessage = (payload = {}) => {
    const socket = callState.signalSocket;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setCallStatus('La señalización no está conectada.', 'error');
      return false;
    }

    try {
      socket.send(JSON.stringify(payload));
      return true;
    } catch {
      setCallStatus('No fue posible enviar señalización.', 'error');
      return false;
    }
  };

  const closeCallSession = ({
    notifyHangUp = false,
    closeSignal = false,
    keepStatus = false,
  } = {}) => {
    if (notifyHangUp && callState.active) {
      sendSignalMessage({ type: 'hang-up' });
    }

    callState.active = false;
    closePeerConnection();
    stopLocalStream();
    clearVideoElements();

    if (closeSignal) {
      closeSignalSocket();
      callState.roomId = null;
    }

    if (!keepStatus) {
      setCallStatus('Llamada finalizada.', 'muted');
    }

    setCallButtons();
  };

  const attachLocalTracks = (peerConnection, stream) => {
    if (!peerConnection || !stream) return;

    const senderKinds = new Set(
      peerConnection
        .getSenders()
        .map((sender) => sender.track?.kind)
        .filter(Boolean)
    );

    stream.getTracks().forEach((track) => {
      if (senderKinds.has(track.kind)) return;
      peerConnection.addTrack(track, stream);
    });
  };

  const createPeerConnection = () => {
    if (callState.peerConnection) {
      return callState.peerConnection;
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: WEBRTC_ICE_SERVERS,
    });

    callState.peerConnection = peerConnection;
    callState.pendingCandidates = [];
    callState.remoteDescriptionReady = false;

    if (callState.localStream) {
      attachLocalTracks(peerConnection, callState.localStream);
    }

    peerConnection.ontrack = (event) => {
      if (!hasCallUI) return;

      const [remoteStream] = event.streams || [];
      if (remoteStream) {
        remoteVideo.srcObject = remoteStream;
      }

      callState.active = true;
      setCallPanelVisible(true);
      setCallStatus('Llamada conectada.', 'success');
      setCallButtons();
    };

    peerConnection.onicecandidate = (event) => {
      if (!event.candidate) return;
      sendSignalMessage({ type: 'candidate', candidate: event.candidate });
    };

    peerConnection.onconnectionstatechange = () => {
      const currentState = peerConnection.connectionState;

      if (currentState === 'connected') {
        callState.active = true;
        setCallStatus('Llamada conectada.', 'success');
      }

      if (currentState === 'failed' || currentState === 'disconnected') {
        setCallStatus('La conexión de la llamada se interrumpió.', 'error');
      }

      if (currentState === 'closed') {
        callState.active = false;
      }

      setCallButtons();
    };

    return peerConnection;
  };

  const flushPendingCandidates = async () => {
    if (!callState.peerConnection || !callState.remoteDescriptionReady) return;

    if (callState.pendingCandidates.length === 0) return;

    const queuedCandidates = [...callState.pendingCandidates];
    callState.pendingCandidates = [];

    for (const candidate of queuedCandidates) {
      try {
        await callState.peerConnection.addIceCandidate(candidate);
      } catch {
        // Ignore invalid queued ICE candidates.
      }
    }
  };

  const ensureLocalStream = async () => {
    if (callState.localStream) {
      return callState.localStream;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      throw new Error('Tu navegador no soporta getUserMedia.');
    }

    const stream = await navigator.mediaDevices.getUserMedia(
      WEBRTC_MEDIA_CONSTRAINTS
    );

    callState.localStream = stream;

    if (hasCallUI) {
      localVideo.srcObject = stream;
      localVideo.muted = true;
      localVideo.volume = 0;
    }

    if (callState.peerConnection) {
      attachLocalTracks(callState.peerConnection, stream);
    }

    return stream;
  };

  const waitForSocketOpen = (socket, timeoutMs = 6000) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('No hay socket de señalización disponible.'));
        return;
      }

      if (socket.readyState === WebSocket.OPEN) {
        resolve(socket);
        return;
      }

      if (socket.readyState !== WebSocket.CONNECTING) {
        reject(new Error('No se pudo abrir el socket de señalización.'));
        return;
      }

      const timeoutId = window.setTimeout(() => {
        cleanup();
        reject(new Error('La señalización tardó demasiado en conectar.'));
      }, timeoutMs);

      const onOpen = () => {
        cleanup();
        resolve(socket);
      };

      const onClose = () => {
        cleanup();
        reject(new Error('La señalización se cerró antes de conectar.'));
      };

      const onError = () => {
        cleanup();
        reject(new Error('La señalización reportó un error.'));
      };

      const cleanup = () => {
        window.clearTimeout(timeoutId);
        socket.removeEventListener('open', onOpen);
        socket.removeEventListener('close', onClose);
        socket.removeEventListener('error', onError);
      };

      socket.addEventListener('open', onOpen);
      socket.addEventListener('close', onClose);
      socket.addEventListener('error', onError);
    });
  };

  const handleSignalMessage = async (data = {}) => {
    if (!hasCallUI || !data || typeof data !== 'object') return;

    const signalType = String(data.type || '').trim().toLowerCase();
    if (!signalType) return;

    try {
      if (signalType === 'offer' && data.sdp) {
        setCallPanelVisible(true);
        setCallStatus('Recibiendo llamada...', 'muted');

        await ensureLocalStream();
        const peerConnection = createPeerConnection();

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.sdp)
        );

        callState.remoteDescriptionReady = true;
        await flushPendingCandidates();

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        sendSignalMessage({ type: 'answer', sdp: answer });
        callState.active = true;
        setCallStatus('Respuesta enviada. Conectando llamada...', 'muted');
        setCallButtons();
        return;
      }

      if (signalType === 'answer' && data.sdp) {
        if (!callState.peerConnection) return;

        await callState.peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.sdp)
        );

        callState.remoteDescriptionReady = true;
        await flushPendingCandidates();
        setCallStatus('Llamada aceptada. Estableciendo conexión...', 'muted');
        return;
      }

      if (signalType === 'candidate' && data.candidate) {
        const peerConnection = createPeerConnection();
        const candidate = new RTCIceCandidate(data.candidate);

        if (callState.remoteDescriptionReady && peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(candidate);
        } else {
          callState.pendingCandidates.push(candidate);
        }
        return;
      }

      if (signalType === 'hang-up') {
        closeCallSession({
          notifyHangUp: false,
          closeSignal: false,
          keepStatus: true,
        });
        setCallStatus('La otra persona finalizó la llamada.', 'muted');
      }
    } catch (error) {
      setCallStatus(
        error?.message || 'No fue posible procesar la señal de llamada.',
        'error'
      );
    }
  };

  const ensureSignalSocket = async (roomId) => {
    if (!hasCallUI) return null;

    const normalizedRoomId = String(roomId || '').trim();
    if (!normalizedRoomId) return null;

    if (callState.signalSocket && callState.roomId === normalizedRoomId) {
      if (callState.signalSocket.readyState === WebSocket.OPEN) {
        return callState.signalSocket;
      }

      if (callState.signalSocket.readyState === WebSocket.CONNECTING) {
        await waitForSocketOpen(callState.signalSocket);
        return callState.signalSocket;
      }
    }

    closeCallSession({
      notifyHangUp: false,
      closeSignal: true,
      keepStatus: true,
    });

    const wsUrl = buildSignalSocketUrl(normalizedRoomId);
    const signalSocket = new WebSocket(wsUrl);

    callState.signalSocket = signalSocket;
    callState.signalClosing = false;
    callState.roomId = normalizedRoomId;

    signalSocket.onmessage = async (event) => {
      if (disposed || callState.signalSocket !== signalSocket) return;

      try {
        const signalData = JSON.parse(event.data);
        await handleSignalMessage(signalData);
      } catch {
        // Ignore malformed signaling payloads.
      }
    };

    signalSocket.onerror = () => {
      if (disposed || callState.signalSocket !== signalSocket) return;
      setCallStatus('La señalización de llamada reportó un error.', 'error');
    };

    signalSocket.onclose = async (event) => {
      if (callState.signalSocket === signalSocket) {
        callState.signalSocket = null;
      }

      if (callState.signalClosing) {
        callState.signalClosing = false;
        setCallButtons();
        return;
      }

      if (event?.code === 4001) {
        setCallStatus('Token inválido para señalización.', 'error');
        window.alert('Token inválido');
        return;
      }

      if (event?.code === 4002) {
        setCallStatus('No se puede abrir llamada: sala llena.', 'error');
        window.alert('Sala llena');
        return;
      }

      setCallStatus('Se perdió la señalización de la llamada.', 'error');
      closeCallSession({
        notifyHangUp: false,
        closeSignal: false,
        keepStatus: true,
      });
      setCallButtons();
    };

    setCallPanelVisible(true);
    setCallStatus(`Conectando señalización de sala ${normalizedRoomId}...`, 'muted');
    await waitForSocketOpen(signalSocket);
    if (disposed || callState.signalSocket !== signalSocket) {
      return null;
    }

    setCallStatus(`Señalización lista en sala ${normalizedRoomId}.`, 'muted');
    setCallButtons();

    return signalSocket;
  };

  const startCall = async () => {
    if (!hasCallUI) return;

    if (!state.activeRoomId) {
      setCallStatus('Abre una sala antes de iniciar llamada.', 'error');
      return;
    }

    try {
      setCallPanelVisible(true);
      await ensureSignalSocket(state.activeRoomId);
      await ensureLocalStream();

      const peerConnection = createPeerConnection();
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      sendSignalMessage({ type: 'offer', sdp: offer });
      callState.active = true;
      setCallStatus('Llamando... esperando respuesta.', 'muted');
      setCallButtons();
    } catch (error) {
      setCallStatus(
        error?.message || 'No se pudo iniciar la videollamada.',
        'error'
      );
    }
  };

  const hangUpCall = () => {
    if (!hasCallUI) return;

    closeCallSession({
      notifyHangUp: true,
      closeSignal: false,
      keepStatus: true,
    });
    setCallStatus('Llamada finalizada.', 'muted');
  };

  if (hasCallUI) {
    setCallPanelVisible(false);
    setCallButtons();
  }

  const renderNotificationsBadge = () => {
    if (!hasNotificationUI) return;

    const unreadCount = CHAT_NOTIFICATION_STORE.unreadCount;
    notificationsBadge.hidden = unreadCount <= 0;
    notificationsBadge.textContent = unreadCount > 99 ? '99+' : String(unreadCount);
  };

  const renderNotificationsList = () => {
    if (!hasNotificationUI) return;

    notificationsList.innerHTML = '';
    const visibleItems = CHAT_NOTIFICATION_STORE.items.slice(0, 8);
    notificationsEmpty.hidden = visibleItems.length > 0;

    visibleItems.forEach((item) => {
      const notificationItem = document.createElement('li');
      notificationItem.className = 'notifications-item';

      const title = document.createElement('p');
      title.className = 'notifications-item-title';
      title.textContent = item.title;

      const detail = document.createElement('p');
      detail.className = 'notifications-item-detail';
      detail.textContent = item.body;

      const time = document.createElement('span');
      time.className = 'notifications-item-time';
      time.textContent = item.timeLabel;

      notificationItem.appendChild(title);
      notificationItem.appendChild(detail);
      notificationItem.appendChild(time);
      notificationsList.appendChild(notificationItem);
    });
  };

  const setNotificationsOpen = (open) => {
    if (!hasNotificationUI) return;

    notificationsOpen = open;
    notificationsPanel.hidden = !open;
    notificationsButton.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (open && CHAT_NOTIFICATION_STORE.unreadCount > 0) {
      CHAT_NOTIFICATION_STORE.unreadCount = 0;
      renderNotificationsBadge();
    }
  };

  const requestBrowserNotificationsPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }

    if (Notification.permission === 'default') {
      try {
        return await Notification.requestPermission();
      } catch {
        return 'denied';
      }
    }

    return Notification.permission;
  };

  const showBrowserNotification = (item) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      const browserNotification = new Notification(item.title, {
        body: item.body,
        tag: item.roomId ? `chat-room-${item.roomId}` : 'chat-general',
      });

      window.setTimeout(() => {
        browserNotification.close();
      }, 4500);
    } catch {
      // Ignore browser notification errors.
    }
  };

  const showToastNotification = (item) => {
    if (!hasNotificationUI) return;

    const toast = document.createElement('article');
    toast.className = 'notification-toast';

    const title = document.createElement('h4');
    title.textContent = item.title;

    const detail = document.createElement('p');
    detail.textContent = item.body;

    const time = document.createElement('span');
    time.className = 'notification-toast-time';
    time.textContent = item.timeLabel;

    toast.appendChild(title);
    toast.appendChild(detail);
    toast.appendChild(time);

    notificationsToastStack.prepend(toast);

    window.setTimeout(() => {
      toast.classList.add('is-leaving');
      window.setTimeout(() => {
        toast.remove();
      }, 220);
    }, 4500);
  };

  const pushIncomingMessageNotification = ({ senderName, message, roomId }) => {
    if (!hasNotificationUI) return;

    const sender = String(senderName || 'Tu match').trim() || 'Tu match';
    const messageText = String(message || '').trim();
    const body = messageText
      ? `${sender}: ${messageText}`
      : `${sender} te envió un mensaje nuevo.`;

    const notification = {
      id: CHAT_NOTIFICATION_STORE.nextId,
      title: 'Nuevo mensaje',
      body,
      roomId: roomId ? String(roomId) : null,
      timeLabel: formatNotificationTime(new Date()),
    };

    CHAT_NOTIFICATION_STORE.nextId += 1;
    CHAT_NOTIFICATION_STORE.items.unshift(notification);
    CHAT_NOTIFICATION_STORE.items = CHAT_NOTIFICATION_STORE.items.slice(
      0,
      MAX_CHAT_NOTIFICATIONS
    );
    if (notificationsOpen) {
      CHAT_NOTIFICATION_STORE.unreadCount = 0;
    } else {
      CHAT_NOTIFICATION_STORE.unreadCount += 1;
    }

    renderNotificationsList();
    renderNotificationsBadge();
    showToastNotification(notification);

    if (document.visibilityState !== 'visible') {
      showBrowserNotification(notification);
    }
  };

  if (hasNotificationUI) {
    renderNotificationsList();
    renderNotificationsBadge();
  }

  const cleanupFeedActions = () => {
    feedActionCleanups.forEach((cleanup) => cleanup());
    feedActionCleanups = [];
  };

  const renderFeedCarousels = () => {
    if (!hasFeedCarousel) return;

    cleanupFeedActions();
    feedCarouselControlsCleanup();
    feedCarouselControlsCleanup = () => {};

    if (feedQueue.length === 0) {
      feedCategoriesRoot.innerHTML = renderFeedEmptyState();
      return;
    }

    feedCategoriesRoot.innerHTML = renderFeedCategoryBoard(feedQueue);
    feedCarouselControlsCleanup = setupSwapsCarousels();

    feedCategoriesRoot.querySelectorAll('.feed-card-avatar').forEach((avatar) => {
      const onAvatarError = () => {
        avatar.src = DEFAULT_MATCH_AVATAR;
      };

      avatar.addEventListener('error', onAvatarError);
      feedActionCleanups.push(() => {
        avatar.removeEventListener('error', onAvatarError);
      });
    });

    feedQueue.forEach((profile) => {
      const profileId = getFeedProfileId(profile);
      if (!profileId) return;

      resolveAvatarForEntity(profile, avatarCache).then((resolvedAvatar) => {
        if (disposed) return;

        const avatar = feedCategoriesRoot.querySelector(
          `[data-feed-avatar-id="${profileId}"]`
        );
        if (avatar) {
          avatar.src = resolvedAvatar;
        }
      });
    });

    feedCategoriesRoot.querySelectorAll('.feed-swipe-btn').forEach((button) => {
      const action = button.getAttribute('data-action');
      const userToId = button.getAttribute('data-user-id');

      const onSwipe = () => {
        if (!action || !userToId) return;
        registerSwipe(action, userToId);
      };

      button.addEventListener('click', onSwipe);
      feedActionCleanups.push(() => {
        button.removeEventListener('click', onSwipe);
      });
    });

    setFeedButtonsDisabled(swipeInProgress);
  };

  const cleanupRows = () => {
    if (!hasChatPanel) return;

    rowCleanups.forEach((cleanup) => cleanup());
    rowCleanups = [];
    matchesList.innerHTML = '';
  };

  const closeSocket = () => {
    if (!state.socket) return;
    try {
      state.socket.close();
    } catch {
      // Ignore close errors when switching rooms.
    }
    state.socket = null;
  };

  const showChat = (show) => {
    if (!hasChatPanel) return;

    chatContainer.hidden = !show;
    chatEmptyState.hidden = show;
  };

  const markActiveMatch = (roomId) => {
    if (!hasChatPanel) return;

    document.querySelectorAll('.match-item').forEach((item) => {
      const isActive = item.getAttribute('data-room-id') === String(roomId);
      item.classList.toggle('is-active', isActive);
    });
  };

  const paintMessage = (msg = {}) => {
    if (!hasChatPanel) return;

    const text = String(msg.message || '').trim();
    if (!text) return;

    const aiMessage = isAiMessage(msg);
    const senderId = msg.user_id !== undefined ? String(msg.user_id) : '';
    const isMine = !aiMessage && state.userId !== null && senderId === state.userId;
    const senderName = String(msg.username || '').trim();

    const historyEmpty = chatMessages.querySelector('.chat-history-empty');
    if (historyEmpty) {
      historyEmpty.remove();
    }

    const bubble = document.createElement('div');
    bubble.className = `chat-message ${
      aiMessage ? 'mensaje-ai' : isMine ? 'mensaje-mio' : 'mensaje-otro'
    }`;

    if (aiMessage) {
      const aiLabel = document.createElement('span');
      aiLabel.className = 'chat-ai-label';
      aiLabel.textContent = senderName || 'Asistente IA';

      const aiText = document.createElement('span');
      aiText.className = 'chat-ai-text';
      aiText.textContent = text;

      bubble.append(aiLabel, aiText);
    } else {
      bubble.textContent = text;
    }

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const sendMessage = () => {
    if (!hasChatPanel) return;

    const text = chatInput.value.trim();
    if (!text) return;

    if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
      chatRoomHelper.textContent = 'La sala no está conectada todavía.';
      return;
    }

    const payload = {
      message: text,
    };

    state.socket.send(JSON.stringify(payload));
    chatInput.value = '';
  };

  const clearChat = () => {
    if (!hasChatPanel) return;

    closeCallSession({
      notifyHangUp: callState.active,
      closeSignal: true,
      keepStatus: true,
    });

    state.activeRoomId = null;
    closeSocket();
    markActiveMatch(null);
    showChat(false);
    chatMessages.innerHTML = '';
    chatHeader.textContent = 'Chat';
    chatRoomHelper.textContent = 'Selecciona una conversación para empezar.';

    if (hasCallUI) {
      setCallPanelVisible(false);
      setCallStatus('Listo para iniciar llamada.', 'muted');
      setCallButtons();
    }
  };

  const openChat = async (match) => {
    if (!hasChatPanel) return;

    const roomId = getMatchRoomId(match);
    if (!roomId) {
      chatRoomHelper.textContent = 'Este match todavía no tiene sala disponible.';
      return;
    }

    if (callState.roomId && callState.roomId !== String(roomId)) {
      closeCallSession({
        notifyHangUp: callState.active,
        closeSignal: true,
        keepStatus: true,
      });
    }

    state.activeRoomId = roomId;
    latestHistoryRequest += 1;
    const historyRequestId = latestHistoryRequest;

    closeSocket();
    markActiveMatch(roomId);
    showChat(true);
    chatMessages.innerHTML = '';

    if (hasCallUI) {
      setCallPanelVisible(true);
      setCallStatus('Preparando señalización de llamada...', 'muted');
      setCallButtons();
      try {
        await ensureSignalSocket(roomId);
      } catch (error) {
        setCallStatus(
          error?.message || 'No se pudo conectar la señalización de llamada.',
          'error'
        );
      }
    }

    const fullName = [match.first_name, match.last_name].filter(Boolean).join(' ');
    chatHeader.textContent = `Chat con ${fullName || 'tu match'}`;
    chatRoomHelper.textContent = `Cargando historial de la sala ${roomId}...`;

    try {
      const historyPayload = await getMessages(roomId);
      if (
        disposed ||
        historyRequestId !== latestHistoryRequest ||
        state.activeRoomId !== String(roomId)
      ) {
        return;
      }

      const history = normalizeMessagesPayload(historyPayload);
      if (history.length === 0) {
        const emptyHistory = document.createElement('p');
        emptyHistory.className = 'chat-history-empty';
        emptyHistory.textContent = 'Aún no hay mensajes en esta sala. Inicia la conversación.';
        chatMessages.appendChild(emptyHistory);
      } else {
        history.forEach((message) => {
          paintMessage(message);
        });
      }
    } catch (error) {
      chatRoomHelper.textContent =
        error?.message || 'No fue posible cargar el historial de mensajes.';
    }

    const wsUrl = buildChatSocketUrl(roomId);

    try {
      const socket = new WebSocket(wsUrl);
      state.socket = socket;
      chatRoomHelper.textContent = 'Conectando al chat en tiempo real...';

      socket.onopen = () => {
        if (disposed || state.socket !== socket) return;
        chatRoomHelper.textContent = `Conectado a la sala ${roomId}.`;
      };

      socket.onmessage = (event) => {
        if (disposed || state.socket !== socket) return;

        try {
          const message = JSON.parse(event.data);
          if (isSignalingMessageType(message?.type)) return;

          const aiMessage = isAiMessage(message);
          const senderId =
            message?.user_id !== undefined ? String(message.user_id) : null;
          const isMine = !aiMessage && state.userId !== null && senderId === String(state.userId);

          paintMessage(message);

          if (!isMine) {
            const senderName = String(message?.username || '').trim();
            pushIncomingMessageNotification({
              senderName: aiMessage
                ? senderName || 'Asistente IA'
                : fullName || senderName || 'Tu match',
              message: message?.message,
              roomId,
            });
          }
        } catch {
          // Ignore malformed websocket events.
        }
      };

      socket.onerror = () => {
        if (disposed || state.socket !== socket) return;
        chatRoomHelper.textContent =
          'La conexión del chat tuvo un problema. Reintenta abrir la sala.';
      };

      socket.onclose = async (event) => {
        if (disposed || state.socket !== socket) return;

        if (event?.code === 4001) {
          state.socket = null;
          closeCallSession({
            notifyHangUp: false,
            closeSignal: true,
            keepStatus: true,
          });
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('user_id');
          localStorage.removeItem('role');
          localStorage.removeItem('pendingOnboarding');
          const { LoginPage } = await import('./login.js');
          LoginPage('login');
          return;
        }

        state.socket = null;
        chatRoomHelper.textContent = 'Chat desconectado.';
      };
    } catch {
      chatRoomHelper.textContent = 'No se pudo abrir la conexión en tiempo real.';
    }
  };

  const loadMatches = async () => {
    if (!hasChatPanel) return;

    latestMatchesRequest += 1;
    const requestId = latestMatchesRequest;

    cleanupRows();

    setMatchesStatus('Cargando tus matches...', 'muted');

    try {
      const payload = await getMatches();
      if (disposed || requestId !== latestMatchesRequest) return;

      const allMatches = normalizeMatchesPayload(payload);
      const matches = allMatches.filter((match) => {
        const roomId = getMatchRoomId(match);
        return !isClosedSwapRoom(roomId);
      });

      if (matches.length === 0) {
        const noActiveSwaps = allMatches.length > 0;
        setMatchesStatus(
          noActiveSwaps
            ? 'No tienes swaps activos. Los swaps cerrados no se muestran aquí.'
            : 'Aún no tienes matches disponibles.',
          'muted'
        );

        const emptyMatches = document.createElement('p');
        emptyMatches.className = 'matches-empty-state';
        emptyMatches.textContent = noActiveSwaps
          ? 'Cuando recibas nuevas coincidencias, aparecerán aquí para iniciar chat.'
          : 'Cuando haya coincidencias nuevas, aparecerán aquí para iniciar chat.';
        matchesList.appendChild(emptyMatches);
        return;
      }

      setMatchesStatus(
        `${matches.length} ${matches.length === 1 ? 'match cargado' : 'matches cargados'}.`,
        'success'
      );

      matches.forEach((match) => {
        const roomId = getMatchRoomId(match);
        const fullName = [match?.first_name, match?.last_name]
          .filter(Boolean)
          .join(' ')
          .trim();

        const wrapper = document.createElement('article');
        wrapper.className = 'match-item';
        if (roomId) {
          wrapper.setAttribute('data-room-id', roomId);
        }

        const avatar = document.createElement('img');
        avatar.src = getMatchAvatar(match);
        avatar.alt = `Avatar de ${fullName || 'usuario'}`;
        avatar.loading = 'lazy';

        resolveAvatarForEntity(match, avatarCache).then((resolvedAvatar) => {
          if (disposed) return;
          avatar.src = resolvedAvatar;
        });

        const profile = document.createElement('div');
        profile.className = 'match-user-data';

        const name = document.createElement('span');
        name.className = 'match-name';
        name.textContent = fullName || 'Usuario Learning Swap';

        const room = document.createElement('span');
        room.className = 'match-room';
        room.textContent = roomId ? `Sala #${roomId}` : 'Sala no disponible';

        const action = document.createElement('button');
        action.className = 'match-chat-btn';
        action.type = 'button';
        action.textContent = 'Chatear';
        action.disabled = !roomId;

        profile.appendChild(name);
        profile.appendChild(room);
        wrapper.appendChild(avatar);
        wrapper.appendChild(profile);
        wrapper.appendChild(action);
        matchesList.appendChild(wrapper);

        const onAvatarError = () => {
          avatar.src = DEFAULT_MATCH_AVATAR;
        };

        const onOpenChat = () => {
          openChat(match);
        };

        avatar.addEventListener('error', onAvatarError);
        action.addEventListener('click', onOpenChat);

        rowCleanups.push(() => {
          avatar.removeEventListener('error', onAvatarError);
          action.removeEventListener('click', onOpenChat);
        });
      });

      if (options.autoOpenFirstMatch && !autoOpenDone && !state.activeRoomId) {
        const firstRoomMatch = matches.find((match) => {
          return Boolean(getMatchRoomId(match));
        });

        if (firstRoomMatch) {
          autoOpenDone = true;
          openChat(firstRoomMatch);
        }
      }
    } catch (error) {
      if (disposed || requestId !== latestMatchesRequest) return;

      setMatchesStatus(error?.message || 'No se pudieron cargar los matches.', 'error');
    }
  };

  const loadFeed = async () => {
    if (!hasFeedCarousel) return;

    setFeedStatus('Cargando perfiles sugeridos...', 'muted');

    try {
      const payload = await getFeed();
      if (disposed) return;

      const feedProfiles = normalizeFeedPayload(payload).filter((profile) => {
        const candidateId = getFeedProfileId(profile);
        if (!candidateId) return false;

        return String(candidateId) !== String(state.userId);
      });

      feedQueue = feedProfiles;

      if (feedQueue.length === 0) {
        setFeedStatus('No hay perfiles disponibles en tu feed por ahora.', 'muted');
        renderFeedCarousels();
        return;
      }

      renderFeedCarousels();
      const categorizedGroups = groupFeedProfilesByCategory(feedQueue);
      setFeedStatus(
        `${feedQueue.length} perfiles en ${categorizedGroups.length} ${
          categorizedGroups.length === 1 ? 'carrusel filtrado' : 'carruseles filtrados'
        }.`,
        'success'
      );
    } catch (error) {
      if (disposed) return;

      setFeedStatus(error?.message || 'No se pudo cargar el feed de perfiles.', 'error');
      feedQueue = [];
      renderFeedCarousels();
    }
  };

  const registerSwipe = async (action, selectedUserToId = null) => {
    if (!hasFeedCarousel || swipeInProgress) return;
    if (action !== 'like' && action !== 'pass') return;

    const profile = selectedUserToId
      ? feedQueue.find(
          (candidate) =>
            String(getFeedProfileId(candidate)) === String(selectedUserToId)
        )
      : feedQueue[0];
    const userToId = getFeedProfileId(profile);

    if (!profile || !userToId) {
      setFeedStatus('No hay perfil disponible para registrar swipe.', 'error');
      return;
    }

    swipeInProgress = true;
    setFeedButtonsDisabled(true);
    setFeedStatus(action === 'like' ? 'Enviando like...' : 'Enviando pass...', 'muted');

    try {
      const response = await sendSwipe(userToId, action);
      if (disposed) return;

      const createdMatch = isMatchCreated(response);

      if (action === 'like' && createdMatch) {
        setFeedStatus('Nuevo match creado. Ya puedes abrir el chat.', 'success');
      } else if (action === 'like') {
        setFeedStatus(
          response?.message ||
            'Like enviado. El match se crea cuando la otra persona también da like.',
          'muted'
        );
      } else {
        setFeedStatus(
          response?.message || 'Pass enviado. Mostrando siguiente perfil...',
          'muted'
        );
      }

      feedQueue = feedQueue.filter((candidate) => {
        return String(getFeedProfileId(candidate)) !== String(userToId);
      });

      renderFeedCarousels();

      if (feedQueue.length === 0) {
        setFeedStatus('No hay más perfiles en el feed. Usa actualizar feed.', 'muted');
      }

      if (action === 'like' && hasChatPanel) {
        await loadMatches();
      }
    } catch (error) {
      if (disposed) return;

      if (action === 'pass') {
        feedQueue = feedQueue.filter((candidate) => {
          return String(getFeedProfileId(candidate)) !== String(userToId);
        });

        renderFeedCarousels();

        const hasMoreProfiles = feedQueue.length > 0;
        setFeedStatus(
          hasMoreProfiles
            ? 'Pass aplicado localmente. El backend reportó un error temporal; puedes seguir.'
            : 'Pass aplicado localmente. No hay más perfiles en el feed por ahora.',
          'muted'
        );

        return;
      }

      setFeedStatus(error?.message || 'No se pudo registrar el swipe.', 'error');
    } finally {
      swipeInProgress = false;
      setFeedButtonsDisabled(false);
    }
  };

  const onRefreshMatches = () => {
    loadMatches();
  };

  const onRefreshFeed = () => {
    loadFeed();
  };

  const onChatSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const onCloseChat = () => {
    clearChat();
  };

  const onStartCall = async () => {
    await startCall();
  };

  const onHangupCall = () => {
    hangUpCall();
  };

  const onFinishSwap = async () => {
    if (!hasChatPanel) return;

    if (!state.activeRoomId) {
      chatRoomHelper.textContent = 'Abre una conversación para cerrar el swap.';
      return;
    }

    const activeRoomId = String(state.activeRoomId);
    const shouldCloseSwap = window.confirm(
      '¿Deseas cerrar este swap y darlo por terminado? Esta conversación dejará de mostrarse en tu lista activa.'
    );

    if (!shouldCloseSwap) return;

    closeSwapRoom(activeRoomId);
    clearChat();
    setMatchesStatus(`Swap #${activeRoomId} cerrado correctamente.`, 'success');
    await loadMatches();
  };

  const onNotificationsToggle = () => {
    const nextState = !notificationsOpen;
    setNotificationsOpen(nextState);

    if (nextState) {
      requestBrowserNotificationsPermission();
    }
  };

  const onNotificationsOutsideClick = (event) => {
    if (!hasNotificationUI || !notificationsOpen) return;

    if (
      notificationsPanel.contains(event.target) ||
      notificationsButton.contains(event.target)
    ) {
      return;
    }

    setNotificationsOpen(false);
  };

  const onNotificationsEsc = (event) => {
    if (!hasNotificationUI) return;
    if (event.key !== 'Escape' || !notificationsOpen) return;
    setNotificationsOpen(false);
  };

  if (hasChatPanel) {
    refreshMatchesButton.addEventListener('click', onRefreshMatches);
    chatForm.addEventListener('submit', onChatSubmit);
    closeChatButton.addEventListener('click', onCloseChat);
    finishSwapButton.addEventListener('click', onFinishSwap);

    if (hasCallUI) {
      callStartButton.addEventListener('click', onStartCall);
      callHangupButton.addEventListener('click', onHangupCall);
    }
  }

  if (hasNotificationUI) {
    notificationsButton.addEventListener('click', onNotificationsToggle);
    document.addEventListener('click', onNotificationsOutsideClick);
    document.addEventListener('keydown', onNotificationsEsc);
  }

  if (hasFeedCarousel) {
    refreshFeedButton.addEventListener('click', onRefreshFeed);

    cleanups.push(() => {
      refreshFeedButton.removeEventListener('click', onRefreshFeed);
    });
  }

  cleanups.push(() => {
    if (hasChatPanel) {
      refreshMatchesButton.removeEventListener('click', onRefreshMatches);
      chatForm.removeEventListener('submit', onChatSubmit);
      closeChatButton.removeEventListener('click', onCloseChat);
      finishSwapButton.removeEventListener('click', onFinishSwap);

      if (hasCallUI) {
        callStartButton.removeEventListener('click', onStartCall);
        callHangupButton.removeEventListener('click', onHangupCall);
      }
    }

    if (hasNotificationUI) {
      notificationsButton.removeEventListener('click', onNotificationsToggle);
      document.removeEventListener('click', onNotificationsOutsideClick);
      document.removeEventListener('keydown', onNotificationsEsc);
      setNotificationsOpen(false);
      notificationsToastStack.innerHTML = '';
    }
  });

  if (hasChatPanel) {
    loadMatches();
  }

  if (hasFeedCarousel) {
    loadFeed();
  }

  return () => {
    disposed = true;
    cleanupRows();
    cleanupFeedActions();
    feedCarouselControlsCleanup();
    closeCallSession({
      notifyHangUp: callState.active,
      closeSignal: true,
      keepStatus: true,
    });
    closeSocket();
    cleanups.forEach((cleanup) => cleanup());
  };
}

function getMatchAvatar(match = {}) {
  const normalizedAvatar = normalizeAvatarUrl(getAvatarCandidate(match));
  return normalizedAvatar || DEFAULT_MATCH_AVATAR;
}

async function resolveAvatarForEntity(entity = {}, avatarCache) {
  const entityId = getEntityUserId(entity);
  const normalizedFromEntity = normalizeAvatarUrl(getAvatarCandidate(entity));

  if (normalizedFromEntity) {
    if (entityId) {
      avatarCache?.set(entityId, normalizedFromEntity);
    }
    return normalizedFromEntity;
  }

  if (!entityId) {
    return DEFAULT_MATCH_AVATAR;
  }

  if (avatarCache?.has(entityId)) {
    return avatarCache.get(entityId);
  }

  try {
    const profile = await getUserById(entityId);
    const normalizedFromProfile = normalizeAvatarUrl(getAvatarCandidate(profile));
    const resolvedAvatar = normalizedFromProfile || DEFAULT_MATCH_AVATAR;
    avatarCache?.set(entityId, resolvedAvatar);
    return resolvedAvatar;
  } catch {
    avatarCache?.set(entityId, DEFAULT_MATCH_AVATAR);
    return DEFAULT_MATCH_AVATAR;
  }
}

function getAvatarCandidate(entity = {}) {
  const candidate =
    entity?.avatar_url ||
    entity?.avatar ||
    entity?.photo_url ||
    entity?.profile_picture ||
    entity?.foto ||
    entity?.photo ||
    entity?.image_url ||
    '';

  if (typeof candidate !== 'string') return null;

  const cleaned = candidate.trim();
  return cleaned || null;
}

function normalizeAvatarUrl(url) {
  if (!url || typeof url !== 'string') return null;

  const cleaned = url.trim();
  if (!cleaned) return null;

  if (
    cleaned.startsWith('http://') ||
    cleaned.startsWith('https://') ||
    cleaned.startsWith('data:') ||
    cleaned.startsWith('blob:')
  ) {
    return cleaned;
  }

  if (cleaned.startsWith('//')) {
    return `${window.location.protocol}${cleaned}`;
  }

  const apiBase = import.meta.env.VITE_API_URL;

  if (!apiBase) {
    return cleaned;
  }

  try {
    const origin = new URL(apiBase).origin;
    if (cleaned.startsWith('/')) {
      return `${origin}${cleaned}`;
    }

    return `${origin}/${cleaned.replace(/^\/+/, '')}`;
  } catch {
    return cleaned;
  }
}

function getEntityUserId(entity = {}) {
  const candidateId =
    entity?.user_id ??
    entity?.id ??
    entity?.target_user_id ??
    entity?.userToId ??
    entity?.matched_user_id ??
    entity?.match_user_id ??
    null;

  if (candidateId === null || candidateId === undefined || candidateId === '') {
    return null;
  }

  return String(candidateId);
}

function getMatchRoomId(match = {}) {
  const roomId = match?.room_id ?? match?.roomId ?? match?.chat_room_id ?? null;

  if (roomId === null || roomId === undefined || String(roomId).trim() === '') {
    return null;
  }

  return String(roomId);
}

function readClosedSwapRooms(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return new Set();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();

    return new Set(
      parsed
        .map((roomId) => String(roomId || '').trim())
        .filter(Boolean)
    );
  } catch {
    return new Set();
  }
}

function persistClosedSwapRooms(storageKey, closedRoomIdsSet) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(closedRoomIdsSet)));
  } catch {
    // Ignore storage errors (private mode, quota, etc.).
  }
}

function normalizeMatchesPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.matches)) return payload.matches;
  if (Array.isArray(payload?.data?.matches)) return payload.data.matches;
  return [];
}

function normalizeMessagesPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.messages)) return payload.messages;
  if (Array.isArray(payload?.data?.messages)) return payload.data.messages;
  return [];
}

function isAiMessage(message = {}) {
  if (!message || typeof message !== 'object') return false;

  if (message.is_ai === true || message.is_ai === 1) {
    return true;
  }

  if (typeof message.is_ai === 'string') {
    const normalized = message.is_ai.trim().toLowerCase();
    return normalized === 'true' || normalized === '1';
  }

  return false;
}

function isSignalingMessageType(type = '') {
  const normalizedType = String(type || '').trim().toLowerCase();

  return (
    normalizedType === 'offer' ||
    normalizedType === 'answer' ||
    normalizedType === 'candidate' ||
    normalizedType === 'hang-up' ||
    normalizedType === 'hangup'
  );
}

function normalizeFeedPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.feed)) return payload.feed;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.profiles)) return payload.profiles;
  if (Array.isArray(payload?.data?.feed)) return payload.data.feed;
  if (Array.isArray(payload?.data?.users)) return payload.data.users;
  if (Array.isArray(payload?.data?.profiles)) return payload.data.profiles;
  return [];
}

function getFeedProfileId(profile = {}) {
  return getEntityUserId(profile);
}

function normalizeSkillList(skills, options = {}) {
  const { limit = 5 } = options;

  const normalizeEntries = (items) => {
    return items
      .map((entry) => {
        if (typeof entry === 'string') {
          return entry;
        }

        if (entry && typeof entry === 'object') {
          return (
            entry.name ||
            entry.skill ||
            entry.skill_name ||
            entry.title ||
            entry.label ||
            ''
          );
        }

        return String(entry || '');
      })
      .map((skill) => String(skill || '').trim())
      .filter(Boolean)
      .slice(0, Math.max(1, limit));
  };

  if (Array.isArray(skills)) {
    return normalizeEntries(skills);
  }

  if (typeof skills === 'string' && skills.trim()) {
    return normalizeEntries(
      skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)
    );
  }

  return [];
}

function isMatchCreated(payload) {
  if (!payload || typeof payload !== 'object') return false;

  if (
    payload.match === true ||
    payload.matched === true ||
    payload.is_match === true ||
    payload.match_created === true
  ) {
    return true;
  }

  if (payload.room_id !== undefined && payload.room_id !== null && payload.room_id !== '') {
    return true;
  }

  const message = String(payload.message || payload.detail || '').toLowerCase();
  return message.includes('match') && !message.includes('no match');
}

function buildChatSocketUrl(roomId) {
  const token = localStorage.getItem('token') || '';
  const authQuery = `?token=${encodeURIComponent(token)}`;

  const wsBase = import.meta.env.VITE_WS_URL;
  if (wsBase) {
    return `${wsBase.replace(/\/$/, '')}/ws/chat/${roomId}${authQuery}`;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    try {
      const parsed = new URL(apiUrl);
      const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${parsed.host}/ws/chat/${roomId}${authQuery}`;
    } catch {
      // Fall through to default websocket URL.
    }
  }

  return `wss://learning-swap-backend.onrender.com/ws/chat/${roomId}${authQuery}`;
}

function buildSignalSocketUrl(roomId) {
  const token = localStorage.getItem('token') || '';
  const authQuery = `?token=${encodeURIComponent(token)}`;

  const configuredSignalBase =
    import.meta.env.VITE_WS_SIGNAL_URL || import.meta.env.VITE_WS_URL;

  if (configuredSignalBase) {
    const trimmedBase = String(configuredSignalBase).replace(/\/$/, '');

    if (trimmedBase.includes('{roomId}') || trimmedBase.includes('{token}')) {
      return trimmedBase
        .replace('{roomId}', encodeURIComponent(String(roomId)))
        .replace('{token}', encodeURIComponent(token));
    }

    if (trimmedBase.includes('/ws/chat/')) {
      return `${trimmedBase.replace('/ws/chat/', '/ws/signal/')}${authQuery}`;
    }

    if (trimmedBase.endsWith('/ws/chat')) {
      return `${trimmedBase.replace('/ws/chat', '/ws/signal')}/${roomId}${authQuery}`;
    }

    if (trimmedBase.includes('/ws/signal')) {
      return `${trimmedBase}/${roomId}${authQuery}`;
    }

    return `${trimmedBase}/ws/signal/${roomId}${authQuery}`;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    try {
      const parsed = new URL(apiUrl);
      const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${parsed.host}/ws/signal/${roomId}${authQuery}`;
    } catch {
      // Fall through to default websocket URL.
    }
  }

  return `wss://learning-swap-backend.onrender.com/ws/signal/${roomId}${authQuery}`;
}

function formatNotificationTime(dateValue) {
  try {
    return new Date(dateValue).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Ahora';
  }
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
