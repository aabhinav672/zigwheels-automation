import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { HeaderComponent } from '@components/HeaderComponent';
import { FooterComponent } from '@components/FooterComponent';
import { SearchComponent } from '@components/SearchComponent';
import { Routes } from '@constants/endpoints';

export class HomePage extends BasePage {
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  /** The large hero search box, distinct from the header's compact one. */
  readonly heroSearch: SearchComponent;

  private readonly popularCards: Locator;
  private readonly popularCardLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.heroSearch = new SearchComponent(page, 'homeSearch');

    // Carousel tiles for popular / upcoming vehicles.
    this.popularCards = page.locator('li.sl-card');
    this.popularCardLinks = page.locator('li.sl-card .ev-detailCard a');
  }

  get path(): string {
    return Routes.HOME;
  }

  get pageIdentifier(): Locator {
    return this.header.root;
  }

  /** Types into the hero box and returns whatever the suggester offered. */
  async searchVehicle(keyword: string): Promise<string[]> {
    await this.heroSearch.search(keyword);
    return this.heroSearch.suggestions();
  }

  async popularCardCount(): Promise<number> {
    return this.popularCards.count();
  }

  async popularVehicleNames(): Promise<string[]> {
    return this.allTexts(this.popularCardLinks);
  }
}
