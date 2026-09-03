import { test, expect } from '@fixtures/index';
import { Routes } from '@constants/endpoints';

test.describe('Primary navigation @smoke', () => {
  test('new cars listing is reachable and lists models', async ({ newCarsPage }) => {
    await newCarsPage.open();
    await newCarsPage.waitUntilLoaded();

    expect(newCarsPage.getCurrentUrl()).toContain(Routes.NEW_CARS);
    expect(await newCarsPage.headingText()).toContain('New Cars');
    expect(await newCarsPage.listedCount()).toBeGreaterThan(0);
  });

  test('new bikes listing is reachable and lists models', async ({ bikesPage }) => {
    await bikesPage.open();
    await bikesPage.waitUntilLoaded();

    expect(bikesPage.getCurrentUrl()).toContain(Routes.NEW_BIKES);
    expect(await bikesPage.headingText()).toContain('New Bikes');
    expect(await bikesPage.listedCount()).toBeGreaterThan(0);
  });

  test('used cars marketplace is reachable', async ({ usedCarsPage }) => {
    await usedCarsPage.open();
    await usedCarsPage.waitUntilLoaded();

    expect(usedCarsPage.getCurrentUrl()).toContain(Routes.USED_CARS);
    expect(await usedCarsPage.headingText()).toContain('Used Cars');
  });

  test('compare-cars tool is reachable', async ({ compareCarsPage }) => {
    await compareCarsPage.open();
    await compareCarsPage.waitUntilLoaded();

    expect(await compareCarsPage.headingText()).toContain('Compare Cars');
  });

  test('header exposes the primary section links', async ({ homePage }) => {
    await homePage.open();
    await homePage.waitUntilLoaded();

    const hrefs = await homePage.header.navLinkHrefs();

    expect(hrefs).toContain(Routes.NEW_CARS);
    expect(hrefs).toContain(Routes.NEW_BIKES);
    expect(hrefs).toContain(Routes.USED_CARS);
  });
});
