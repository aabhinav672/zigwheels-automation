import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CarBrandSlugs } from '@constants/endpoints';
import { CustomWorld } from '../support/world';

Given('I am on the new cars listing page', async function (this: CustomWorld) {
  await this.newCarsPage.open();
  await this.newCarsPage.waitUntilLoaded();
  this.currentPage = this.newCarsPage;
  this.currentListing = this.newCarsPage;
});

Given('I am on the new bikes listing page', async function (this: CustomWorld) {
  await this.bikesPage.open();
  await this.bikesPage.waitUntilLoaded();
  this.currentPage = this.bikesPage;
  this.currentListing = this.bikesPage;
});

When('all listing tiles have loaded', async function (this: CustomWorld) {
  if (!this.currentListing) throw new Error('No listing page has been opened yet.');
  await this.currentListing.loadAllTiles();
});

Then('at least one model should be listed', async function (this: CustomWorld) {
  if (!this.currentListing) throw new Error('No listing page has been opened yet.');
  expect(await this.currentListing.listedCount()).toBeGreaterThan(0);
});

Then('every listed model should have a non-empty name', async function (this: CustomWorld) {
  if (!this.currentListing) throw new Error('No listing page has been opened yet.');
  const names = await this.currentListing.listedNames();
  expect(names.length).toBeGreaterThan(0);
  expect(names.every((name) => name.trim().length > 0)).toBe(true);
});

Then('every listed price should be a positive number', async function (this: CustomWorld) {
  if (!this.currentListing) throw new Error('No listing page has been opened yet.');
  const prices = await this.currentListing.listedPricesInLakh();
  expect(prices.length).toBeGreaterThan(0);
  expect(prices.every((price) => price > 0)).toBe(true);
});

When(
  'I open the {string} brand from the listing',
  async function (this: CustomWorld, brand: string) {
    if (!CarBrandSlugs[brand]) {
      throw new Error(
        `No slug registered for brand "${brand}". Add it to CarBrandSlugs in endpoints.ts.`,
      );
    }
    await this.newCarsPage.openBrand(brand);
  },
);
