import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ErrorMessages } from '@constants/messages';
import { CustomWorld } from '../support/world';

When(
  'I search for {string} in the hero search box',
  async function (this: CustomWorld, keyword: string) {
    this.lastSuggestions = await this.homePage.searchVehicle(keyword);
  },
);

When(
  'I search for {string} in the header search box',
  async function (this: CustomWorld, keyword: string) {
    await this.homePage.header.search.search(keyword);
    this.lastSuggestions = await this.homePage.header.search.suggestions();
  },
);

When('I submit the hero search', async function (this: CustomWorld) {
  await this.homePage.heroSearch.submit();
});

When('I open the first header search suggestion', async function (this: CustomWorld) {
  await this.homePage.header.search.openFirstSuggestion();
});

Then('the suggestions should include {string}', function (this: CustomWorld, expected: string) {
  expect(this.lastSuggestions.length, ErrorMessages.NO_SEARCH_RESULTS).toBeGreaterThan(0);
  expect(
    this.lastSuggestions.some((s) => s.toLowerCase().includes(expected.toLowerCase())),
    `Suggestions ${JSON.stringify(this.lastSuggestions)} did not mention "${expected}".`,
  ).toBe(true);
});

Then('none of the suggestions should mention {string}', function (this: CustomWorld, term: string) {
  expect(this.lastSuggestions.every((s) => !s.toLowerCase().includes(term.toLowerCase()))).toBe(
    true,
  );
});
