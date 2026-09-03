/** Named waits. Tests should never hardcode a millisecond literal. */
export const Timeouts = {
  INSTANT: 1_000,
  SHORT: 5_000,
  MEDIUM: 15_000,
  LONG: 30_000,
  PAGE_LOAD: 60_000,
  TEST: 90_000,
  EXPECT: 15_000,
} as const;
