export class Player {
  constructor(color, ai = false) {
    this.color = color;
    this.pieces = [];
    this.possibleMoves = [];
    this.ai = ai;
    this.checked = false;
  }

  updatePieces(board) {
    this.pieces = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (board.pieces[x][y]) {
          this.pieces.push(board.pieces[x][y]);
        }
      }
    }
  }
}
