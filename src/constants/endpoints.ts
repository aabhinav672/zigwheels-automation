/**
 * Every route the framework navigates to lives here, so a site restructure
 * is a one-file change instead of a grep across the page objects.
 *
 * Verified against the live site's header navigation.
 */
export const Routes = {
  HOME: '/',
  NEW_CARS: '/newcars',
  USED_CARS: '/used-car',
  NEW_BIKES: '/newbikes',
  SCOOTERS: '/scooters',
  COMPARE_CARS: '/compare-cars',
  BIKE_COMPARISON: '/bikes/comparison',
  NEWS: '/news',
  EXPERT_REVIEWS: '/reviews',
  UPCOMING_CARS: '/upcoming-cars',
  UPCOMING_BIKES: '/upcoming-bikes',
  ELECTRIC_CARS: '/newcars/electric-cars',
  ELECTRIC_BIKES: '/newbikes/electric-bikes',
  POPULAR_CARS: '/newcars/best-cars-in-india',
  DEALERS: '/dealers',
} as const;

export type Route = (typeof Routes)[keyof typeof Routes];

/**
 * Brand landing pages follow the pattern `/<brand-slug>-cars/`.
 * Kept explicit because the slug is not a naive slugify of the display name
 * (e.g. "Maruti Suzuki" -> "maruti-suzuki", "MG" -> "mg-motor").
 */
export const CarBrandSlugs: Record<string, string> = {
  'Maruti Suzuki': 'maruti-suzuki',
  Hyundai: 'hyundai',
  Tata: 'tata',
  Mahindra: 'mahindra',
  Toyota: 'toyota',
  Kia: 'kia',
  Honda: 'honda',
  MG: 'mg-motor',
};

/** Read-only public endpoints used by the API suite. */
export const ApiEndpoints = {
  ROBOTS: '/robots.txt',
  /** jQuery-UI autocomplete backing the global search box. */
  SEARCH_SUGGESTER: '/mmv_suggester.php',
} as const;
