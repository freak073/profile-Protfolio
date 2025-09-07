/* =====================================================================
   Main JS – minimal progressive enhancement (no heavy frameworks)
   ===================================================================== */
(function() {
  const qs = sel => document.querySelector(sel);
  const navToggle = qs('#navToggle');
  const navMenu = qs('#navMenu');
  const themeToggle = qs('#themeToggle');
  const yearEl = qs('#year');

  // Current year in footer
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Open / close mobile nav
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.dataset.open = String(!expanded);
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        delete navMenu.dataset.open;
      }
    });

    // Close after navigation
    navMenu.addEventListener('click', e => {
      if (e.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        delete navMenu.dataset.open;
      }
    });
  }

  // Theme toggle (persist in localStorage)
  const root = document.documentElement;
  const THEME_KEY = 'pref-theme';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light') root.classList.add('light');

  if (themeToggle) {
    updateThemeBtn();
    themeToggle.addEventListener('click', () => {
      root.classList.toggle('light');
      localStorage.setItem(THEME_KEY, root.classList.contains('light') ? 'light' : 'dark');
      updateThemeBtn();
  // Notify any listeners (e.g., background animation) that theme changed
  document.dispatchEvent(new CustomEvent('themechange'));
    });
  }
  function updateThemeBtn() {
    themeToggle.textContent = root.classList.contains('light') ? '🌙' : '☀️';
  }

  // Intersection Observer for reveal animation (order fixed)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // Add reveal class FIRST, then observe each target
  const revealTargets = document.querySelectorAll('.section, .project-item, .note');
  revealTargets.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();
