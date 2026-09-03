import { test, expect } from '@playwright/test';
import { ApiClient } from '@api/ApiClient';
import { ApiEndpoints, Routes } from '@constants/endpoints';

/**
 * Contract-level checks against public endpoints. Runs under the `api`
 * project, so it needs no browser.
 */
test.describe('Public endpoint availability @api @smoke', () => {
  test('robots.txt is served', async ({ request }) => {
    const api = new ApiClient(request);
    const response = await api.get(ApiEndpoints.ROBOTS);

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('User-agent');
  });

  test('home page responds 200 with HTML', async ({ request }) => {
    const api = new ApiClient(request);
    const response = await api.get(Routes.HOME);

    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('text/html');
  });

  for (const route of [Routes.NEW_CARS, Routes.NEW_BIKES, Routes.USED_CARS, Routes.COMPARE_CARS]) {
    test(`${route} responds successfully`, async ({ request }) => {
      const api = new ApiClient(request);
      const response = await api.get(route);

      expect(response.status()).toBeLessThan(400);
    });
  }
});

test.describe('Search suggester service @api @regression', () => {
  test('returns suggestions for a known model', async ({ request }) => {
    const api = new ApiClient(request);
    const response = await api.get(`${ApiEndpoints.SEARCH_SUGGESTER}?term=Creta`);

    expect(response.ok()).toBe(true);
    expect((await response.text()).toLowerCase()).toContain('creta');
  });

  test('handles a nonsense term without erroring', async ({ request }) => {
    const api = new ApiClient(request);
    const response = await api.get(`${ApiEndpoints.SEARCH_SUGGESTER}?term=zzzqqxnotacar`);

    expect(response.status()).toBeLessThan(500);
  });
});
