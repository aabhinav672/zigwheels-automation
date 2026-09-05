import { Locator, Page } from '@playwright/test';
import { SearchComponent } from '@components/SearchComponent';
import { Timeouts } from '@constants/timeouts';
import { Routes } from '@constants/endpoints';

/**
 * The global masthead, present on every page - so it is a component rather
 * than being duplicated in each page object.
 */
export class HeaderComponent {
  readonly root: Locator;
  readonly search: SearchComponent;
  readonly navLinks: Locator;

  private readonly newCarsLink: Locator;
  private readonly newBikesLink: Locator;
  private readonly usedCarsLink: Locator;
  private readonly expertReviewsLink: Locator;

  constructor(page: Page) {
    this.root = page.locator('header').first();
    this.search = new SearchComponent(page, 'headerSearch');
    this.navLinks = page.locator('ul.h-d-nav a[href]');

    this.newCarsLink = page.locator(`a[href="${Routes.NEW_CARS}"]`).first();
    this.newBikesLink = page.locator(`a[href="${Routes.NEW_BIKES}"]`).first();
    this.usedCarsLink = page.locator(`a[href="${Routes.USED_CARS}"]`).first();
    this.expertReviewsLink = page.locator(`a[href="${Routes.EXPERT_REVIEWS}"]`).first();
  }

  async navLinkHrefs(): Promise<string[]> {
    return this.navLinks.evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('href') ?? '').filter(Boolean),
    );
  }

  /**
   * Top-level nav items are hover-triggered mega menus - the real link stays
   * `visibility: hidden` until its top-level `<li>` (direct child of
   * `ul.h-d-nav`) is hovered, so every nav click must hover that ancestor first.
   */
  private async revealAndClick(link: Locator): Promise<void> {
    await link.locator('xpath=ancestor::li[parent::ul[contains(@class, "h-d-nav")]]').hover();
    await link.click({ timeout: Timeouts.MEDIUM });
  }

  async goToNewCars(): Promise<void> {
    await this.revealAndClick(this.newCarsLink);
  }

  async goToNewBikes(): Promise<void> {
    await this.revealAndClick(this.newBikesLink);
  }

  async goToUsedCars(): Promise<void> {
    await this.revealAndClick(this.usedCarsLink);
  }

  async goToExpertReviews(): Promise<void> {
    await this.revealAndClick(this.expertReviewsLink);
  }
}
