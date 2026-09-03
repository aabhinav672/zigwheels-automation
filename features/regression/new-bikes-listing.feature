@regression @listing @bikes
Feature: New bike listing
  As a shopper
  I want the new-bike listing to render real inventory
  So that I can browse bike models

  Background:
    Given I am on the new bikes listing page

  @new-bikes-tiles
  Scenario: Renders bike tiles with names
    When all listing tiles have loaded
    Then at least one model should be listed
    And every listed model should have a non-empty name
