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

  // updatePieces(board) {
  //   this.pieces = [];
  //   for (let x = 0; x < 8; x++) {
  //     for (let y = 0; y < 8; y++) {
  //       if (board.pieces[x][y] && board.pieces[x][y].color === this.color) {
  //         this.pieces.push(board.pieces[x][y]);
  //       }
  //     }
  //   }
  // }

  getKing(board) {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (board.pieces[x][y] && board.pieces[x][y].color === this.color && board.pieces[x][y].isKing) {
          return board.pieces[x][y];
        }
      }
    }
  }
}
