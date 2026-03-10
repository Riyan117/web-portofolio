/**
 * Unit tests — hero.utils
 * Testing pure logic extracted from hero.js (no DOM, no GSAP).
 */
import { describe, it, expect } from 'vitest';

// ── Pure functions (extracted logic, tested in isolation) ──────────────────

/**
 * Build HTML spans from a string — mirrors hero.js logic.
 */
function buildCharSpans(text) {
  return text.split('').map(ch =>
    ch === ' '
      ? `<span class="h-char">&nbsp;</span>`
      : `<span class="h-char">${ch}</span>`
  ).join('');
}

/**
 * Calculate wave glow animation-delay for a character.
 * Formula: 2.5 + lineIdx * 0.4 + charIdx * waveStagger
 */
function calcWaveDelay(lineIdx, charIdx, waveStagger = 0.08) {
  return 2.5 + lineIdx * 0.4 + charIdx * waveStagger;
}

// ─────────────────────────────────────────────────────────────────────────────

describe('buildCharSpans', () => {
  it('wraps each non-space character in an h-char span', () => {
    const result = buildCharSpans('Hi');
    expect(result).toBe(
      '<span class="h-char">H</span><span class="h-char">i</span>'
    );
  });

  it('replaces space with &nbsp; span', () => {
    const result = buildCharSpans('A B');
    expect(result).toContain('<span class="h-char">&nbsp;</span>');
  });

  it('produces correct span count matching string length', () => {
    const text = 'Full Stack';
    const matches = buildCharSpans(text).match(/h-char/g) || [];
    expect(matches.length).toBe(text.length);
  });

  it('handles empty string', () => {
    expect(buildCharSpans('')).toBe('');
  });

  it('handles string with only spaces', () => {
    const result = buildCharSpans('   ');
    const matches = result.match(/&nbsp;/g) || [];
    expect(matches.length).toBe(3);
  });
});

describe('calcWaveDelay', () => {
  it('returns base delay 2.5 for first char of first line', () => {
    expect(calcWaveDelay(0, 0)).toBeCloseTo(2.5);
  });

  it('adds 0.08 per character on same line', () => {
    expect(calcWaveDelay(0, 5)).toBeCloseTo(2.5 + 5 * 0.08);
  });

  it('adds 0.4 per line index', () => {
    expect(calcWaveDelay(1, 0)).toBeCloseTo(2.9);
    expect(calcWaveDelay(2, 0)).toBeCloseTo(3.3);
  });

  it('combines line and char offsets correctly', () => {
    // Line 2, char 3: 2.5 + 2*0.4 + 3*0.08 = 2.5 + 0.8 + 0.24 = 3.54
    expect(calcWaveDelay(2, 3)).toBeCloseTo(3.54);
  });

  it('respects custom waveStagger value', () => {
    expect(calcWaveDelay(0, 4, 0.05)).toBeCloseTo(2.5 + 4 * 0.05);
  });

  it('delay always increases as charIdx increases', () => {
    const delays = [0, 1, 2, 3, 4].map(i => calcWaveDelay(0, i));
    for (let i = 1; i < delays.length; i++) {
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
    }
  });

  it('line 2 always has higher delay than line 0 at same char', () => {
    expect(calcWaveDelay(2, 3)).toBeGreaterThan(calcWaveDelay(0, 3));
  });
});
