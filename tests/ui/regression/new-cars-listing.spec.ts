import { test, expect } from '@fixtures/index';
import { readJson } from '@utils/data-reader';
import { CarBrandSlugs } from '@constants/endpoints';

const { popularBrands } = readJson<{ popularBrands: string[] }>('vehicles.json');

test.describe('New car listing @regression', () => {
  test.beforeEach(async ({ newCarsPage }) => {
    await newCarsPage.open();
    await newCarsPage.waitUntilLoaded();
  });

  test('renders model tiles', async ({ newCarsPage }) => {
    await newCarsPage.loadAllTiles();
    expect(await newCarsPage.listedCount()).toBeGreaterThan(0);
  });

  test('every listed model exposes a non-empty name', async ({ newCarsPage }) => {
    await newCarsPage.loadAllTiles();
    const names = await newCarsPage.listedNames();

    expect(names.length).toBeGreaterThan(0);
    expect(names.every((name) => name.trim().length > 0)).toBe(true);
  });

  test('prices parse into positive numeric values', async ({ newCarsPage }) => {
    await newCarsPage.loadAllTiles();
    const prices = await newCarsPage.listedPricesInLakh();

    expect(prices.length).toBeGreaterThan(0);
    expect(prices.every((price) => price > 0)).toBe(true);
  });

  for (const brand of popularBrands.slice(0, 3)) {
    test(`links out to the ${brand} brand page`, async ({ newCarsPage }) => {
      await newCarsPage.openBrand(brand);

      expect(newCarsPage.getCurrentUrl()).toContain(`${CarBrandSlugs[brand]}-cars`);
    });
  }
});

test.describe('New bike listing @regression', () => {
  test('renders bike tiles with names', async ({ bikesPage }) => {
    await bikesPage.open();
    await bikesPage.waitUntilLoaded();
    await bikesPage.loadAllTiles();

    expect(await bikesPage.listedCount()).toBeGreaterThan(0);
    expect((await bikesPage.listedNames()).length).toBeGreaterThan(0);
  });
});
