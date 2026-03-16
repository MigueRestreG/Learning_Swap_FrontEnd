import { getCurrentUser, getCurrentUserId, isAuthenticated } from '../utils/auth.js';
import { renderFeedLoadingState } from './swaps/feed-render.js';
import { setupMatchesChat } from './swaps/matches-chat.js';
import { escapeHtml } from './swaps/ui-utils.js';

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
                            id="chat-file-input"
                            class="chat-file-input"
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp,.mp3,.ogg,.wav,.webm"
                          />
                          <button id="chat-file-btn" class="chat-file-btn" type="button">
                            Adjuntar
                          </button>
                          <button id="chat-record-btn" class="chat-record-btn" type="button">
                            Grabar
                          </button>
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
