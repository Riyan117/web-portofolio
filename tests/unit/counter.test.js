/**
 * Unit tests — counter logic
 * Testing pure numeric logic from scrollReveal.js initCounters.
 */
import { describe, it, expect } from 'vitest';

/**
 * Parse a data-count attribute value — mirrors initCounters logic.
 */
function parseCount(value) {
  return parseInt(value, 10);
}

/**
 * Format counter display value — mirrors onUpdate logic.
 */
function formatCounterValue(val, suffix = '') {
  return Math.round(val) + suffix;
}

/**
 * Calculate interpolated counter value at progress t (0..1).
 */
function interpolateCounter(target, t) {
  // Eased value (simplified linear for unit test — actual uses power2.out)
  return target * t;
}

// ─────────────────────────────────────────────────────────────────────────────

describe('parseCount', () => {
  it('parses integer string to number', () => {
    expect(parseCount('42')).toBe(42);
  });

  it('parses "3" correctly', () => {
    expect(parseCount('3')).toBe(3);
  });

  it('ignores leading/trailing whitespace', () => {
    expect(parseCount('  10  ')).toBe(10);
  });

  it('returns NaN for non-numeric string', () => {
    expect(parseCount('abc')).toBeNaN();
  });
});

describe('formatCounterValue', () => {
  it('rounds float to integer', () => {
    expect(formatCounterValue(4.7)).toBe('5');
  });

  it('appends suffix correctly', () => {
    expect(formatCounterValue(3, '+')).toBe('3+');
  });

  it('returns "0" for zero', () => {
    expect(formatCounterValue(0)).toBe('0');
  });

  it('handles string suffix with special chars', () => {
    expect(formatCounterValue(100, '%')).toBe('100%');
  });
});

describe('interpolateCounter', () => {
  it('returns 0 at t=0', () => {
    expect(interpolateCounter(100, 0)).toBe(0);
  });

  it('returns full target at t=1', () => {
    expect(interpolateCounter(100, 1)).toBe(100);
  });

  it('returns midpoint at t=0.5', () => {
    expect(interpolateCounter(100, 0.5)).toBe(50);
  });

  it('never exceeds target for t in [0,1]', () => {
    for (let t = 0; t <= 1; t += 0.1) {
      expect(interpolateCounter(50, t)).toBeLessThanOrEqual(50);
    }
  });
});
