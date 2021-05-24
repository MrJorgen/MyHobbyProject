export class Player {
  constructor(color, ai = false) {
    this.color = color;
    this.pieces = [];
    this.possibleMoves = [];
    this.ai = ai;
    this.isChecked = false;
    this.opponent = this.color === "black" ? "white" : "black";
    this.captures = [];
  }

  getKing(board) {
    let myKing = null;
    for (let x = 0; x < board.pieces.length; x++) {
      for (let piece of board.pieces[x]) {
        if (piece && piece.isKing && piece.color === this.color) {
          myKing = piece;
        }
      }
    }
    if (myKing === null) {
      console.log(board);
      debugger;
      throw new Error(this.color + " has no king!");
    }
    return myKing;
  }
}
