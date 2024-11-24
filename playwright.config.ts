import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html', { 
      open: 'always', // open after execution or 'never
      outputDir: 'test-results'
    }]
  ],
  projects: [
    {
      name: 'UI Tests - Chrome',
      testDir: './tests/loan-calc-ui',
      timeout: 30 * 1000,
      retries: 1,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://taotlus.bigbank.ee',
        headless: true,
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'UI Tests - Firefox',
      testDir: './tests/loan-calc-ui',
      timeout: 30 * 1000,
      retries: 1,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://taotlus.bigbank.ee',
        headless: true,
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'API Tests',
      testDir: './tests/api',
      timeout: 30 * 1000,
      retries: 1,
      use: {
        baseURL: 'https://taotlus.bigbank.ee/api/v1/loan/calculate',
      },
    },
  ],
  workers: 3, //slowing it down a bit
});
