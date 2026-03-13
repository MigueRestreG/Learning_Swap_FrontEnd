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
    <main class="home">

      <!-- NAVBAR -->
      <header class="navbar">
        <div class="navbar-container">
          <a class="navbar-brand" href="/" data-link>
            <img class="navbar-logo" src="/assets/icons/logo.svg" alt="Learning Swap Exchange" />
            <span>Learning Swap</span>
          </a>

          <nav class="navbar-links">
            <a href="#why" class="nav-link">Why us</a>
            <a href="#how" class="nav-link">How it works</a>
            <a href="#features" class="nav-link">Features</a>
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
              <strong>10K+</strong>
              <span>Learners</span>
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
    LoginPage();
  };
  const goSignup = async () => {
    const { LoginPage } = await import('./login.js');
    LoginPage();
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
