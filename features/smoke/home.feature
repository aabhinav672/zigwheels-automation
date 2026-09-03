@smoke @home
Feature: ZigWheels home page
  As a visitor
  I want the home page to load correctly
  So that I can begin browsing cars and bikes

  Background:
    Given I am on the ZigWheels home page

  @home-title-and-masthead
  Scenario: Home page loads with the expected title and masthead
    Then the page title should contain "ZigWheels"
    And the header should be visible

  @home-https
  Scenario: Home page serves the site over HTTPS on the configured base URL
    Then the current URL should use HTTPS
    And the current URL should belong to "zigwheels.com"

  @home-search-boxes
  Scenario: Home page exposes both the hero and header search boxes
    Then the hero search box should be visible
    And the header search box should be visible

  @home-popular-tiles
  Scenario: Home page renders popular vehicle tiles
    Then at least one popular vehicle tile should be shown
    And every popular vehicle tile should have a name

  @home-footer-links
  Scenario: Home page renders a footer with navigable links
    Then the footer should be visible
    And the footer should contain at least one link
