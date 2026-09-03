import { test as base, expect } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { NewCarsPage } from '@pages/NewCarsPage';
import { UsedCarsPage } from '@pages/UsedCarsPage';
import { BikesPage } from '@pages/BikesPage';
import { CompareCarsPage } from '@pages/CompareCarsPage';
import { appConfig } from '@config/app.config';

/**
 * Custom fixtures. Specs declare only the pages they need:
 *
 *   test('...', async ({ homePage }) => { await homePage.open(); });
 *
 * Page objects are constructed lazily per test, so there is no shared state
 * between parallel workers.
 */
type PageFixtures = {
  homePage: HomePage;
  newCarsPage: NewCarsPage;
  usedCarsPage: UsedCarsPage;
  bikesPage: BikesPage;
  compareCarsPage: CompareCarsPage;
};

type WorkerFixtures = {
  config: typeof appConfig;
};

export const test = base.extend<PageFixtures, WorkerFixtures>({
  config: [
    async ({}, use) => {
      await use(appConfig);
    },
    { scope: 'worker' },
  ],

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  newCarsPage: async ({ page }, use) => {
    await use(new NewCarsPage(page));
  },

  usedCarsPage: async ({ page }, use) => {
    await use(new UsedCarsPage(page));
  },

  bikesPage: async ({ page }, use) => {
    await use(new BikesPage(page));
  },

  compareCarsPage: async ({ page }, use) => {
    await use(new CompareCarsPage(page));
  },
});

export { expect };
