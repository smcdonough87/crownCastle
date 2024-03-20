Feature: CrownCastle Interview

  @playwright @crownCastleChallengeTwo @challenge
  Scenario: crownCastle Apply
    Given the Deck of Cards API is up
    Given a new deck is created
    When the new deck is shuffled
    When three cards are dealt to player one
    When three cards are dealt to player two
    Then check if any player has Blackjack
