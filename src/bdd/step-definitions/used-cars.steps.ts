import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the used cars marketplace page', async function (this: CustomWorld) {
  await this.usedCarsPage.open();
  await this.usedCarsPage.waitUntilLoaded();
  this.currentPage = this.usedCarsPage;
});

Then('at least one used car result should be shown', async function (this: CustomWorld) {
  expect(await this.usedCarsPage.resultCount()).toBeGreaterThan(0);
});

Then('at least one used car result should link out', async function (this: CustomWorld) {
  expect(await this.usedCarsPage.resultLinkCount()).toBeGreaterThan(0);
});

Then('the city filter should be available', async function (this: CustomWorld) {
  expect(await this.usedCarsPage.isCityFilterAvailable()).toBe(true);
});

Then('the brand filter should be available', async function (this: CustomWorld) {
  expect(await this.usedCarsPage.isBrandFilterAvailable()).toBe(true);
});

Then(
  'at least {int} price bands should be available',
  async function (this: CustomWorld, minimum: number) {
    expect(await this.usedCarsPage.priceFilterCount()).toBeGreaterThanOrEqual(minimum);
  },
);
