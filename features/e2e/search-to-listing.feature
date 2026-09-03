@e2e
Feature: Search-to-listing shopper journeys
  As a shopper
  I want to move from search to a model or brand page
  So that I can research a specific vehicle

  @e2e-search-to-model
  Scenario: A shopper can search a model and land on its page
    Given I am on the ZigWheels home page
    When I search for "Creta" in the hero search box
    And I submit the hero search
    Then the current URL should contain "creta"

  @e2e-header-suggestion
  Scenario: A shopper can pick a suggestion from the header search
    Given I am on the ZigWheels home page
    When I search for "Nexon" in the header search box
    And I open the first header search suggestion
    Then the current URL should contain "nexon"

  @e2e-new-cars-to-brand
  Scenario: A shopper can go from home to new cars and open a brand
    Given I am on the ZigWheels home page
    When I open the new cars listing page from the header
    And I open the "Tata" brand from the listing
    Then the current URL should contain "tata-cars"
