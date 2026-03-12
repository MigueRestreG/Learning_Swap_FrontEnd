import {
  getNavbar,
  setupNavbarAuthActions,
  setupNavbarSectionLinks,
} from '../components/navbar.js';

export function HomePage(initialSectionId = null) {
  const app = document.getElementById('app');

  // Remove auth-page class from body
  document.body.classList.remove('auth-page', 'register-mode');

  // Limpieza SPA: evita duplicar listeners al re-render
  if (window.__homeCleanup) {
    window.__homeCleanup();
    window.__homeCleanup = null;
  }

  if (window.__homeScrollHandler) {
    window.removeEventListener('scroll', window.__homeScrollHandler);
    window.__homeScrollHandler = null;
  }

  app.innerHTML = `
    <section class="home">

      <!-- NAVBAR -->
      ${getNavbar(false)}

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
          <img class="logo-navbar" src="./assets/homeBanner.png" alt="portada" />
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

      
      <!-- PRICING/ MEMbERSHIPS SECTION -->
      <section class="prices card" id="prices">
      <!--<h2 class="prices-title">Learning Swap Membresias</h2>-->
    <!--CARDS CONTAINERr-->
        
        <article class="card-content-free">
            <div class="card-logo">
              <img src="./assets/logos/free.png" alt="logo de plan">
            </div>

              <!--free suscription-->
            <div class="card-price-box">
                <h3 class="card-tittle-free">Gratis</h3>
                <p class="card-price">$0</p>
                <p class="card-price-description">Plan gratuito</p>
            </div>
            <div class="card-bennefits-box">
                <ul class="card-list">
                   
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>1 intercambio por mes.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Apoyo de IA limitado.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Quiz semipersonalizado.</p>
                    </li>
                     
                </ul>
                <button class="card-button-free">Escoger Plan</button>
                
            </div>
        </article>


        <!--emerald suscription-->
        <article class="card-content-emerald">
            <div class="card-logo">
                <img src="./assets/logos/emerald.png" alt="">
            </div>
            <div class="card-price-box">
                <h3 class="card-tittle-emerald">Emerald</h3>
                <p class="card-price">$12.000<sup>/ mes</sup></p>
                <p class="card-price-description">Plan básico</p>
            </div>
            <div class="card-bennefits-box">
                <ul class="card-list">
                   
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>3 intercambios por mes.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Ayuda de IA ilimitada.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Quiz personalizado.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Historial de aprendizaje. </p>
                    </li>
                </ul>
                <button class="card-button-emerald">Escoger plan</button>
                
            </div>
        </article>

                <!--ruby suscription-->
        <article class="card-content-ruby">
            <div class="card-logo">
                <img src="./assets/logos/ruby.png" alt="logo">
            </div>
            <div class="card-price-box">
                <h3 class="card-tittle-ruby">Ruby</h3>
                <p class="card-price">$25.000<sup>/ mes</sup></p>
                <p class="card-price-description">Plan mejorado</p>
            </div>
            <div class="card-bennefits-box">
                <ul class="card-list">
                 
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>7 intercambios por mes</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Ayuda de IA ilimitada</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Quiz personalizado</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Recomendaciones inteligentes y personalizadas.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Acceso a grupos privados de aprendizaje.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Insignia de reputación.</p>
                    </li>
                </ul>
                <button class="card-button-ruby">Escoger Plan</button>
                
            </div>
        </article>


                        <!--diamod suscription-->
        <article class="card-content-diamond">
            <div class="card-logo">
              <img src="./assets/logos/diamond.png" alt="logo de plan">
            </div>
            <div class="card-price-box">
                <h3 class="card-tittle-diamond">Diamond</h3>
                <p class="card-price">$35.000<sup>/ mes</sup></p>
                <p class="card-price-description">Plan completo</p>
            </div>
            <div class="card-bennefits-box">
                <ul class="card-list">
                   
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>12 intercambios por mes.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Ayuda de IA ilimitada.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Quiz personalizado.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Recomendaciones inteligentes y personalizadas.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Acceso a grupos privados de aprendizaje.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Insignia de reputación.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Certificado digital de aprendizaje.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Recomendaciones inteligentes de intercambios.</p>
                    </li>
                        <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Posibilidad de monetizar su contenido a futuro.</p>
                    </li>
                    </li>
                </ul>
                <button class="card-button-diamond">Escoger Plan</button>
                
            </div>
        </article>
    </section>

      <!-- ESCENA 5 -->
      <section class="cta" id="cta">
        <h2>¿Listo para empezar a intercambiar conocimiento?</h2>
        <button class="btn primary" id="btnCreateAccount">Crea tu cuenta</button>
      </section>

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

  navLinks.forEach((link) => {
    link.addEventListener('click', onNavLinkClick);
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
  };
}
