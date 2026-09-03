import { test, expect } from '@fixtures/index';
import { AppText } from '@constants/messages';

test.describe('ZigWheels home page @smoke', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.waitUntilLoaded();
  });

  test('loads with the expected title and masthead', async ({ homePage }) => {
    expect(await homePage.getTitle()).toContain(AppText.HOME_TITLE_FRAGMENT);
    await expect(homePage.header.root).toBeVisible();
  });

  test('serves the site over HTTPS on the configured base URL', async ({ homePage, config }) => {
    const url = homePage.getCurrentUrl();

    expect(url).toContain('zigwheels.com');
    expect(url.startsWith('https://')).toBe(true);
    expect(config.baseUrl).toContain('zigwheels.com');
  });

  test('exposes both the hero and header search boxes', async ({ homePage }) => {
    await expect(homePage.heroSearch.input).toBeVisible();
    await expect(homePage.header.search.input).toBeVisible();
    expect(await homePage.heroSearch.placeholder()).toMatch(/search/i);
  });

  test('renders popular vehicle tiles', async ({ homePage }) => {
    expect(await homePage.popularCardCount()).toBeGreaterThan(0);

    const names = await homePage.popularVehicleNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((name) => name.trim().length > 0)).toBe(true);
  });

  test('renders a footer with navigable links', async ({ homePage }) => {
    await expect(homePage.footer.root).toBeVisible();
    expect(await homePage.footer.linkCount()).toBeGreaterThan(0);
  });
});
