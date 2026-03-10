/**
 * Unit tests — horizontal scroll progress calculation
 * Testing pure math from horizontalScroll.js.
 */
import { describe, it, expect } from 'vitest';

/**
 * Calculate scroll progress percentage.
 * Mirrors: wrapper.scrollLeft / max * 100
 */
function calcScrollProgress(scrollLeft, scrollWidth, clientWidth) {
  const max = scrollWidth - clientWidth;
  if (max <= 0) return 0;
  return (scrollLeft / max) * 100;
}

// ─────────────────────────────────────────────────────────────────────────────

describe('calcScrollProgress', () => {
  it('returns 0% at start', () => {
    expect(calcScrollProgress(0, 1200, 400)).toBe(0);
  });

  it('returns 100% at end', () => {
    expect(calcScrollProgress(800, 1200, 400)).toBe(100);
  });

  it('returns 50% at midpoint', () => {
    expect(calcScrollProgress(400, 1200, 400)).toBe(50);
  });

  it('returns 0 when content does not overflow', () => {
    expect(calcScrollProgress(0, 400, 400)).toBe(0);
  });

  it('returns 0 when scrollWidth < clientWidth', () => {
    expect(calcScrollProgress(0, 300, 400)).toBe(0);
  });

  it('does not exceed 100 when scrolled to exact max', () => {
    // max = scrollWidth - clientWidth = 1200 - 400 = 800
    expect(calcScrollProgress(800, 1200, 400)).toBeLessThanOrEqual(100);
  });

  it('is proportional', () => {
    const p1 = calcScrollProgress(200, 1200, 400);
    const p2 = calcScrollProgress(400, 1200, 400);
    expect(p2).toBeCloseTo(p1 * 2);
  });
});
