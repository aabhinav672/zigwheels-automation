import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { appConfig } from '@config/app.config';
import { HomePage } from '@pages/HomePage';
import { NewCarsPage } from '@pages/NewCarsPage';
import { UsedCarsPage } from '@pages/UsedCarsPage';
import { BikesPage } from '@pages/BikesPage';
import { CompareCarsPage } from '@pages/CompareCarsPage';
import { ExpertReviewsPage } from '@pages/ExpertReviewsPage';
import { VehicleListingPage } from '@pages/base/VehicleListingPage';

/** Any page object that exposes a heading, used by the generic heading-assertion step. */
interface HeadedPage {
  headingText(): Promise<string>;
}

/**
 * Cucumber's equivalent of `pages.fixture.ts`. Playwright Test's fixture
 * injection only exists inside `test()`, so the BDD world owns the
 * browser/context/page lifecycle itself and constructs the same page objects
 * the Playwright specs use - steps stay thin and delegate to them.
 */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  homePage!: HomePage;
  newCarsPage!: NewCarsPage;
  usedCarsPage!: UsedCarsPage;
  bikesPage!: BikesPage;
  compareCarsPage!: CompareCarsPage;
  expertReviewsPage!: ExpertReviewsPage;

  /** Set by whichever "I open/am on ..." step ran last, for generic assertion steps. */
  currentPage?: HeadedPage;
  currentListing?: VehicleListingPage;
  lastSuggestions: string[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  async launch(): Promise<void> {
    this.browser = await chromium.launch({
      headless: appConfig.headless,
      slowMo: appConfig.slowMo,
    });
    this.context = await this.browser.newContext({
      baseURL: appConfig.baseUrl,
      viewport: { width: 1440, height: 900 },
      locale: 'en-IN',
      timezoneId: 'Asia/Kolkata',
      ignoreHTTPSErrors: true,
    });
    this.page = await this.context.newPage();

    this.homePage = new HomePage(this.page);
    this.newCarsPage = new NewCarsPage(this.page);
    this.usedCarsPage = new UsedCarsPage(this.page);
    this.bikesPage = new BikesPage(this.page);
    this.compareCarsPage = new CompareCarsPage(this.page);
    this.expertReviewsPage = new ExpertReviewsPage(this.page);
  }

  async dispose(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
