import {
  getFeed,
  getMatches,
  getMessages,
  getUserById,
  sendSwipe,
} from '../services/api.js';
import { getCurrentUser, getCurrentUserId, isAuthenticated } from '../utils/auth.js';

const DEFAULT_MATCH_AVATAR = '/assets/users-cards-icons/user2.jpg';

const SWAP_SECTIONS = [
  {
    id: 'carousel1',
    heading: 'Perfiles populares',
    subheading: 'programacion.',
    cards: [
      {
        skillIcon: '/assets/programing-icons/c.png',
        skillAlt: 'Skill icon de C#',
        coverImage: '/assets/cards-img/first-card.jpg',
        coverAlt: 'Perfil destacado de C#',
        title: 'junior en C# con mas de 9 meses de experiencia',
        avatar: '/assets/users-cards-icons/mclovin.jpg',
        avatarAlt: 'Foto de Andres.F David',
        name: 'Andres.F David',
        role: 'Creator / backend',
        projects: '27 proyectos',
        match: '+16',
      },
      {
        skillIcon: '/assets/programing-icons/frontend.png',
        skillAlt: 'Skill icon de frontend',
        coverImage: '/assets/cards-img/front.jpg',
        coverAlt: 'Perfil destacado de frontend',
        title: 'Semi-senior frontend con mas de 2 años de experiencia',
        avatar: '/assets/users-cards-icons/user2.jpg',
        avatarAlt: 'Foto de Sofia.L Aranzasa',
        name: 'Sofia.L Aranzasa',
        role: 'Creator / frontend',
        projects: '12 proyectos',
        match: '+13',
      },
      {
        skillIcon: '/assets/programing-icons/python.png',
        skillAlt: 'Skill icon de Python',
        coverImage: '/assets/cards-img/python.card.jpg',
        coverAlt: 'Perfil destacado de Python',
        title: 'Aprendiz de Python desde hace 3 meses',
        avatar: '/assets/users-cards-icons/user3.jpg',
        avatarAlt: 'Foto de Jose.A Flores',
        name: 'Jose.A Flores',
        role: 'Creator / backend',
        projects: '11 proyectos',
        match: '+7',
      },
      {
        skillIcon: '/assets/programing-icons/js.png',
        skillAlt: 'Skill icon de JavaScript',
        coverImage: '/assets/cards-img/card-img-4.jpg',
        coverAlt: 'Perfil destacado de JavaScript',
        title: 'Junior en desarollo Fullstack con JavaScript',
        avatar: '/assets/users-cards-icons/user4.jpg',
        avatarAlt: 'Foto de Juan.D David',
        name: 'Juan.D David',
        role: 'Creator / backend',
        projects: '7 proyectos',
        match: '+4',
      },
      {
        skillIcon: '/assets/programing-icons/java.png',
        skillAlt: 'Skill icon de Java',
        coverImage: '/assets/cards-img/user-card-5.jpg',
        coverAlt: 'Perfil destacado de Java',
        title: 'Aprendiz de Java con 7 meses de estudio',
        avatar: '/assets/users-cards-icons/user5.jpg',
        avatarAlt: 'Foto de Liliana Henao',
        name: 'Liliana Henao',
        role: 'Creator / backend',
        projects: '8 proyectos',
        match: '+10',
      },
      {
        skillIcon: '/assets/programing-icons/nodejs.png',
        skillAlt: 'Skill icon de Node.js',
        coverImage: '/assets/cards-img/card-img-6.jpg',
        coverAlt: 'Perfil destacado de Node.js',
        title: 'Backend Node.js con 1.5 años de experiencia',
        avatar: '/assets/users-cards-icons/user6.jpg',
        avatarAlt: 'Foto de Andres.F David',
        name: 'Andres.F David',
        role: 'Creator / backend',
        projects: '30 proyectos',
        match: '+19',
      },
    ],
  },
  {
    id: 'carousel2',
    heading: '',
    subheading: 'Idiomas.',
    cards: [
      {
        skillIcon: '/assets/flags-cards-lenguajes/ingles-flag.png',
        skillAlt: 'Skill icon de inglés',
        coverImage: '/assets/card-lenguajes-img/ingles.jpg',
        coverAlt: 'Perfil destacado de inglés',
        title: 'Conocimientos en ingles nivel C1',
        avatar: '/assets/user-cardslenguajes-icons/user1-lenguajes.jpg',
        avatarAlt: 'Foto de Katerin.S Sanchez',
        name: 'Katerin.S Sanchez',
        role: 'Creator / Team Leader',
        projects: '12 proyectos',
        match: '+14',
      },
      {
        skillIcon: '/assets/flags-cards-lenguajes/frances-flag.png',
        skillAlt: 'Skill icon de francés',
        coverImage: '/assets/card-lenguajes-img/frances.jpg',
        coverAlt: 'Perfil destacado de francés',
        title: 'Conocimientos en Frances nivel B2',
        avatar: '/assets/user-cardslenguajes-icons/user2-lenguajes.jpg',
        avatarAlt: 'Foto de Martin.A Giraldo',
        name: 'Martin.A Giraldo',
        role: 'Creator / Teacher',
        projects: '11 proyectos',
        match: '+9',
      },
      {
        skillIcon: '/assets/flags-cards-lenguajes/portugues.flag.png',
        skillAlt: 'Skill icon de portugués',
        coverImage: '/assets/card-lenguajes-img/Gramática da Língua portuguesa.jpg',
        coverAlt: 'Perfil destacado de portugués',
        title: 'Estudiante de Portugues nivel A2',
        avatar: '/assets/user-cardslenguajes-icons/user3-lenguajes.jpg',
        avatarAlt: 'Foto de Maria.T Restrepo',
        name: 'Maria.T Restrepo',
        role: 'Creator / student',
        projects: '6 proyectos',
        match: '+5',
      },
      {
        skillIcon: '/assets/flags-cards-lenguajes/aleman-flag.png',
        skillAlt: 'Skill icon de alemán',
        coverImage: '/assets/card-lenguajes-img/aleman.jpg',
        coverAlt: 'Perfil destacado de alemán',
        title: 'Aprendiz de Aleman y Ruso en proceso para enseñar a otros',
        avatar: '/assets/user-cardslenguajes-icons/user4-lenguajes.jpg',
        avatarAlt: 'Foto de Elizabeth Cifuentes',
        name: 'Elizabeth Cifuentes',
        role: 'Creator / amateur',
        projects: '12 proyectos',
        match: '+8',
      },
      {
        skillIcon: '/assets/flags-cards-lenguajes/chino-flag.png',
        skillAlt: 'Skill icon de chino',
        coverImage: '/assets/card-lenguajes-img/chino.jpg',
        coverAlt: 'Perfil destacado de chino',
        title: 'Estudiante y maestra de Chino avanzado',
        avatar: '/assets/user-cardslenguajes-icons/user5-lenguajes.jpg',
        avatarAlt: 'Foto de Sofia.M Alvarez',
        name: 'Sofia.M Alvarez',
        role: 'Creator / Team Leader',
        projects: '27 proyectos',
        match: '+16',
      },
      {
        skillIcon: '/assets/flags-cards-lenguajes/italiano-flag.png',
        skillAlt: 'Skill icon de italiano',
        coverImage: '/assets/card-lenguajes-img/Learning Italian!!.jpg',
        coverAlt: 'Perfil destacado de italiano',
        title: 'Estudiante de Italiano con nivel b1 en tercer semestre de idiomas',
        avatar: '/assets/user-cardslenguajes-icons/user6-lenguajes.jpg',
        avatarAlt: 'Foto de Emmanuel Santamaria',
        name: 'Emmanuel Santamaria',
        role: 'Creator / student',
        projects: '27 proyectos',
        match: '+16',
      },
    ],
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
              <button class="icon-action" type="button" aria-label="Notificaciones">
                <ion-icon name="notifications-outline"></ion-icon>
              </button>
              <button class="icon-action" type="button" data-nav-profile aria-label="Ir al perfil">
                <ion-icon name="person-circle-outline"></ion-icon>
              </button>
              <span class="user-chip">${escapeHtml(profileLabel)}</span>
            </div>
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
                        : `Bienvenido ${escapeHtml(profileLabel)}, aquí podrás descubrir personas y experiencias maravillosas haciendo match entre ellas.`
                    }
                  </p>
                </div>
                <button type="button">Planes</button>
              </div>

              <section class="matches-chat-section" aria-label="Mis matches y chat">
                <div class="matches-panel">
                  <div class="matches-panel-header">
                    <h3>${isChatsView ? 'Conversaciones' : 'Mis Matches'}</h3>
                    <button id="btn-refresh-matches" class="matches-refresh-btn" type="button">
                      Actualizar
                    </button>
                  </div>
                  <p class="matches-panel-helper">
                    ${
                      isChatsView
                        ? 'Selecciona un chat para cargar historial y recibir mensajes nuevos en tiempo real.'
                        : 'Abre una conversación para ver historial y mensajes en tiempo real.'
                    }
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
                    <button id="chat-close-btn" type="button" class="chat-close-btn">
                      Cerrar
                    </button>
                  </header>

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
              </section>
            </div>
          </section>

          ${isChatsView ? '' : SWAP_SECTIONS.map((section) => renderSection(section)).join('')}
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

function renderSection(section) {
  const isFeedSection = section.id === 'carousel1';
  const sectionHeading = section.heading
    ? `<h2>${escapeHtml(section.heading)}</h2>`
    : '';
  const cardsMarkup = isFeedSection
    ? renderFeedLoadingCard()
    : section.cards.map((card) => renderCard(card)).join('');

  return `
    <section class="users-grid-section">
      <div class="section-header ${isFeedSection ? 'section-header--feed' : ''}">
        <div class="section-header-copy">
          ${sectionHeading}
          <h3>${escapeHtml(section.subheading)}</h3>
        </div>

        ${
          isFeedSection
            ? `<button id="btn-refresh-feed" class="matches-refresh-btn" type="button">
                Actualizar feed
              </button>`
            : ''
        }
      </div>

      ${
        isFeedSection
          ? '<div id="feed-status" class="matches-status feed-carousel-status is-muted" role="status"></div>'
          : ''
      }

      <div class="carousel" data-carousel="${escapeHtml(section.id)}">
        <button
          class="prev"
          type="button"
          aria-label="Ver perfiles anteriores de ${escapeHtml(section.subheading)}"
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
          aria-label="Ver perfiles siguientes de ${escapeHtml(section.subheading)}"
        >
          ›
        </button>
      </div>
    </section>
  `;
}

function renderCard(card) {
  return `
    <article class="nft-card">
      <div class="card-header">
        <div class="user-skill">
          <img src="${escapeHtml(card.skillIcon)}" alt="${escapeHtml(card.skillAlt)}" />
        </div>
        <button class="more-btn" type="button" aria-label="Más opciones">•••</button>
      </div>

      <div class="main-image">
        <img src="${escapeHtml(card.coverImage)}" alt="${escapeHtml(card.coverAlt)}" />
        <span class="badge">Destacado</span>
      </div>

      <div class="card-body">
        <h3>"${escapeHtml(card.title)}"</h3>

        <div class="creator">
          <img src="${escapeHtml(card.avatar)}" alt="${escapeHtml(card.avatarAlt)}" />
          <div>
            <p class="name">${escapeHtml(card.name)}</p>
            <p class="role">${escapeHtml(card.role)}</p>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <div class="projects-counter">
          <p>Proyectos</p>
          <strong>${escapeHtml(card.projects)}</strong>
        </div>
        <div class="match-counter">Match ${escapeHtml(card.match)}</div>
      </div>
    </article>
  `;
}

function renderFeedLoadingCard() {
  return `
    <article class="nft-card nft-card--feed-state">
      <p class="feed-card-empty-text">Cargando perfiles sugeridos...</p>
    </article>
  `;
}

function renderFeedEmptyCard() {
  return `
    <article class="nft-card nft-card--feed-state">
      <p class="feed-card-empty-text">
        No hay perfiles disponibles en tu feed por ahora.
      </p>
    </article>
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

  if (!options.isChatsView) {
    cleanups.push(setupSwapsCarousels());
  }

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
  const feedCardWrapper = document.querySelector(
    '.swaps-dashboard .carousel[data-carousel="carousel1"] .card-wrapper'
  );
  const chatContainer = document.getElementById('chat-container');
  const chatEmptyState = document.getElementById('chat-empty');
  const chatHeader = document.getElementById('chat-header');
  const chatRoomHelper = document.getElementById('chat-room-helper');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const closeChatButton = document.getElementById('chat-close-btn');

  if (
    !matchesList ||
    !matchesStatus ||
    !refreshMatchesButton ||
    !chatContainer ||
    !chatEmptyState ||
    !chatHeader ||
    !chatRoomHelper ||
    !chatMessages ||
    !chatForm ||
    !chatInput ||
    !closeChatButton
  ) {
    return () => {};
  }

  const hasFeedCarousel =
    Boolean(refreshFeedButton) && Boolean(feedStatus) && Boolean(feedCardWrapper);

  const cleanups = [];
  let disposed = false;
  let latestMatchesRequest = 0;
  let latestHistoryRequest = 0;
  let autoOpenDone = false;
  let rowCleanups = [];
  let feedActionCleanups = [];
  let feedQueue = [];
  let swipeInProgress = false;
  const avatarCache = new Map();

  const setMatchesStatus = (text, tone = 'muted') => {
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

    feedCardWrapper.querySelectorAll('.feed-swipe-btn').forEach((button) => {
      const hasTarget = Boolean(button.getAttribute('data-user-id'));
      button.disabled = disabled || !hasTarget;
    });
  };

  const cleanupFeedActions = () => {
    feedActionCleanups.forEach((cleanup) => cleanup());
    feedActionCleanups = [];
  };

  const renderFeedCarousel = () => {
    if (!hasFeedCarousel) return;

    cleanupFeedActions();

    if (feedQueue.length === 0) {
      feedCardWrapper.innerHTML = renderFeedEmptyCard();
      return;
    }

    feedCardWrapper.innerHTML = feedQueue
      .map((profile) => renderFeedSwipeCard(profile))
      .join('');

    feedCardWrapper.querySelectorAll('.feed-card-avatar').forEach((avatar) => {
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

        const avatar = feedCardWrapper.querySelector(
          `[data-feed-avatar-id="${profileId}"]`
        );
        if (avatar) {
          avatar.src = resolvedAvatar;
        }
      });
    });

    feedCardWrapper.querySelectorAll('.feed-swipe-btn').forEach((button) => {
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
    chatContainer.hidden = !show;
    chatEmptyState.hidden = show;
  };

  const markActiveMatch = (roomId) => {
    document.querySelectorAll('.match-item').forEach((item) => {
      const isActive = item.getAttribute('data-room-id') === String(roomId);
      item.classList.toggle('is-active', isActive);
    });
  };

  const paintMessage = (msg = {}) => {
    const text = String(msg.message || '').trim();
    if (!text) return;

    const senderId = msg.user_id !== undefined ? String(msg.user_id) : '';
    const isMine = state.userId !== null && senderId === state.userId;

    const historyEmpty = chatMessages.querySelector('.chat-history-empty');
    if (historyEmpty) {
      historyEmpty.remove();
    }

    const bubble = document.createElement('div');
    bubble.className = `chat-message ${isMine ? 'mensaje-mio' : 'mensaje-otro'}`;
    bubble.textContent = text;

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const sendMessage = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
      chatRoomHelper.textContent = 'La sala no está conectada todavía.';
      return;
    }

    const parsedUserId = Number.parseInt(state.userId, 10);
    const payload = {
      user_id: Number.isNaN(parsedUserId) ? state.userId : parsedUserId,
      message: text,
    };

    state.socket.send(JSON.stringify(payload));
    chatInput.value = '';
  };

  const clearChat = () => {
    state.activeRoomId = null;
    closeSocket();
    markActiveMatch(null);
    showChat(false);
    chatMessages.innerHTML = '';
    chatHeader.textContent = 'Chat';
    chatRoomHelper.textContent = 'Selecciona una conversación para empezar.';
  };

  const openChat = async (match) => {
    const roomId = match?.room_id;
    if (!roomId) {
      chatRoomHelper.textContent = 'Este match todavía no tiene sala disponible.';
      return;
    }

    state.activeRoomId = String(roomId);
    latestHistoryRequest += 1;
    const historyRequestId = latestHistoryRequest;

    closeSocket();
    markActiveMatch(roomId);
    showChat(true);
    chatMessages.innerHTML = '';

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
          paintMessage(message);
        } catch {
          // Ignore malformed websocket events.
        }
      };

      socket.onerror = () => {
        if (disposed || state.socket !== socket) return;
        chatRoomHelper.textContent =
          'La conexión del chat tuvo un problema. Reintenta abrir la sala.';
      };

      socket.onclose = () => {
        if (disposed || state.socket !== socket) return;
        state.socket = null;
        chatRoomHelper.textContent = 'Chat desconectado.';
      };
    } catch {
      chatRoomHelper.textContent = 'No se pudo abrir la conexión en tiempo real.';
    }
  };

  const loadMatches = async () => {
    latestMatchesRequest += 1;
    const requestId = latestMatchesRequest;

    cleanupRows();

    if (!state.userId) {
      setMatchesStatus('No se encontró el identificador del usuario actual.', 'error');
      return;
    }

    setMatchesStatus('Cargando tus matches...', 'muted');

    try {
      const payload = await getMatches(state.userId);
      if (disposed || requestId !== latestMatchesRequest) return;

      const matches = normalizeMatchesPayload(payload);
      if (matches.length === 0) {
        setMatchesStatus('Aún no tienes matches disponibles.', 'muted');

        const emptyMatches = document.createElement('p');
        emptyMatches.className = 'matches-empty-state';
        emptyMatches.textContent =
          'Cuando haya coincidencias nuevas, aparecerán aquí para iniciar chat.';
        matchesList.appendChild(emptyMatches);
        return;
      }

      setMatchesStatus(
        `${matches.length} ${matches.length === 1 ? 'match cargado' : 'matches cargados'}.`,
        'success'
      );

      matches.forEach((match) => {
        const roomId = match?.room_id;
        const fullName = [match?.first_name, match?.last_name]
          .filter(Boolean)
          .join(' ')
          .trim();

        const wrapper = document.createElement('article');
        wrapper.className = 'match-item';
        if (roomId !== undefined && roomId !== null) {
          wrapper.setAttribute('data-room-id', String(roomId));
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
          const roomId = match?.room_id;
          return roomId !== undefined && roomId !== null && roomId !== '';
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

    if (!state.userId) {
      setFeedStatus('No se encontró el usuario actual para cargar feed.', 'error');
      feedQueue = [];
      renderFeedCarousel();
      return;
    }

    setFeedStatus('Cargando perfiles sugeridos...', 'muted');

    try {
      const payload = await getFeed(state.userId);
      if (disposed) return;

      const feedProfiles = normalizeFeedPayload(payload).filter((profile) => {
        const candidateId = getFeedProfileId(profile);
        if (!candidateId) return false;

        return String(candidateId) !== String(state.userId);
      });

      feedQueue = feedProfiles;

      if (feedQueue.length === 0) {
        setFeedStatus('No hay perfiles disponibles en tu feed por ahora.', 'muted');
        renderFeedCarousel();
        return;
      }

      renderFeedCarousel();
      setFeedStatus(
        `${feedQueue.length} ${feedQueue.length === 1 ? 'perfil disponible' : 'perfiles disponibles'} para swipe.`,
        'success'
      );
    } catch (error) {
      if (disposed) return;

      setFeedStatus(error?.message || 'No se pudo cargar el feed de perfiles.', 'error');
      feedQueue = [];
      renderFeedCarousel();
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

    if (!profile || !userToId || !state.userId) {
      setFeedStatus('No hay perfil disponible para registrar swipe.', 'error');
      return;
    }

    swipeInProgress = true;
    setFeedButtonsDisabled(true);
    setFeedStatus(action === 'like' ? 'Enviando like...' : 'Enviando pass...', 'muted');

    try {
      const response = await sendSwipe(state.userId, userToId, action);
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

      renderFeedCarousel();

      if (feedQueue.length === 0) {
        setFeedStatus('No hay más perfiles en el feed. Usa actualizar feed.', 'muted');
      }

      if (action === 'like') {
        await loadMatches();
      }
    } catch (error) {
      if (disposed) return;

      if (action === 'pass') {
        feedQueue = feedQueue.filter((candidate) => {
          return String(getFeedProfileId(candidate)) !== String(userToId);
        });

        renderFeedCarousel();

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

  refreshMatchesButton.addEventListener('click', onRefreshMatches);
  chatForm.addEventListener('submit', onChatSubmit);
  closeChatButton.addEventListener('click', onCloseChat);

  if (hasFeedCarousel) {
    refreshFeedButton.addEventListener('click', onRefreshFeed);

    cleanups.push(() => {
      refreshFeedButton.removeEventListener('click', onRefreshFeed);
    });
  }

  cleanups.push(() => {
    refreshMatchesButton.removeEventListener('click', onRefreshMatches);
    chatForm.removeEventListener('submit', onChatSubmit);
    closeChatButton.removeEventListener('click', onCloseChat);
  });

  loadMatches();

  if (hasFeedCarousel) {
    loadFeed();
  }

  return () => {
    disposed = true;
    cleanupRows();
    cleanupFeedActions();
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

function normalizeSkillList(skills) {
  if (Array.isArray(skills)) {
    return skills
      .map((skill) => String(skill || '').trim())
      .filter(Boolean)
      .slice(0, 5);
  }

  if (typeof skills === 'string' && skills.trim()) {
    return skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 5);
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
  const wsBase = import.meta.env.VITE_WS_URL;
  if (wsBase) {
    return `${wsBase.replace(/\/$/, '')}/ws/chat/${roomId}`;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    try {
      const parsed = new URL(apiUrl);
      const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${parsed.host}/ws/chat/${roomId}`;
    } catch {
      // Fall through to default websocket URL.
    }
  }

  return `wss://learning-swap-backend.onrender.com/ws/chat/${roomId}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
