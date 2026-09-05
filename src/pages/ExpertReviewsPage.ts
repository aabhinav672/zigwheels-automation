import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { Routes } from '@constants/endpoints';

/**
 * Expert reviews listing at /reviews.
 *
 * Each review renders as an `<article>` with its headline link pointing at
 * `/reviews-advice/reviews/...`, so that href pattern - not a CSS class - is
 * the stable way to pick the title out of the surrounding layout markup.
 */
export class ExpertReviewsPage extends BasePage {
  private readonly heading: Locator;
  private readonly reviewCards: Locator;
  private readonly reviewTitleLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1').first();
    this.reviewCards = page.locator('article');
    this.reviewTitleLinks = page.locator('article a[href*="/reviews-advice/reviews/"]');
  }

  get path(): string {
    return Routes.EXPERT_REVIEWS;
  }

  get pageIdentifier(): Locator {
    return this.heading;
  }

  async headingText(): Promise<string> {
    return this.textOf(this.heading);
  }

  async reviewCount(): Promise<number> {
    return this.reviewCards.count();
  }

  async reviewTitles(): Promise<string[]> {
    return this.allTexts(this.reviewTitleLinks);
  }
}
