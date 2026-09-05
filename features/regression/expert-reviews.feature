@regression @expert-reviews
Feature: Expert reviews section
  As a shopper
  I want to reach the expert car and bike reviews from the header
  So that I can read professional opinions before buying

  Background:
    Given I am on the ZigWheels home page
    When I open the expert reviews page from the header

  @expert-reviews-heading
  Scenario: Expert reviews page exposes its heading
    Then the page heading should contain "Expert Reviews - Car & Bike"

  @expert-reviews-content
  Scenario: Expert reviews section lists reviews
    Then at least one expert review should be listed
    And every listed review should have a non-empty title
