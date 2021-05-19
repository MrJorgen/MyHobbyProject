import { Move } from "../Move.js";

// https://www.chessprogramming.org/Simplified_Evaluation_Function

export class ChessPiece {
  constructor(color, img, posX, posY) {
    this.img = img;
    this.x = posX;
    this.y = posY;
    this.color = color;
    this.hasMoved = false;
    this.pinned = false;
    this.legalMoves = [];
    this.enPassant = false;
  }

  move(to, skipUpdate) {
    if (this.type === "pawn" && !skipUpdate) {
      this.value += Math.abs(this.y - to.y) * 10;
    }
    this.x = to.x;
    this.y = to.y;
    this.hasMoved = true;
  }

  findLegalMoves(board) {
    this.legalMoves = [];
    let opponent = board.players[this.color].opponent;
    for (let i = 0; i < this.moves.length; i++) {
      let x = this.x,
        y = this.y,
        repeat = this.moves[i].repeat || false;

      let enPassant = false;

      do {
        x += this.moves[i].x || 0;
        y += this.moves[i].y || 0;
        if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
          // Pawn captures
          if (this.type === "pawn" && !repeat) {
            if (x >= 1 && board.pieces[x - 1][y] && board.pieces[x - 1][y].color === opponent) {
              this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x: x - 1, y }, this, board.pieces[x - 1][y]));
              this.check(board.pieces[x - 1][y], board);
            }
            if (x <= 6 && board.pieces[x + 1][y] && board.pieces[x + 1][y].color === opponent) {
              this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x: x + 1, y }, this, board.pieces[x + 1][y]));
              this.check(board.pieces[x + 1][y], board);
            }
            if (!this.hasMoved) {
              repeat = true;
            }
          } else if (this.type === "pawn" && repeat) {
            repeat = false;
            board.enPassant = this;
          }

          if (board.pieces[x][y]) {
            repeat = false;
            // Capture opponents piece
            if (board.pieces[x][y].color === opponent && this.type !== "pawn") {
              this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x, y }, this, board.pieces[x][y]));
              this.check(board.pieces[x][y], board);
            }
          } else {
            // Move to empty square
            this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x, y }, this, false));
            this.enPassant = enPassant;
          }
        } else {
          repeat = false;
        }
      } while (repeat);
    }
  }

  check(piece, board) {
    if (piece.isKing) {
      piece.isChecked = true;
      board.players[piece.color].isChecked = true;
    }
  }
}
