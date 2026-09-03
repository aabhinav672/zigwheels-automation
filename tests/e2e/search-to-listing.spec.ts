import { test, expect } from '@fixtures/index';

/**
 * End-to-end journeys through the search funnel - the paths a real shopper
 * takes, crossing more than one page object.
 */
test.describe('Search journeys @e2e', () => {
  test('a shopper can search a model and land on its page', async ({ homePage }) => {
    await homePage.open();
    await homePage.waitUntilLoaded();

    await homePage.heroSearch.search('Creta');
    expect((await homePage.heroSearch.suggestions()).length).toBeGreaterThan(0);

    await homePage.heroSearch.submit();

    expect(homePage.getCurrentUrl().toLowerCase()).toContain('creta');
  });

  test('a shopper can pick a suggestion from the header search', async ({ homePage }) => {
    await homePage.open();
    await homePage.waitUntilLoaded();

    await homePage.header.search.search('Nexon');
    await homePage.header.search.openFirstSuggestion();

    expect(homePage.getCurrentUrl().toLowerCase()).toContain('nexon');
  });

  test('a shopper can go from home to new cars and open a brand', async ({
    homePage,
    newCarsPage,
  }) => {
    await homePage.open();
    await homePage.waitUntilLoaded();

    await homePage.header.goToNewCars();
    await newCarsPage.waitUntilLoaded();
    expect(await newCarsPage.headingText()).toContain('New Cars');

    await newCarsPage.openBrand('Tata');
    expect(newCarsPage.getCurrentUrl()).toContain('tata-cars');
  });
});
