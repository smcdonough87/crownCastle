const { Given, When, Then } = require("@cucumber/cucumber");
const fetch = require("node-fetch");

let deckId;
let playerOneCards = [];
let playerTwoCards = [];

Given("the Deck of Cards API is up", async function () {
  const response = await fetch("https://deckofcardsapi.com/");
  if (response.status !== 200) {
    throw new Error("API is down");
  }
});

Given("a new deck is created", async function () {
  const response = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  );
  const data = await response.json();
  deckId = data.deck_id;
});

When("the new deck is shuffled", async function () {
  await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
});

When("three cards are dealt to player one", async function () {
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`
  );
  const data = await response.json();
  playerOneCards = data.cards;
});

When("three cards are dealt to player two", async function () {
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`
  );
  const data = await response.json();
  playerTwoCards = data.cards;
});

Then("check if any player has Blackjack", function () {
  const checkBlackjack = (cards) => {
    let hasAce = cards.some((card) => card.value === "ACE");
    let hasTenOrFaceCard = cards.some((card) =>
      ["10", "JACK", "QUEEN", "KING"].includes(card.value)
    );
    return hasAce && hasTenOrFaceCard;
  };

  const playerOneBlackjack = checkBlackjack(playerOneCards);
  const playerTwoBlackjack = checkBlackjack(playerTwoCards);

  if (playerOneBlackjack || playerTwoBlackjack) {
    const winner =
      playerOneBlackjack && playerTwoBlackjack
        ? "Both players"
        : playerOneBlackjack
        ? "Player One"
        : "Player Two";
    console.log(`${winner} has Blackjack!`);
  } else {
    console.log("No player has Blackjack.");
  }
});
