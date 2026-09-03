import { test, expect } from '@fixtures/index';
import { readJson } from '@utils/data-reader';
import { ErrorMessages } from '@constants/messages';
import { VehicleSearchData } from '@models/index';

/**
 * Data-driven: each row in test-data/search-data.json becomes its own test,
 * so a failure names the exact keyword that broke.
 */
const { searchScenarios } = readJson<{ searchScenarios: VehicleSearchData[] }>('search-data.json');

test.describe('Global search @regression', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.waitUntilLoaded();
  });

  for (const scenario of searchScenarios) {
    test(`hero search suggests results for "${scenario.keyword}"`, async ({ homePage }) => {
      const suggestions = await homePage.searchVehicle(scenario.keyword);

      expect(suggestions.length, ErrorMessages.NO_SEARCH_RESULTS).toBeGreaterThan(0);
      expect(
        suggestions.some((s) =>
          s.toLowerCase().includes(scenario.expectedSuggestion.toLowerCase()),
        ),
        `Suggestions ${JSON.stringify(suggestions)} did not mention "${scenario.expectedSuggestion}".`,
      ).toBe(true);
    });
  }

  test('header search offers the same suggester', async ({ homePage }) => {
    await homePage.header.search.search('Swift');

    const suggestions = await homePage.header.search.suggestions();
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some((s) => /swift/i.test(s))).toBe(true);
  });

  test('an unmatched term returns no vehicle suggestions', async ({ homePage }) => {
    const suggestions = await homePage.searchVehicle('zzzqqxnotacar');

    expect(suggestions.every((s) => !/zzzqqxnotacar/i.test(s))).toBe(true);
  });
});
