@regression @search
Feature: Global vehicle search
  As a shopper
  I want to search for a car or bike by name
  So that I can jump straight to its page

  Background:
    Given I am on the ZigWheels home page

  @search-hero-suggestions
  Scenario Outline: Hero search suggests results for a known model
    When I search for "<keyword>" in the hero search box
    Then the suggestions should include "<keyword>"

    Examples:
      | keyword |
      | Swift   |
      | Creta   |
      | Nexon   |

  @search-header-suggester
  Scenario: Header search offers the same suggester
    When I search for "Swift" in the header search box
    Then the suggestions should include "Swift"

  @search-unmatched-term @negative
  Scenario: An unmatched term returns no vehicle suggestions
    When I search for "zzzqqxnotacar" in the hero search box
    Then none of the suggestions should mention "zzzqqxnotacar"
