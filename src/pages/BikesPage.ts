import { Locator, Page } from '@playwright/test';
import { VehicleListingPage } from '@pages/base/VehicleListingPage';
import { Routes } from '@constants/endpoints';

/** New-bike listing at /newbikes. */
export class BikesPage extends VehicleListingPage {
  private readonly scootersLink: Locator;

  constructor(page: Page) {
    super(page);
    this.scootersLink = page.locator(`a[href="${Routes.SCOOTERS}"]`).first();
  }

  get path(): string {
    return Routes.NEW_BIKES;
  }

  async goToScooters(): Promise<void> {
    await this.click(this.scootersLink, 'Scooters link');
  }
}
