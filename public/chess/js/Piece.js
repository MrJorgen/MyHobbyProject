export class ChessPiece {
  constructor(type, color, img, posX, posY, value) {
    this.type = type;
    this.img = img;
    this.x = posX;
    this.y = posY;
    this.color = color;
    this.hasMoved = false;
    if (type !== "pawn") {
      this.moves = moves[this.type];
    } else {
      if (color === "white") {
        this.moves = [{ y: -1 }];
      } else if (color == "black") {
        this.moves = [{ y: 1 }];
      }
    }
    this.value = value;
    this.pinned = false;
    this.legalMoves = [];
  }

  move(to) {
    this.x = to.x;
    this.y = to.y;
    this.hasMoved = true;
  }

  findLegalMoves(board) {
    this.legalMoves = [];
    for (let i = 0; i < this.moves.length; i++) {
      let x = this.x,
        y = this.y,
        repeat = this.moves[i].repeat || false;

      do {
        x += this.moves[i].x || 0;
        y += this.moves[i].y || 0;
        if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
          // Pawn captures
          if (this.type === "pawn" && !repeat) {
            if (x >= 1 && board.pieces[x - 1][y] && board.pieces[x - 1][y].color !== this.color) {
              this.legalMoves.push({ x: x - 1, y, isCapture: true });
            }
            if (x <= 6 && board.pieces[x + 1][y] && board.pieces[x + 1][y].color !== this.color) {
              this.legalMoves.push({ x: x + 1, y, isCapture: true });
            }
            if ((this.color === "white" && this.y === 6) || (this.color === "black" && this.y === 1)) {
              repeat = true;
            }
          } else if (this.type === "pawn" && repeat) {
            repeat = false;
          }

          if (board.pieces[x][y]) {
            repeat = false;
            // Take opponents piece
            if (board.pieces[x][y].color !== this.color && this.type !== "pawn") {
              this.legalMoves.push({ x, y, isCapture: true });
            }
          } else {
            // Move to empty square
            this.legalMoves.push({ x, y, isCapture: false });
          }
        } else {
          repeat = false;
        }
      } while (repeat);
    }
    // Special moves

    /*
    NOT READY TO IMPLEMENT!!!
    -----------------------------------------------------------
    // Castling
    if (this.type === "king") {
      if (!this.hasMoved) {
        let queenSideRook = board.pieces[this.x - 4][this.y]?.type == "rook" && board.pieces[this.x - 4][this.y].color === this.color ? board.pieces[this.x - 4][this.y] : undefined;
        let kingSideRook = board.pieces[this.x + 3][this.y]?.type == "rook" && board.pieces[this.x + 3][this.y].color === this.color ? board.pieces[this.x + 3][this.y] : undefined;

        // Queenside
        if (!this.isChecked && !queenSideRook?.hasMoved) {
          // Check if the squares are empty
          for (let i = this.x - 1; i > queenSideRook.x; i--) {
            if (!board.pieces[i][this.y]) {
              console.error(board.pieces[i][this.y]);
            }
          }
        }
        // Kingside
        if (!this.isChecked && !kingSideRook?.hasMoved) {
          for (let i = this.x + 1; i < kingSideRook.x; i++) {
            if (!board.pieces[i][this.y]) {
              console.log(board.pieces[i][this.y]);
            }
          }
          // Check if the king moves through check or ends up in check
        }

        // Kingside
        if (!this.isChecked && !this.hasMoved && !kingSideRook?.hasMoved) {
        }
      }
    }
    ------------------------------------------------------------
    */
  }
}

// How the pieces move
const moves = {
  rook: [
    { x: 1, repeat: true },
    { x: -1, repeat: true },
    { y: 1, repeat: true },
    { y: -1, repeat: true },
  ],
  knight: [
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: -2, y: 1 },
    { x: -2, y: -1 },
    { x: 1, y: 2 },
    { x: 1, y: -2 },
    { x: -1, y: 2 },
    { x: -1, y: -2 },
  ],
  bishop: [
    { x: 1, y: 1, repeat: true },
    { x: 1, y: -1, repeat: true },
    { x: -1, y: 1, repeat: true },
    { x: -1, y: -1, repeat: true },
  ],
  queen: [
    { x: 1, repeat: true },
    { x: -1, repeat: true },
    { y: 1, repeat: true },
    { y: -1, repeat: true },
    { x: 1, y: 1, repeat: true },
    { x: 1, y: -1, repeat: true },
    { x: -1, y: 1, repeat: true },
    { x: -1, y: -1, repeat: true },
  ],
  king: [{ x: 1 }, { x: -1 }, { y: 1 }, { y: -1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }],
};
