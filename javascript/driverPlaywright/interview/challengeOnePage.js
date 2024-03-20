const BasePage = require("../basePage");

class CrownCastle extends BasePage {
  constructor(page) {
    super(page);
    this.checkersChallengeUrl =
      "https://www.gamesforthebrain.com/game/checkers/";
    //this.contentLoaded = this.page.locator('[id="board"]')
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

  async movePiece(firstPosition, secondPosition) {
    let counter = 0;
    await this.waiting.waitFor({ state: "detached" });
    await this.doClick(firstPosition);
    while (counter < 5) {
        await this.page.waitForTimeout(500);
        counter++;
        if (await this.pieceSelected.isVisible()) {
            await this.doClick(secondPosition);
            break;
        } else if (await this.waiting.isVisible()) {
            console.log("Waiting element appeared, clicking first position again...");
            await this.doClick(firstPosition);
        } else {
            console.log("Piece not selected yet.");
        }
    }
    if (counter >= 5) {
        console.log("Failed to select piece within 5 attempts.");
    }
    await this.computersMove.waitFor({ state: "detached" });
    await this.makeMove.waitFor({ state: "visible" });
}

  async evaluateResults() {
    await this.page.waitForTimeout(3000);
    const bluePieceCount = await this.bluePieces.count();
    return bluePieceCount;
  }

  async restartBoard() {
    await this.doClick(this.restart);
    await this.restarted.waitFor({ state: "visible" });
  }
}

module.exports = CrownCastle;
