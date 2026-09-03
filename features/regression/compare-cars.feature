@regression @compare
Feature: Compare cars tool
  As a shopper
  I want to compare cars side by side
  So that I can decide between models

  Background:
    Given I am on the compare cars page

  @compare-slots
  Scenario: Exposes three comparison slots
    Then slots 1 to 3 should be available

  @compare-brand-list-consistency
  Scenario: Every slot offers the same populated brand list
    Then slot 1 should offer more than 10 brands
    And slot 2's brand list should match slot 1's brand list

  @compare-major-manufacturers
  Scenario: Brand list contains the major manufacturers
    Then slot 1's brand list should contain the major manufacturers
