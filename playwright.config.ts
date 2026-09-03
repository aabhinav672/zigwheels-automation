import { defineConfig, devices } from '@playwright/test';
import { appConfig } from './config/app.config';
import { Timeouts } from './src/constants/timeouts';

/**
 * Framework-wide runner config.
 *
 *   TEST_ENV=qa|prod   selects config/env/.env.<env>
 *   npm run test:smoke uses the @smoke tag
 *
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  snapshotDir: './test-data/snapshots',

  timeout: Timeouts.TEST,
  expect: { timeout: Timeouts.EXPECT },

  fullyParallel: true,
  forbidOnly: appConfig.isCI,
  retries: appConfig.isCI ? 2 : 0,
  workers: appConfig.isCI ? 2 : undefined,
  maxFailures: appConfig.isCI ? 20 : 0,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['json', { outputFile: 'reports/json/results.json' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }],
  ],

  use: {
    baseURL: appConfig.baseUrl,
    headless: appConfig.headless,
    actionTimeout: Timeouts.MEDIUM,
    navigationTimeout: Timeouts.PAGE_LOAD,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
    launchOptions: { slowMo: appConfig.slowMo },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /tests\/api\/.*/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /tests\/api\/.*/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /tests\/api\/.*/,
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      testIgnore: /tests\/api\/.*/,
    },
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: { baseURL: appConfig.apiBaseUrl },
    },
  ],
});
