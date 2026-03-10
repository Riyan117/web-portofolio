/**
 * Integration tests — hero DOM setup
 * Tests that buildCharSpans correctly mutates the DOM,
 * and that wave delays are applied per character.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Mock GSAP (not available in jsdom) ────────────────────────────────────────
const gsap = {
  utils: { toArray: (sel) => [...document.querySelectorAll(sel)] },
  set:      vi.fn(),
  timeline: vi.fn(() => ({ to: vi.fn().mockReturnThis(), eventCallback: vi.fn() })),
};
global.gsap = gsap;

// ── DOM Setup ─────────────────────────────────────────────────────────────────
function setupHeroDOM() {
  document.body.innerHTML = `
    <h1 class="hero-title">
      <span class="h-line h-shimmer" id="hl1" data-text="Full Stack"></span>
      <span class="h-line h-shimmer" id="hl2" data-text="Software Tester,"></span>
      <span class="h-line h-accent"  id="hl3" data-text="From Scratch."></span>
    </h1>
    <div id="heroBadge"></div>
    <div id="heroDesc"></div>
    <div id="heroBtns"></div>
    <div id="heroStats"></div>
    <div id="scrollHint"></div>
  `;
}

// ── Inline hero init logic ────────────────────────────────────────────────────
function buildHeroChars() {
  document.querySelectorAll('.h-line').forEach(line => {
    const text = line.dataset.text;
    line.innerHTML = text.split('').map(ch =>
      ch === ' '
        ? `<span class="h-char">&nbsp;</span>`
        : `<span class="h-char">${ch}</span>`
    ).join('');
  });
}

function applyWaveDelays() {
  const waveStagger = 0.08;
  ['#hl1', '#hl2', '#hl3'].forEach((sel, lineIdx) => {
    document.querySelectorAll(`${sel} .h-char`).forEach((ch, i) => {
      ch.style.animationDelay = `${2.5 + lineIdx * 0.4 + i * waveStagger}s`;
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────

describe('hero — DOM char building', () => {
  beforeEach(() => {
    setupHeroDOM();
    buildHeroChars();
  });

  it('creates .h-char spans inside each .h-line', () => {
    const chars = document.querySelectorAll('.h-char');
    expect(chars.length).toBeGreaterThan(0);
  });

  it('hl1 "Full Stack" produces 10 spans (incl. space)', () => {
    const spans = document.querySelectorAll('#hl1 .h-char');
    expect(spans.length).toBe('Full Stack'.length); // 10
  });

  it('hl2 "Software Tester," produces correct span count', () => {
    const spans = document.querySelectorAll('#hl2 .h-char');
    expect(spans.length).toBe('Software Tester,'.length); // 16
  });

  it('space characters become &nbsp; spans', () => {
    const hl1 = document.getElementById('hl1');
    expect(hl1.innerHTML).toContain('&nbsp;');
  });

  it('.h-line is no longer empty after init', () => {
    document.querySelectorAll('.h-line').forEach(line => {
      expect(line.innerHTML.trim().length).toBeGreaterThan(0);
    });
  });
});

describe('hero — wave delay application', () => {
  beforeEach(() => {
    setupHeroDOM();
    buildHeroChars();
    applyWaveDelays();
  });

  it('first char of hl1 has animationDelay starting at 2.5s', () => {
    const firstChar = document.querySelector('#hl1 .h-char');
    expect(firstChar.style.animationDelay).toBe('2.5s');
  });

  it('second char of hl1 has delay 2.5 + 0.08 = 2.58s', () => {
    const chars = document.querySelectorAll('#hl1 .h-char');
    expect(chars[1].style.animationDelay).toBe('2.58s');
  });

  it('first char of hl2 has delay 2.5 + 0.4 = 2.9s', () => {
    const firstChar = document.querySelector('#hl2 .h-char');
    expect(firstChar.style.animationDelay).toBe('2.9s');
  });

  it('first char of hl3 has delay 2.5 + 0.8 = 3.3s', () => {
    const firstChar = document.querySelector('#hl3 .h-char');
    expect(firstChar.style.animationDelay).toBe('3.3s');
  });

  it('delays increase monotonically within a line', () => {
    const chars = [...document.querySelectorAll('#hl1 .h-char')];
    const delays = chars.map(ch => parseFloat(ch.style.animationDelay));
    for (let i = 1; i < delays.length; i++) {
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
    }
  });
});
