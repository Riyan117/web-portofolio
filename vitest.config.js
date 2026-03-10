import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Unit tests: Node environment (no DOM)
    // Integration tests: jsdom (simulate browser DOM)
    // E2E tests are Playwright — excluded here, run via: npm run test:e2e
    include: ['tests/unit/**/*.test.js', 'tests/integration/**/*.test.js'],
    environment: 'node',
    environmentMatchGlobs: [
      ['tests/integration/**', 'jsdom'],
    ],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['assets/js/**/*.js'],
      exclude: ['assets/js/main.js'],
    },
  },
});
