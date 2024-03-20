const { Given, When, Then } = require("@cucumber/cucumber");
const { assert } = require("chai");
const CrownCastle = require("../../driverPlaywright/interview/checkersGame");

Given("I navigate to the checkers challenge", async function () {
  const crownCastle = new CrownCastle(this.page);
  await crownCastle.goToCheckers();
});

When("I play checkers according to rules", async function () {
  const crownCastle = new CrownCastle(this.page);
  await crownCastle.playCheckers();
  const bluePieceCount = await crownCastle.evaluateResults(11);
  assert.equal(bluePieceCount, 11, "Count of blue pieces is not 11");
});

Then("I reset the board", async function () {
  const crownCastle = new CrownCastle(this.page);
  await crownCastle.restartBoard();
  const finalCount = await crownCastle.evaluateResults(12);
  assert.equal(finalCount, 12, "Count of Blue pieces is not 12");
});