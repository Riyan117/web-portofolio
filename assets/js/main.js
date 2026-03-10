/**
 * main.js — Entry point
 * GSAP & ScrollTrigger are loaded via CDN <script> tags in index.html
 * and available as globals (window.gsap, window.ScrollTrigger).
 */
import { initCursor }                                    from './modules/cursor.js';
import { initNavbar }                                    from './modules/navbar.js';
import { initHero }                                      from './modules/hero.js';
import { initParallax }                                  from './modules/parallax.js';
import { initScrollReveal, initSmoothAnchors, initCounters } from './modules/scrollReveal.js';
import { initHorizontalScroll }                          from './modules/horizontalScroll.js';

gsap.registerPlugin(ScrollTrigger);

// ── Scroll progress bar ────────────────────────────────────
const progressBar = document.getElementById('scrollProgress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

// ── Magnetic buttons ──────────────────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left  - rect.width  / 2) * 0.28;
      const y = (e.clientY - rect.top   - rect.height / 2) * 0.28;
      gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
    });
  });
}

// ── Init modules ────────────────────────────────────────────────────────────
initCursor();
initNavbar();
initHero();
initParallax();
initHorizontalScroll();
initScrollReveal();
initSmoothAnchors();
initCounters();
