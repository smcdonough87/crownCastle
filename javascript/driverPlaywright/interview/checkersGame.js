const BasePage = require("../basePage");
const { expect } = require('@playwright/test');

class CrownCastle extends BasePage {
  constructor(page) {
    super(page);
    this.checkersChallengeUrl =
      "https://www.gamesforthebrain.com/game/checkers/";
    this.selectPieceOne = this.page.locator('[name="space42"]').first();
    this.moveOne = this.page.locator('[name="space33"]');
    this.moveTwo = this.page.locator('[name="space24"]');
    this.selectPieceTwo = this.page.locator('[name="space02"]');
    this.selectPieceThree = this.page.locator('[name="space51"]');
    this.selectPieceFour = this.page.locator('[name="space62"]');
    this.lastMove = this.page.locator('[name="space53"]');
    this.makeMove = this.page.getByText("Make a move.");
    this.pieceSelected = this.page.locator('[src="you2.gif"]');
    this.bluePieces = this.page.locator('[src="me1.gif"]');
    this.computersMove = this.page.locator('[src="me2.gif"]');
    this.restart = this.page.getByText("Restart...");
    this.waiting = this.page.getByText("Please wait.");
    this.restarted = this.page.getByText("Select an orange piece to move.");
  }

  //navigate to checkers game
  async goToCheckers() {
    await this.navigate(this.checkersChallengeUrl);
    await this.restarted.waitFor({ state: "visible" });
  }

  // board is set up with cartesian coordinates 0,0 = bottom right
  async playCheckers() {
    await this.movePiece(this.selectPieceOne, this.moveOne);
    await this.movePiece(this.moveOne, this.moveTwo);
    await this.movePiece(this.selectPieceTwo, this.moveTwo);
    await this.movePiece(this.selectPieceThree, this.selectPieceOne);
    await this.movePiece(this.selectPieceFour, this.lastMove);
  }

  //moves pieces by ensuring each piece is selected first,
  //loops if not selected,
  //then selects next space
  async movePiece(firstPosition, secondPosition) {
    await this.waiting.waitFor({ state: "detached" });
    await this.doClick(firstPosition);

    let counter = 0;
    let pieceSelectedVisible = false;
  
    while (counter < 5 && !pieceSelectedVisible) {
      await this.doClick(firstPosition);
      await this.page.waitForTimeout(500);
      pieceSelectedVisible = await this.pieceSelected.isVisible();
      counter+= 1;
    }

    if (counter >= 5) {
      console.log("Failed to select piece within 5 attempts.");
    }
    await this.doClick(secondPosition)

    await this.computersMove.waitFor({ state: "detached" });
    await this.makeMove.waitFor({ state: "visible" });
  }

  //this function ensures that the correct number of blue pieces are on the board
  //both after a piece has been taken and after the board has been reset
  async evaluateResults(expectedCount) {
    // Wait for the count of blue pieces to equal expectedCount
    await expect(this.bluePieces).toHaveCount(expectedCount);
    const bluePieceCount = await this.bluePieces.count();
    return bluePieceCount;
  }
  

  //resets the game
  async restartBoard() {
    await this.doClick(this.restart);
    await this.restarted.waitFor({ state: "visible" });
  }
}

module.exports = CrownCastle;