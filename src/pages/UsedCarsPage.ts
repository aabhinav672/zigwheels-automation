import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { HeaderComponent } from '@components/HeaderComponent';
import { Routes } from '@constants/endpoints';
import { Timeouts } from '@constants/timeouts';

/**
 * Used-car marketplace at /used-car.
 *
 * Results render as `.zw-sr-result` rows; the left rail carries a city
 * autocomplete (`#usedCarCity`), a brand autocomplete and radio-style price
 * filters (`#price1` .. `#price5`).
 */
export class UsedCarsPage extends BasePage {
  readonly header: HeaderComponent;

  private readonly heading: Locator;
  private readonly resultRows: Locator;
  private readonly resultLinks: Locator;
  private readonly cityInput: Locator;
  private readonly brandInput: Locator;
  private readonly priceFilters: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.heading = page.locator('h1').first();
    this.resultRows = page.locator('.zw-sr-result');
    this.resultLinks = page.locator('a[href*="/used-car/"]');
    this.cityInput = page.locator('#usedCarCity');
    this.brandInput = page.locator('input.usedCarMakeModel');
    this.priceFilters = page.locator('input.priceCheckbox');
  }

  get path(): string {
    return Routes.USED_CARS;
  }

  get pageIdentifier(): Locator {
    return this.heading;
  }

  async headingText(): Promise<string> {
    return this.textOf(this.heading);
  }

  async resultCount(): Promise<number> {
    return this.resultRows.count();
  }

  async resultLinkCount(): Promise<number> {
    return this.resultLinks.count();
  }

  async priceFilterCount(): Promise<number> {
    return this.priceFilters.count();
  }

  /** Both filter inputs render a beat after the heading, so wait rather than check instantly. */
  async isCityFilterAvailable(): Promise<boolean> {
    return this.cityInput
      .waitFor({ state: 'visible', timeout: Timeouts.SHORT })
      .then(() => true)
      .catch(() => false);
  }

  async isBrandFilterAvailable(): Promise<boolean> {
    return this.brandInput
      .waitFor({ state: 'visible', timeout: Timeouts.SHORT })
      .then(() => true)
      .catch(() => false);
  }

  async filterByCity(city: string): Promise<void> {
    await this.type(this.cityInput, city, 'used-car city filter');
    const suggestion = this.page.locator('ul.ui-autocomplete:visible li').first();
    await suggestion.waitFor({ state: 'visible', timeout: Timeouts.MEDIUM });
    await suggestion.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Price bands are 1-indexed left to right, matching the DOM ids. */
  async applyPriceFilter(bandIndex: number): Promise<void> {
    await this.click(this.page.locator(`#price${bandIndex}`), `price band ${bandIndex}`);
  }
}
