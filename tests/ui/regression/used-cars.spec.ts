import { test, expect } from '@fixtures/index';

test.describe('Used car marketplace @regression', () => {
  test.beforeEach(async ({ usedCarsPage }) => {
    await usedCarsPage.open();
    await usedCarsPage.waitUntilLoaded();
  });

  test('shows search results', async ({ usedCarsPage }) => {
    expect(await usedCarsPage.resultCount()).toBeGreaterThan(0);
    expect(await usedCarsPage.resultLinkCount()).toBeGreaterThan(0);
  });

  test('offers city and brand filters', async ({ usedCarsPage }) => {
    expect(await usedCarsPage.isCityFilterAvailable()).toBe(true);
    expect(await usedCarsPage.isBrandFilterAvailable()).toBe(true);
  });

  test('offers multiple price bands', async ({ usedCarsPage }) => {
    expect(await usedCarsPage.priceFilterCount()).toBeGreaterThanOrEqual(5);
  });
});
