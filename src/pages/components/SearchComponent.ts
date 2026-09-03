import { Locator, Page } from '@playwright/test';
import { Timeouts } from '@constants/timeouts';

/**
 * The ZigWheels search box.
 *
 * The site uses jQuery UI autocomplete: each input gets its own results list
 * rendered as `ul.<inputId>_mmv_suggest`, appended to the body rather than
 * nested under the input. Both the header box (`#headerSearch`) and the home
 * hero box (`#homeSearch`) share this behaviour, so the component is
 * parametrised by input id instead of being duplicated.
 */
export class SearchComponent {
  readonly input: Locator;
  readonly suggestionList: Locator;
  readonly suggestionItems: Locator;

  constructor(
    private readonly page: Page,
    inputId: 'headerSearch' | 'homeSearch',
  ) {
    this.input = page.locator(`#${inputId}`);
    this.suggestionList = page.locator(`ul.${inputId}_mmv_suggest`);
    this.suggestionItems = this.suggestionList.locator('li');
  }

  /** Types the term and waits for the suggester XHR-backed list to render. */
  async search(keyword: string): Promise<void> {
    await this.input.click({ timeout: Timeouts.MEDIUM });
    await this.input.fill('');
    // Character-by-character: the suggester fires on keyup, not on value set.
    await this.input.pressSequentially(keyword, { delay: 150 });
    await this.suggestionList
      .waitFor({ state: 'visible', timeout: Timeouts.MEDIUM })
      .catch(() => undefined);
  }

  async suggestions(): Promise<string[]> {
    if (!(await this.suggestionList.isVisible().catch(() => false))) return [];
    const texts = await this.suggestionItems.allInnerTexts();
    return texts.map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
  }

  async openFirstSuggestion(): Promise<void> {
    await this.suggestionItems.first().click({ timeout: Timeouts.MEDIUM });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Enter submits to the best match's model page. */
  async submit(): Promise<void> {
    await this.input.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async placeholder(): Promise<string | null> {
    return this.input.getAttribute('placeholder');
  }
}
