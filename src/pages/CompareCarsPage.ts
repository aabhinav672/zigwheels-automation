import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { Routes } from '@constants/endpoints';

/**
 * Car-comparison tool at /compare-cars.
 *
 * The three comparison slots are backed by native selects
 * (`#comparison_make{n}` / `_model{n}` / `_variant{n}`) that the site hides
 * behind a custom dropdown widget. Because the native elements are not
 * visible, this page object reads their options directly rather than calling
 * `selectOption`, which would fail visibility checks.
 */
export class CompareCarsPage extends BasePage {
  static readonly SLOT_COUNT = 3;

  private readonly heading: Locator;
  private readonly compareLists: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1').first();
    this.compareLists = page.locator('.compareList');
  }

  get path(): string {
    return Routes.COMPARE_CARS;
  }

  get pageIdentifier(): Locator {
    return this.heading;
  }

  async headingText(): Promise<string> {
    return this.textOf(this.heading);
  }

  async compareSlotCount(): Promise<number> {
    return this.compareLists.count();
  }

  private makeSelect(slot: number): Locator {
    return this.page.locator(`#comparison_make${slot}`);
  }

  /** Brand options offered for a slot, minus the "Make" placeholder. */
  async availableMakes(slot = 1): Promise<string[]> {
    const options = await this.makeSelect(slot).evaluate((el) =>
      Array.from((el as HTMLSelectElement).options).map((o) => o.text.trim()),
    );
    return options.filter((text) => text.length > 0 && text.toLowerCase() !== 'make');
  }

  async hasSlot(slot: number): Promise<boolean> {
    return (await this.makeSelect(slot).count()) > 0;
  }
}
