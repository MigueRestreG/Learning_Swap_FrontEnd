export function HomePage() {
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
      <header class="navbar">
        <div class="navbar-container">
          <a class="navbar-brand" href="/" data-link>
            <img class="navbar-logo" src="/assets/logos/logo.png"  alt="Learning Swap Exchange" />
            <span>Learning Swap</span>
          </a>

          <nav class="navbar-links">
            <a href="#why" class="nav-link">Why us</a>
            <a href="#how" class="nav-link">How it works</a>
            <a href="#features" class="nav-link">Features</a>
            <a href="#prices" class="nav-link">Pricing</a>
            <a href="#cta" class="nav-link">Get started</a>
          </nav>

          <div class="navbar-actions">
            <button class="btn secondary" id="btnLogin">Log in</button>
            <button class="btn primary" id="btnSignup">Create account</button>
          </div>

          <button
            class="navbar-burger"
            id="navToggle"
            aria-label="Toggle menu"
            aria-expanded="false"
            aria-controls="navMobile"
          >
            <span></span><span></span><span></span>
          </button>
        </div>

        <div class="navbar-mobile" id="navMobile">
          <a href="#how" class="nav-link">How it works</a>
          <a href="#features" class="nav-link">Features</a>
          <a href="#prices" class="nav-link">Pricing</a>
          <a href="#why" class="nav-link">Why us</a>
          <a href="#cta" class="nav-link">Get started</a>
          <div class="navbar-mobile-actions">
            <button class="btn secondary" id="btnLoginMobile">Log in</button>
            <button class="btn primary" id="btnSignupMobile">Create account</button>
          </div>
        </div>
      </header>

      <!-- ESCENA 1: HERO -->
      <section class="hero" id="hero">
        <div class="hero-content">
          <h1>Share Knowledge, Not Identity.</h1>

          <p class="hero-description">
            Join a global community where people exchange skills in complete privacy.
            Teach what you know, learn what you love — with real-time translation
            breaking every barrier.
          </p>

          <div class="hero-actions">
            <button class="btn primary" id="btnStartLearning">Start Learning</button>
            <button class="btn secondary" id="btnExploreSkills">Explore Skills</button>
          </div>

          <div class="hero-stats">
            <div>
              <strong>+1</strong>
              <span>Match</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>Languages</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Private</span>
            </div>
          </div>
        </div>
      <div class="hero-banner">
          <img class="logo-navbar" src="./assets/homeBanner.png" alt="banner" />
          </div>
      </section>

      <!-- ESCENA 2 -->
      <section class="why" id="why">
        <h2>Why Learning Swap Exchange?</h2>
        <p class="section-description">
          A new way to learn by connecting people through shared knowledge.
        </p>

        <div class="why-cards">
          <div class="card">
            <h3>Skill Exchange</h3>
            <p>Share what you know and learn what you need from real people.</p>
          </div>

          <div class="card">
            <h3>Community Driven</h3>
            <p>Learn together through collaboration, mentoring, and feedback.</p>
          </div>

          <div class="card">
            <h3>Growth Focused</h3>
            <p>Build practical skills that help you grow personally and professionally.</p>
          </div>
        </div>
      </section>

      <!-- ESCENA 3 -->
      <section class="how" id="how">
        <h2>How It Works</h2>

        <div class="steps">
          <div class="step">
            <span>1</span>
            <h4>Create your profile</h4>
            <p>Tell others what you can teach and what you want to learn.</p>
          </div>

          <div class="step">
            <span>2</span>
            <h4>Offer or request skills</h4>
            <p>Find people who match your learning goals.</p>
          </div>

          <div class="step">
            <span>3</span>
            <h4>Connect and learn</h4>
            <p>Exchange knowledge through sessions and collaboration.</p>
          </div>
        </div>
      </section>

      <!-- ESCENA 4 -->
      <section class="features" id="features">
        <h2>Platform Features</h2>

        <ul class="features-list">
          <li>Skill matching system</li>
          <li>Learning sessions and mentoring</li>
          <li>Feedback and reputation</li>
          <li>Community interaction</li>
        </ul>
      </section>

      
      <!-- PRICING/ MEMbERSHIPS SECTION -->
      <section class="prices card" id="prices">
      <!--<h2 class="prices-title">Learning Swap Membresias</h2>-->
    <!--CARDS CONTAINERr-->
        
        <article class="card-content-free">
            <div class="card-logo">
                <img src="./assets/logos/free.png" alt="card logo">
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
                        <p>1 match por mes.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Apoyo de IA limitado.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Quizz semi-personalizado.</p>
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
                <p class="card-price-description">Plan basico</p>
            </div>
            <div class="card-bennefits-box">
                <ul class="card-list">
                   
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>3 match por mes.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Ayuda de IA ilimitado.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Quizz personalizado.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Historial de aprendizaje. </p>
                    </li>
                </ul>
                <button class="card-button-emerald">Escoger Plan.</button>
                
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
                        <p>7 match por mes</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Ayuda de IA ilimitado</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Quizz personalizado</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Recomendaciones inteligentes y personalizadas.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Acceso a grupos privados de apredizaje.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Insignia de reputacion.</p>
                    </li>
                </ul>
                <button class="card-button-ruby">Escoger Plan</button>
                
            </div>
        </article>


                        <!--diamod suscription-->
        <article class="card-content-diamond">
            <div class="card-logo">
                <img src="./assets/logos/diamond.png" alt="card logo">
            </div>
            <div class="card-price-box">
                <h3 class="card-tittle-diamond">Diamond</h3>
                <p class="card-price">$35.000<sup>/ mes</sup></p>
                <p class="card-price-description">Full plan</p>
            </div>
            <div class="card-bennefits-box">
                <ul class="card-list">
                   
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>12 match por mes.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Ayuda de IA ilimitado.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Quizz personalizado.</p>
                    </li>
                     <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Recomendaciones inteligentes y personalizadas.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Acceso a grupos privados de apredizaje.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Insignia de reputacion.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Certificado digital de aprendizaje.</p>
                    </li>
                    <li>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <p>Recomendaciones inteligentes de match.</p>
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
        <h2>Ready to start exchanging knowledge?</h2>
        <button class="btn primary" id="btnCreateAccount">Create your account</button>
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

  let currentScene = Math.max(
    0,
    Math.min(scenes.length - 1, Math.round(window.scrollY / window.innerHeight))
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
