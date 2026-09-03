/** Assertion text and expected copy, kept out of the specs. */
export const AppText = {
  BRAND: 'ZigWheels',
  HOME_TITLE_FRAGMENT: 'ZigWheels',
  NEW_CARS_TITLE_FRAGMENT: 'New Cars',
  BIKES_TITLE_FRAGMENT: 'Bikes',
} as const;

export const ErrorMessages = {
  NO_SEARCH_RESULTS: 'Expected at least one search suggestion but the list stayed empty.',
  MODEL_NOT_LISTED: (model: string) => `Model "${model}" was not present in the listing.`,
} as const;
