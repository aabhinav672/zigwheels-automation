@smoke @navigation
Feature: Primary navigation
  As a shopper
  I want to reach every major section from the header
  So that I can browse cars, bikes and tools

  Background:
    Given I am on the ZigWheels home page

  @nav-new-cars
  Scenario: New cars listing is reachable and lists models
    When I open the new cars listing page
    Then the current URL should contain "/newcars"
    And the page heading should contain "New Cars"
    And at least one model should be listed

  @nav-new-bikes
  Scenario: New bikes listing is reachable and lists models
    When I open the new bikes listing page
    Then the current URL should contain "/newbikes"
    And the page heading should contain "New Bikes"
    And at least one model should be listed

  @nav-used-cars
  Scenario: Used cars marketplace is reachable
    When I open the used cars marketplace page
    Then the current URL should contain "/used-car"
    And the page heading should contain "Used Cars"

  @nav-compare-cars
  Scenario: Compare-cars tool is reachable
    When I open the compare cars page
    Then the page heading should contain "Compare Cars"

  @nav-header-links
  Scenario: Header exposes the primary section links
    Then the header navigation should link to "/newcars"
    And the header navigation should link to "/newbikes"
    And the header navigation should link to "/used-car"
