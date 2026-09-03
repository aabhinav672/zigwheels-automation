import { Page } from '@playwright/test';

/** Small stateless helpers shared across page objects. */

/** "₹ 12.50 - 18.99 Lakh" -> 12.5 (first number found). */
export function parseFirstNumber(text: string): number {
  const match = text.replace(/,/g, '').match(/\d+(\.\d+)?/);
  if (!match) {
    throw new Error(`No numeric value found in "${text}".`);
  }
  return Number(match[0]);
}

/** Collapses whitespace and trims - DOM text is rarely clean. */
export function normalize(text: string | null): string {
  return (text ?? '').replace(/\s+/g, ' ').trim();
}

/** Unique-ish suffix for data that must not collide across parallel workers. */
export function uniqueSuffix(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

/**
 * Scrolls to the bottom in steps so lazy-loaded listing tiles render.
 * ZigWheels listing pages hydrate cards on scroll.
 */
export async function scrollToBottom(page: Page, steps = 5, pauseMs = 400): Promise<void> {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(pauseMs);
  }
}

/** Used to assert that a price/name sort actually applied. */
export function isSortedAscending(values: number[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1] <= value);
}
