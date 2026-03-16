import {
  getNavbar,
  setupNavbarAuthActions,
  setupNavbarSectionLinks,
} from '../components/navbar.js';

export function HomePage(initialSectionId = null) {
  const app = document.getElementById('app');
  const homeHash = initialSectionId ? `#${initialSectionId}` : '#home';

  window.history.replaceState(null, '', homeHash);

  // Remove auth-page class from body
  document.body.classList.remove(
    'auth-page',
    'register-mode',
    'profile-page',
    'swaps-page'
  );

  // Limpieza SPA: evita duplicar listeners al re-render
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

  app.innerHTML = `
    <section class="home">

      <!-- NAVBAR -->
      ${getNavbar()}

      <!-- ESCENA 1: HERO -->
      <section class="hero" id="hero">
        <div class="hero-content">
          <h1>Comparte conocimiento, no identidad.</h1>

          <p class="hero-description">
            Únete a una comunidad global donde las personas intercambian habilidades con total privacidad.
            Enseña lo que sabes, aprende lo que te apasiona — con traducción en tiempo real
            para romper cualquier barrera.
          </p>

          <div class="hero-actions">
            <button class="btn primary" id="btnStartLearning">Comenzar a aprender</button>
            <button class="btn secondary" id="btnExploreSkills">Explorar habilidades</button>
          </div>

          <div class="hero-stats">
            <div>
              <strong>+1</strong>
              <span>Coincidencia</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>Idiomas</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Privado</span>
            </div>
          </div>
        </div>
      <div class="hero-banner">
          <img class="logo-navbar" src="/assets/homeBanner.png" alt="portada" />
          </div>
      </section>

      <!-- ESCENA 2 -->
      <section class="why" id="why">
        <h2>¿Por qué Learning Swap?</h2>
        <p class="section-description">
          Una nueva forma de aprender conectando personas a través del conocimiento compartido.
        </p>

        <div class="why-cards">
          <div class="card">
            <h3>Intercambio de habilidades</h3>
            <p>Comparte lo que sabes y aprende lo que necesitas de personas reales.</p>
          </div>

          <div class="card">
            <h3>Impulsado por la comunidad</h3>
            <p>Aprende en conjunto mediante colaboración, mentoría y retroalimentación.</p>
          </div>

          <div class="card">
            <h3>Enfocado en el crecimiento</h3>
            <p>Desarrolla habilidades prácticas que te ayuden a crecer personal y profesionalmente.</p>
          </div>
        </div>
      </section>

      <!-- ESCENA 3 -->
      <section class="how" id="how">
        <h2>Cómo funciona</h2>

        <div class="steps">
          <div class="step">
            <span>1</span>
            <h4>Crea tu perfil</h4>
            <p>Cuéntales a otros qué puedes enseñar y qué quieres aprender.</p>
          </div>

          <div class="step">
            <span>2</span>
            <h4>Ofrece o solicita habilidades</h4>
            <p>Encuentra personas que coincidan con tus objetivos de aprendizaje.</p>
          </div>

          <div class="step">
            <span>3</span>
            <h4>Conecta y aprende</h4>
            <p>Intercambia conocimiento mediante sesiones y colaboración.</p>
          </div>
        </div>
      </section>

      <!-- ESCENA 4 -->
      <section class="features" id="features">
        <h2>Funciones de la plataforma</h2>

        <ul class="features-list">
          <li>Sistema de coincidencia de habilidades</li>
          <li>Sesiones de aprendizaje y mentoría</li>
          <li>Retroalimentación y reputación</li>
          <li>Interacción con la comunidad</li>
        </ul>
      </section>

      
     <!-- PRICING / MEMBERSHIPS SECTION -->
<section class="prices" id="prices">
  <div class="prices-scroll-area" aria-label="Planes de membresía">
    <div class="prices-cards-grid prices-cards-grid--4">

    <!-- Free plan -->
    <article class="prices-card">
      <div class="prices-card-top">
        <div class="prices-card-icon prices-card-icon--free">
          <ion-icon name="leaf-outline"></ion-icon>
        </div>
        <h3 class="prices-card-name">Gratis</h3>
        <p class="prices-card-desc">Empieza a conectar sin costo.</p>
      </div>
      <div class="prices-card-price-wrap">
        <span class="prices-amount">$0</span>
        <span class="prices-period">/ mes</span>
      </div>
      <ul class="prices-features">
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> 2 intercambio por mes</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Apoyo de IA limitado</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Quiz semipersonalizado</li>
        <li class="prices-feature--off"><ion-icon name="close-circle-outline"></ion-icon> Salas exclusivas</li>
        <li class="prices-feature--off"><ion-icon name="close-circle-outline"></ion-icon> Soporte prioritario</li>
      </ul>
      <button class="prices-cta-btn prices-cta-btn--ghost" type="button">Registrate para iniciar</button>
    </article>

    <!-- Emerald plan -->
    <article class="prices-card">
      <div class="prices-card-top">
        <div class="prices-card-icon prices-card-icon--emerald">
          <ion-icon name="flower-outline"></ion-icon>
        </div>
        <h3 class="prices-card-name">Emerald</h3>
        <p class="prices-card-desc">Da el primer paso hacia más conexiones.</p>
      </div>
      <div class="prices-card-price-wrap">
        <span class="prices-amount">$12.000</span>
        <span class="prices-period">/ mes</span>
      </div>
      <ul class="prices-features">
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> 3 intercambios por mes</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Ayuda de IA ilimitada</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Quiz personalizado</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Historial de aprendizaje</li>
        <li class="prices-feature--off"><ion-icon name="close-circle-outline"></ion-icon> Soporte prioritario</li>
      </ul>
      <button class="prices-cta-btn prices-cta-btn--emerald home-plan-btn" type="button" data-plan="Emerald">Registrate para iniciar</button>
    </article>

    <!-- Ruby plan (featured) -->
    <article class="prices-card prices-card--featured">
      <div class="prices-card-badge">Más popular</div>
      <div class="prices-card-top">
        <div class="prices-card-icon prices-card-icon--ruby">
          <ion-icon name="rose-outline"></ion-icon>
        </div>
        <h3 class="prices-card-name">Ruby</h3>
        <p class="prices-card-desc">Para quienes quieren crecer más rápido.</p>
      </div>
      <div class="prices-card-price-wrap">
        <span class="prices-amount">$25.000</span>
        <span class="prices-period">/ mes</span>
      </div>
      <ul class="prices-features">
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> 7 intercambios por mes</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Ayuda de IA ilimitada</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Recomendaciones inteligentes</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Grupos privados de aprendizaje</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Insignia de reputación</li>
      </ul>
      <button class="prices-cta-btn prices-cta-btn--primary home-plan-btn" type="button" data-plan="Ruby">Registrate para iniciar</button>
    </article>

    <!-- Diamond plan (elite) -->
    <article class="prices-card prices-card--elite">
      <div class="prices-card-top">
        <div class="prices-card-icon prices-card-icon--elite">
          <ion-icon name="diamond-outline"></ion-icon>
        </div>
        <h3 class="prices-card-name">Diamond</h3>
        <p class="prices-card-desc">La experiencia completa, sin límites.</p>
      </div>
      <div class="prices-card-price-wrap">
        <span class="prices-amount">$35.000</span>
        <span class="prices-period">/ mes</span>
      </div>
      <ul class="prices-features">
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Matches ilimitadoss</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Ayuda de IA ilimitada</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Certificado digital</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> soporte prioritario 24/7</li>
        <li><ion-icon name="checkmark-circle-outline"></ion-icon> Monetización de contenido</li>
      </ul>
      <button class="prices-cta-btn prices-cta-btn--elite home-plan-btn" type="button" data-plan="Diamond">Registrate para iniciar</button>
    </article>

    </div>
  </div>
</section>

      <!-- ESCENA 5 -->
      <section class="cta" id="cta">
        <h2>¿Listo para empezar a intercambiar conocimiento?</h2>
        <button class="btn primary" id="btnCreateAccount">Crea tu cuenta</button>
      </section>

      <p class="home-scroll-hint" aria-hidden="true">
        Desliza hacia abajo
        <ion-icon name="chevron-down-outline"></ion-icon>
      </p>

    </main>
  `;

  // =========================
  // NAV: Mobile menu toggle
  // =========================
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const navHeader = document.querySelector('.navbar');
  const scrollSpace = document.getElementById('scroll-space');
  const closeMobileMenu = () => {
    navMobile?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = navMobile?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });

  navMobile?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // =========================
  // Actions (placeholder)
  // =========================
  const goLogin = async () => {
    const { LoginPage } = await import('./login.js');
    LoginPage('login');
  };
  const goSignup = async () => {
    const { LoginPage } = await import('./login.js');
    LoginPage('register');
  };

  setupNavbarAuthActions();
  setupNavbarSectionLinks();

  document.getElementById('btnLogin')?.addEventListener('click', goLogin);
  document.getElementById('btnLoginMobile')?.addEventListener('click', goLogin);

  document.getElementById('btnSignup')?.addEventListener('click', goSignup);
  document
    .getElementById('btnSignupMobile')
    ?.addEventListener('click', goSignup);

  document
    .getElementById('btnCreateAccount')
    ?.addEventListener('click', goSignup);

  // =========================
  // SCROLL CINEMATOGRÁFICO
  // =========================
  const scenes = Array.from(document.querySelectorAll('.home section'));
  if (scenes.length) scenes[0].classList.add('active');

  if (scrollSpace) {
    scrollSpace.style.height = `${Math.max(scenes.length, 1) * 100}vh`;
  }

  const sceneIndexById = new Map(
    scenes.map((scene, index) => [scene.id, index])
  );

  const requestedScene = initialSectionId
    ? sceneIndexById.get(initialSectionId)
    : undefined;

  let currentScene =
    requestedScene !== undefined
      ? requestedScene
      : Math.max(
          0,
          Math.min(
            scenes.length - 1,
            Math.round(window.scrollY / window.innerHeight)
          )
        );
  const pricesScrollArea = document.querySelector('.prices-scroll-area');
  let isSceneTransitioning = false;
  let sceneTransitionTimer = null;

  const setActiveScene = (index) => {
    scenes.forEach((scene, sceneIndex) => {
      scene.classList.toggle('active', sceneIndex === index);
    });
  };

  const goToScene = (targetIndex, behavior = 'smooth') => {
    const safeIndex = Math.max(0, Math.min(scenes.length - 1, targetIndex));
    currentScene = safeIndex;
    window.scrollTo({
      top: safeIndex * window.innerHeight,
      behavior,
    });
    setActiveScene(safeIndex);
  };

  const transitionTo = (direction) => {
    if (isSceneTransitioning || !scenes.length) return;

    const nextScene = Math.max(
      0,
      Math.min(scenes.length - 1, currentScene + direction)
    );

    if (nextScene === currentScene) return;

    isSceneTransitioning = true;
    goToScene(nextScene);

    if (sceneTransitionTimer) clearTimeout(sceneTransitionTimer);
    sceneTransitionTimer = setTimeout(() => {
      isSceneTransitioning = false;
    }, 650);
  };

  const resolveWheelScrollableContainer = (target) => {
    if (!pricesScrollArea || !(target instanceof Element)) {
      return null;
    }

    const matchedContainer = target.closest('.prices-scroll-area');
    if (!matchedContainer) {
      return null;
    }

    if (pricesScrollArea.scrollHeight <= pricesScrollArea.clientHeight + 1) {
      return null;
    }

    return pricesScrollArea;
  };

  const canScrollContainerByDelta = (container, deltaY) => {
    if (!container || !deltaY) return false;

    if (deltaY > 0) {
      return container.scrollTop + container.clientHeight < container.scrollHeight - 1;
    }

    return container.scrollTop > 1;
  };

  const onScroll = () => {
    const index = Math.min(
      scenes.length - 1,
      Math.max(0, Math.round(window.scrollY / window.innerHeight))
    );

    currentScene = index;

    navHeader?.classList.toggle('scrolled', window.scrollY > 12);

    setActiveScene(index);
  };

  const onWheel = (event) => {
    if (Math.abs(event.deltaY) < 8) return;

    const scrollableContainer = resolveWheelScrollableContainer(event.target);
    if (canScrollContainerByDelta(scrollableContainer, event.deltaY)) {
      event.preventDefault();
      scrollableContainer.scrollTop += event.deltaY;
      return;
    }

    event.preventDefault();
    transitionTo(event.deltaY > 0 ? 1 : -1);
  };

  const onKeyDown = (event) => {
    const activeTag = document.activeElement?.tagName;
    if (
      activeTag === 'INPUT' ||
      activeTag === 'TEXTAREA' ||
      document.activeElement?.isContentEditable
    ) {
      return;
    }

    if (
      event.key === 'ArrowDown' ||
      event.key === 'PageDown' ||
      event.key === ' '
    ) {
      event.preventDefault();
      transitionTo(1);
    }

    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      transitionTo(-1);
    }
  };

  const onResize = () => {
    goToScene(currentScene, 'auto');
  };

  const onNavLinkClick = (event) => {
    const href = event.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;

    const targetId = href.slice(1);
    const targetIndex = sceneIndexById.get(targetId);
    if (targetIndex === undefined) return;

    event.preventDefault();
    closeMobileMenu();
    goToScene(targetIndex);
  };

  document.getElementById('btnStartLearning')?.addEventListener('click', () => {
    const targetIndex = sceneIndexById.get('cta');
    if (targetIndex !== undefined) goToScene(targetIndex);
  });

  document.getElementById('btnExploreSkills')?.addEventListener('click', () => {
    const targetIndex = sceneIndexById.get('features');
    if (targetIndex !== undefined) goToScene(targetIndex);
  });

  const navLinks = [
    ...document.querySelectorAll('.navbar-links .nav-link'),
    ...document.querySelectorAll('.navbar-mobile .nav-link'),
  ];
  const planPrices = {
    Emerald: '$12.000',
    Ruby: '$25.000',
    Diamond: '$35.000',
  };
  const homePlanButtons = Array.from(
    document.querySelectorAll('.home-plan-btn[data-plan]')
  );

  const onHomePlanClick = (event) => {
    const clickedButton = event.currentTarget;
    const plan = clickedButton?.getAttribute('data-plan');
    if (!plan) return;

    sessionStorage.setItem('checkout-plan', plan);
    sessionStorage.setItem('checkout-price', planPrices[plan] || '');
    sessionStorage.setItem('checkout-billing', 'monthly');
    window.location.hash = '#checkout';
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', onNavLinkClick);
  });

  homePlanButtons.forEach((button) => {
    button.addEventListener('click', onHomePlanClick);
  });

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', onResize);

  window.__homeScrollHandler = onScroll;
  window.addEventListener('scroll', onScroll);
  goToScene(currentScene, 'auto');
  onScroll(); // sincroniza al cargar

  window.__homeCleanup = () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);

    if (sceneTransitionTimer) {
      clearTimeout(sceneTransitionTimer);
      sceneTransitionTimer = null;
    }

    navLinks.forEach((link) => {
      link.removeEventListener('click', onNavLinkClick);
    });
    homePlanButtons.forEach((button) => {
      button.removeEventListener('click', onHomePlanClick);
    });
  };
}
