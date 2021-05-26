import { Move } from "../Move.js";

// https://www.chessprogramming.org/Simplified_Evaluation_Function

export default class ChessPiece {
  constructor(color, posX, posY) {
    this.color = color;
    this.x = posX;
    this.y = posY;
    this.hasMoved = false;
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

  findLegalMoves(board, onlyCaptures = false) {
    this.legalMoves = [];
    let opponent = board.players[this.color].opponent;
    for (let i = 0; i < this.moves.length; i++) {
      let x = this.x,
        y = this.y,
        repeat = this.moves[i].repeat || false;

      do {
        x += this.moves[i].x || 0;
        y += this.moves[i].y || 0;
        if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
          if (board.pieces[x][y]) {
            repeat = false;
            // Capture opponents piece
            if (board.pieces[x][y].color === opponent) {
              this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x, y }, this, board.pieces[x][y]));
              this.check(board.pieces[x][y], board);
            }
          } else {
            if (!onlyCaptures) {
              // Move to empty square
              this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x, y }, this, false));
            }
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
