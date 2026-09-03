import { Locator, Page, expect } from '@playwright/test';
import { Timeouts } from '@constants/timeouts';
import { Logger } from '@utils/logger';

/**
 * Every page object extends this. It owns the low-level Playwright calls so
 * concrete pages only describe *what* the page can do, never *how* to wait.
 */
export abstract class BasePage {
  protected readonly log: Logger;

  protected constructor(protected readonly page: Page) {
    this.log = Logger.for(this.constructor.name);
  }

  /** Path this page lives at, relative to baseURL. */
  abstract get path(): string;

  /** A locator that proves the page finished rendering. */
  abstract get pageIdentifier(): Locator;

  // ---------------------------------------------------------------- navigation

  async open(pathOverride?: string): Promise<void> {
    const target = pathOverride ?? this.path;
    this.log.info(`Navigating to ${target}`);
    await this.page.goto(target, {
      waitUntil: 'domcontentloaded',
      timeout: Timeouts.PAGE_LOAD,
    });
    await this.dismissInterstitialsIfPresent();
  }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.pageIdentifier).toBeVisible({ timeout: Timeouts.LONG });
  }

  async isLoaded(): Promise<boolean> {
    return this.pageIdentifier.isVisible().catch(() => false);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  // ------------------------------------------------------------------- actions

  protected async click(locator: Locator, description = 'element'): Promise<void> {
    this.log.debug(`Clicking ${description}`);
    await locator.scrollIntoViewIfNeeded();
    await locator.click({ timeout: Timeouts.MEDIUM });
  }

  protected async type(locator: Locator, value: string, description = 'field'): Promise<void> {
    this.log.debug(`Typing "${value}" into ${description}`);
    await locator.click({ timeout: Timeouts.MEDIUM });
    await locator.fill('');
    await locator.pressSequentially(value, { delay: 120 });
  }

  protected async textOf(locator: Locator): Promise<string> {
    return (await locator.innerText()).replace(/\s+/g, ' ').trim();
  }

  protected async allTexts(locator: Locator): Promise<string[]> {
    const raw = await locator.allInnerTexts();
    return raw.map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
  }

  // ------------------------------------------------------------------ overlays

  /**
   * ZigWheels can show a city-selection modal, a notification prompt or an ad
   * overlay on first load. They intercept clicks, so every navigation clears
   * them best-effort - never fail a test because an overlay was absent.
   */
  async dismissInterstitialsIfPresent(): Promise<void> {
    const dismissers: Locator[] = [
      this.page.locator('#closeButton'),
      this.page.locator('.close-icon, .icon-close, .zw-close').first(),
      this.page.getByRole('button', { name: /close|no thanks|not now|later/i }).first(),
      this.page.locator('[aria-label="Close"]').first(),
    ];

    for (const dismisser of dismissers) {
      try {
        if (await dismisser.isVisible({ timeout: Timeouts.INSTANT })) {
          await dismisser.click({ timeout: Timeouts.SHORT, force: true });
          this.log.debug('Dismissed an interstitial overlay.');
        }
      } catch {
        // Overlay absent or already gone.
      }
    }
  }

  // -------------------------------------------------------------- diagnostics

  async screenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }
}
