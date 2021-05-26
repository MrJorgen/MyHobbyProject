export class Player {
  constructor(color, ai = false) {
    this.color = color;
    this.possibleMoves = [];
    this.ai = ai;
    this.isChecked = false;
    this.opponent = this.color === "black" ? "white" : "black";
    this.captures = [];
  }

  getKing(board) {
    outerLoop: for (let x = 0; x < board.pieces.length; x++) {
      for (let piece of board.pieces[x]) {
        if (piece && piece.isKing && piece.color === this.color) {
          return piece;
        }
      }
    }
    console.log(board);
    throw new ReferenceError(this.color.charAt(0).toUpperCase() + this.color.slice(1) + " has no King");
  }
}
