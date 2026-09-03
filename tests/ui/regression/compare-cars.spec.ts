import { test, expect } from '@fixtures/index';
import { CompareCarsPage } from '@pages/CompareCarsPage';
import { readJson } from '@utils/data-reader';

const { popularBrands } = readJson<{ popularBrands: string[] }>('vehicles.json');

test.describe('Compare cars tool @regression', () => {
  test.beforeEach(async ({ compareCarsPage }) => {
    await compareCarsPage.open();
    await compareCarsPage.waitUntilLoaded();
  });

  test('exposes three comparison slots', async ({ compareCarsPage }) => {
    for (let slot = 1; slot <= CompareCarsPage.SLOT_COUNT; slot++) {
      expect(await compareCarsPage.hasSlot(slot), `slot ${slot} missing`).toBe(true);
    }
  });

  test('every slot offers the same populated brand list', async ({ compareCarsPage }) => {
    const first = await compareCarsPage.availableMakes(1);
    const second = await compareCarsPage.availableMakes(2);

    expect(first.length).toBeGreaterThan(10);
    expect(second).toEqual(first);
  });

  test('brand list contains the major manufacturers', async ({ compareCarsPage }) => {
    const makes = (await compareCarsPage.availableMakes(1)).map((m) => m.toLowerCase());

    for (const brand of popularBrands) {
      expect(makes, `${brand} missing from make dropdown`).toContain(brand.toLowerCase());
    }
  });
});
