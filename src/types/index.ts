/** Shared domain types used by page objects and data files. */

export interface VehicleSearchData {
  keyword: string;
  expectedSuggestion: string;
}

export interface CarComparisonData {
  firstCar: string;
  secondCar: string;
}

export interface BudgetFilter {
  label: string;
  minLakh: number;
  maxLakh: number;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export type VehicleType = 'car' | 'bike';
