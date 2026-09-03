import { Locator, Page } from '@playwright/test';
import { VehicleListingPage } from '@pages/base/VehicleListingPage';
import { CarBrandSlugs, Routes } from '@constants/endpoints';

/** New-car listing at /newcars. */
export class NewCarsPage extends VehicleListingPage {
  private readonly upcomingCarsLink: Locator;
  private readonly electricCarsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.upcomingCarsLink = page.locator(`a[href="${Routes.UPCOMING_CARS}"]`).first();
    this.electricCarsLink = page.locator(`a[href="${Routes.ELECTRIC_CARS}"]`).first();
  }

  get path(): string {
    return Routes.NEW_CARS;
  }

  /**
   * Opens a brand's landing page via the first model tile that belongs to it.
   * Brand slugs are not naive slugifications, hence the lookup table.
   */
  async openBrand(brand: string): Promise<void> {
    const slug = CarBrandSlugs[brand];
    if (!slug) {
      throw new Error(
        `No slug registered for brand "${brand}". Add it to CarBrandSlugs in endpoints.ts.`,
      );
    }
    const brandLink = this.page.locator(`a[href*="/${slug}-cars/"]`).first();
    await this.click(brandLink, `${brand} model link`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToUpcomingCars(): Promise<void> {
    await this.click(this.upcomingCarsLink, 'Upcoming Cars link');
  }

  async goToElectricCars(): Promise<void> {
    await this.click(this.electricCarsLink, 'Electric Cars link');
  }
}
