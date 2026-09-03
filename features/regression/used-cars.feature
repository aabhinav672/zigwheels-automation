@regression @used-cars
Feature: Used car marketplace
  As a shopper
  I want to browse and filter used-car listings
  So that I can find a car near me within budget

  Background:
    Given I am on the used cars marketplace page

  @used-cars-results
  Scenario: Shows search results
    Then at least one used car result should be shown
    And at least one used car result should link out

  @used-cars-filters
  Scenario: Offers city and brand filters
    Then the city filter should be available
    And the brand filter should be available

  @used-cars-price-bands
  Scenario: Offers multiple price bands
    Then at least 5 price bands should be available
