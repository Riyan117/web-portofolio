import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 1,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile',   use: { ...devices['iPhone 13'] } },
  ],

  // Start Docker container before running e2e (optional)
  // webServer: {
  //   command: 'docker compose up',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: true,
  // },
});
