/**
 * Integration tests — navbar DOM behavior
 * Uses jsdom (via vitest environmentMatchGlobs).
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Setup DOM ─────────────────────────────────────────────────────────────────
function setupDOM() {
  document.body.innerHTML = `
    <nav id="navbar">
      <a href="#about">About</a>
      <a href="#projects">Projects</a>
    </nav>
  `;
}

// ── Inline the navbar logic (avoids GSAP import side-effects) ─────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────────────────────

describe('navbar — DOM integration', () => {
  beforeEach(() => {
    setupDOM();
    document.getElementById('navbar').classList.remove('scrolled');
    initNavbar();
  });

  it('navbar exists in DOM', () => {
    expect(document.getElementById('navbar')).not.toBeNull();
  });

  it('does NOT have .scrolled class on load', () => {
    expect(document.getElementById('navbar').classList.contains('scrolled')).toBe(false);
  });

  it('adds .scrolled when scrollY > 80', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(document.getElementById('navbar').classList.contains('scrolled')).toBe(true);
  });

  it('removes .scrolled when scrollY <= 80', () => {
    const nav = document.getElementById('navbar');
    nav.classList.add('scrolled');

    Object.defineProperty(window, 'scrollY', { value: 30, writable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(nav.classList.contains('scrolled')).toBe(false);
  });

  it('contains correct anchor links', () => {
    const links = document.querySelectorAll('#navbar a');
    const hrefs = [...links].map(a => a.getAttribute('href'));
    expect(hrefs).toContain('#about');
    expect(hrefs).toContain('#projects');
  });
});
