Feature: CrownCastle Interview

  @playwright @crownCastleChallengeOne @challenge
  Scenario: crownCastle Apply
    Given I navigate to the checkers challenge
    When I play checkers according to rules
    Then I reset the board
