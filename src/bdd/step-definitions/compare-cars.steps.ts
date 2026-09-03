import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CompareCarsPage } from '@pages/CompareCarsPage';
import { readJson } from '@utils/data-reader';
import { CustomWorld } from '../support/world';

const { popularBrands } = readJson<{ popularBrands: string[] }>('vehicles.json');

Given('I am on the compare cars page', async function (this: CustomWorld) {
  await this.compareCarsPage.open();
  await this.compareCarsPage.waitUntilLoaded();
  this.currentPage = this.compareCarsPage;
});

Then('slots 1 to 3 should be available', async function (this: CustomWorld) {
  for (let slot = 1; slot <= CompareCarsPage.SLOT_COUNT; slot++) {
    expect(await this.compareCarsPage.hasSlot(slot), `slot ${slot} missing`).toBe(true);
  }
});

Then("slot 2's brand list should match slot 1's brand list", async function (this: CustomWorld) {
  const first = await this.compareCarsPage.availableMakes(1);
  const second = await this.compareCarsPage.availableMakes(2);
  expect(second).toEqual(first);
});

Then('slot 1 should offer more than 10 brands', async function (this: CustomWorld) {
  const first = await this.compareCarsPage.availableMakes(1);
  expect(first.length).toBeGreaterThan(10);
});

Then(
  "slot 1's brand list should contain the major manufacturers",
  async function (this: CustomWorld) {
    const makes = (await this.compareCarsPage.availableMakes(1)).map((m) => m.toLowerCase());
    for (const brand of popularBrands) {
      expect(makes, `${brand} missing from make dropdown`).toContain(brand.toLowerCase());
    }
  },
);
