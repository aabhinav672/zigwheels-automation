import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Then('at least one expert review should be listed', async function (this: CustomWorld) {
  expect(await this.expertReviewsPage.reviewCount()).toBeGreaterThan(0);
});

Then('every listed review should have a non-empty title', async function (this: CustomWorld) {
  const titles = await this.expertReviewsPage.reviewTitles();
  expect(titles.length).toBeGreaterThan(0);
  expect(titles.every((title) => title.trim().length > 0)).toBe(true);
});
