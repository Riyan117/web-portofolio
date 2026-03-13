/**
 * main.js — Entry point
 * GSAP & ScrollTrigger are loaded via CDN <script> tags in index.html
 * and available as globals (window.gsap, window.ScrollTrigger).
 */
import { initCursor }                                    from './modules/cursor.js?v=20260313w';
import { initNavbar }                                    from './modules/navbar.js?v=20260313w';
import { initHero }                                      from './modules/hero.js?v=20260313w';
import { initParallax }                                  from './modules/parallax.js?v=20260313w';
import { initScrollReveal, initSmoothAnchors, initCounters } from './modules/scrollReveal.js?v=20260313w';
import { initHorizontalScroll }                          from './modules/horizontalScroll.js?v=20260313w';

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

// ── Init modules (fault-tolerant) ───────────────────────────────────────────
const initStatus = {};
const safeInit = (name, fn) => {
  try {
    fn();
    initStatus[name] = 'ok';
  } catch (error) {
    initStatus[name] = 'error';
    console.error(`[init:${name}]`, error);
  }
};

safeInit('cursor', initCursor);
safeInit('navbar', initNavbar);
safeInit('hero', initHero);
safeInit('parallax', initParallax);
safeInit('horizontalScroll', initHorizontalScroll);
safeInit('scrollReveal', initScrollReveal);
safeInit('smoothAnchors', initSmoothAnchors);
safeInit('counters', initCounters);

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.__initStatus = initStatus;
}
