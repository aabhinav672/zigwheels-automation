@regression @listing
Feature: New car and bike listings
  As a shopper
  I want the new-vehicle listings to render real inventory
  So that I can browse and drill into a model

  Background:
    Given I am on the new cars listing page

  @new-cars-tiles
  Scenario: Renders model tiles
    When all listing tiles have loaded
    Then at least one model should be listed

  @new-cars-model-names
  Scenario: Every listed model exposes a non-empty name
    When all listing tiles have loaded
    Then every listed model should have a non-empty name

  @new-cars-prices
  Scenario: Prices parse into positive numeric values
    When all listing tiles have loaded
    Then every listed price should be a positive number

  @new-cars-brand-links
  Scenario Outline: Links out to a brand page
    When I open the "<brand>" brand from the listing
    Then the current URL should contain "<brandSlug>-cars"

    Examples:
      | brand         | brandSlug     |
      | Maruti Suzuki | maruti-suzuki |
      | Hyundai       | hyundai       |
      | Tata          | tata          |
