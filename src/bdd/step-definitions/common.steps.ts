import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the ZigWheels home page', async function (this: CustomWorld) {
  await this.homePage.open();
  await this.homePage.waitUntilLoaded();
});

Then(
  'the page title should contain {string}',
  async function (this: CustomWorld, fragment: string) {
    expect(await this.homePage.getTitle()).toContain(fragment);
  },
);

Then('the header should be visible', async function (this: CustomWorld) {
  await expect(this.homePage.header.root).toBeVisible();
});

Then('the current URL should use HTTPS', function (this: CustomWorld) {
  expect(this.page.url().startsWith('https://')).toBe(true);
});

Then('the current URL should belong to {string}', function (this: CustomWorld, domain: string) {
  expect(this.page.url()).toContain(domain);
});

Then('the current URL should contain {string}', function (this: CustomWorld, fragment: string) {
  expect(this.page.url().toLowerCase()).toContain(fragment.toLowerCase());
});

Then(
  'the page heading should contain {string}',
  async function (this: CustomWorld, fragment: string) {
    if (!this.currentPage) {
      throw new Error('No page has been opened yet - add a step that opens one first.');
    }
    expect(await this.currentPage.headingText()).toContain(fragment);
  },
);

Then('the hero search box should be visible', async function (this: CustomWorld) {
  await expect(this.homePage.heroSearch.input).toBeVisible();
});

Then('the header search box should be visible', async function (this: CustomWorld) {
  await expect(this.homePage.header.search.input).toBeVisible();
});

Then('at least one popular vehicle tile should be shown', async function (this: CustomWorld) {
  expect(await this.homePage.popularCardCount()).toBeGreaterThan(0);
});

Then('every popular vehicle tile should have a name', async function (this: CustomWorld) {
  const names = await this.homePage.popularVehicleNames();
  expect(names.length).toBeGreaterThan(0);
  expect(names.every((name) => name.trim().length > 0)).toBe(true);
});

Then('the footer should be visible', async function (this: CustomWorld) {
  await expect(this.homePage.footer.root).toBeVisible();
});

Then('the footer should contain at least one link', async function (this: CustomWorld) {
  expect(await this.homePage.footer.linkCount()).toBeGreaterThan(0);
});
