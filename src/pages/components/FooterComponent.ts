import { Locator, Page } from '@playwright/test';

/** Global footer - used mainly for link-integrity and SEO checks. */
export class FooterComponent {
  readonly root: Locator;
  readonly allLinks: Locator;

  constructor(page: Page) {
    this.root = page.locator('footer').first();
    this.allLinks = this.root.locator('a[href]');
  }

  async linkCount(): Promise<number> {
    return this.allLinks.count();
  }

  async linkHrefs(): Promise<string[]> {
    const hrefs = await this.allLinks.evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href') ?? ''),
    );
    return hrefs.filter((href) => href.length > 0);
  }
}
