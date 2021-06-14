export class Player {
  constructor(color, ai = false) {
    this.color = color;
    this.possibleMoves = [];
    this.ai = ai;
    this.isChecked = false;
    this.opponent = this.color === "black" ? "white" : "black";
    this.captures = [];
  }

  getMyPieces(board) {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (board.pieces[x][y] && board.pieces[x][y].color === this.color) {
          this.pieces = board.pieces[x][y];
        }
      }
    }
  }

  collectPossibleMoves() {}

  getKing(board) {
    outerLoop: for (let x = 0; x < board.pieces.length; x++) {
      for (let piece of board.pieces[x]) {
        if (piece && piece.isKing && piece.color === this.color) {
          return piece;
        }
      }
    }
    if (board.settings.debug) {
      for (let i = 0; i < board.history.length; i++) {
        console.log(`From: (x: ${board.history[i].from.x} y: ${board.history[i].from.y}) To: (x: ${board.history[i].to.x} y: ${board.history[i].to.y})`);
      }
      console.log(board);
    }
    throw new ReferenceError(this.color.charAt(0).toUpperCase() + this.color.slice(1) + " has no King");
  }
}
