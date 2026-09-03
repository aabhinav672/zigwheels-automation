import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I open the new cars listing page', async function (this: CustomWorld) {
  await this.newCarsPage.open();
  await this.newCarsPage.waitUntilLoaded();
  this.currentPage = this.newCarsPage;
  this.currentListing = this.newCarsPage;
});

When('I open the new cars listing page from the header', async function (this: CustomWorld) {
  await this.homePage.header.goToNewCars();
  await this.newCarsPage.waitUntilLoaded();
  this.currentPage = this.newCarsPage;
  this.currentListing = this.newCarsPage;
});

When('I open the new bikes listing page', async function (this: CustomWorld) {
  await this.bikesPage.open();
  await this.bikesPage.waitUntilLoaded();
  this.currentPage = this.bikesPage;
  this.currentListing = this.bikesPage;
});

When('I open the used cars marketplace page', async function (this: CustomWorld) {
  await this.usedCarsPage.open();
  await this.usedCarsPage.waitUntilLoaded();
  this.currentPage = this.usedCarsPage;
});

When('I open the compare cars page', async function (this: CustomWorld) {
  await this.compareCarsPage.open();
  await this.compareCarsPage.waitUntilLoaded();
  this.currentPage = this.compareCarsPage;
});

Then(
  'the header navigation should link to {string}',
  async function (this: CustomWorld, href: string) {
    const hrefs = await this.homePage.header.navLinkHrefs();
    expect(hrefs).toContain(href);
  },
);
