import { getCurrentUser, isAuthenticated } from '../utils/auth.js';

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

export async function SwapsPage() {
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
  window.history.replaceState(null, '', '#swaps');
  window.scrollTo({ top: 0, behavior: 'auto' });

  const user = getCurrentUser();
  const profileLabel = user?.first_name || user?.name || 'Learning Swap';

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
                <button class="nav-menu-link is-disabled" type="button" disabled>
                  <ion-icon name="chatbubbles-outline"></ion-icon>
                  <span>Chats</span>
                </button>
              </li>
              <li>
                <button class="nav-menu-link is-active" type="button" aria-current="page">
                  <ion-icon name="people-circle-outline"></ion-icon>
                  <span>Matchs</span>
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
                  <h2>¡Hola!, bienvenido al tablero de matches</h2>
                  <p>
                    Bienvenido ${escapeHtml(profileLabel)}, aquí podrás descubrir personas y experiencias maravillosas haciendo match entre ellas.
                  </p>
                </div>
                <button type="button">Planes</button>
              </div>
            </div>
          </section>

          ${SWAP_SECTIONS.map((section) => renderSection(section)).join('')}
        </section>
      </div>
    </main>
  `;

  window.__swapsCleanup = setupSwapsInteractions();
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
  return `
    <section class="users-grid-section">
      <div class="section-header">
        ${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ''}
        <h3>${escapeHtml(section.subheading)}</h3>
      </div>

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
            ${section.cards.map((card) => renderCard(card)).join('')}
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

function setupSwapsInteractions() {
  const cleanups = [];

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
  cleanups.push(setupSwapsCarousels());

  return () => {
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

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
