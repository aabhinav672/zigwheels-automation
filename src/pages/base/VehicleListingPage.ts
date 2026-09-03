import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { HeaderComponent } from '@components/HeaderComponent';
import { parseFirstNumber, scrollToBottom } from '@utils/helpers';

/**
 * New cars and new bikes render the same tile markup
 * (`li.sl-card > .ev-detailCard > a` + a sibling price div), so the shared
 * behaviour lives here and the concrete pages only supply their route.
 */
export abstract class VehicleListingPage extends BasePage {
  readonly header: HeaderComponent;

  protected readonly heading: Locator;
  protected readonly cards: Locator;
  protected readonly cardNames: Locator;
  protected readonly cardPrices: Locator;

  protected constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.heading = page.locator('h1').first();
    this.cards = page.locator('li.sl-card');
    this.cardNames = page.locator('li.sl-card .ev-detailCard a');
    this.cardPrices = page.locator('li.sl-card .ev-detailCard div');
  }

  get pageIdentifier(): Locator {
    return this.heading;
  }

  async headingText(): Promise<string> {
    return this.textOf(this.heading);
  }

  async listedCount(): Promise<number> {
    return this.cards.count();
  }

  async listedNames(): Promise<string[]> {
    return this.allTexts(this.cardNames);
  }

  /** Lazy tiles hydrate on scroll, so force them in before counting. */
  async loadAllTiles(): Promise<void> {
    await scrollToBottom(this.page, 3);
  }

  /** Prices normalised to lakh so ranges and sorts can be asserted numerically. */
  async listedPricesInLakh(): Promise<number[]> {
    const texts = await this.allTexts(this.cardPrices);
    return texts
      .filter((text) => /lakh|crore/i.test(text))
      .map((text) => {
        const value = parseFirstNumber(text);
        return /crore/i.test(text) ? value * 100 : value;
      });
  }

  async hasModel(modelName: string): Promise<boolean> {
    const names = await this.listedNames();
    return names.some((name) => name.toLowerCase().includes(modelName.toLowerCase()));
  }
}
