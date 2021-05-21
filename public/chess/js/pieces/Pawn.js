import { Move } from "../Move.js";
import ChessPiece from "./Piece.js";
import Queen from "./Queen.js";
import Rook from "./Rook.js";
import Bishop from "./Bishop.js";
import Knight from "./Knight.js";

export default class Pawn extends ChessPiece {
  constructor(color, img, posX, posY) {
    super(color, img, posX, posY);
    this.type = "pawn";
    this.value = 100;
    if (color === "white") {
      this.moves = { x: 0, y: -1 };
      if (this.y !== 6) this.hasMoved = true;
    } else if (color == "black") {
      if (this.y !== 1) this.hasMoved = true;
      this.moves = { x: 0, y: 1 };
    }
  }

  findLegalMoves(board) {
    this.legalMoves = [];
    let opponent = board.players[this.color].opponent;
    let x = this.x,
      y = this.y,
      repeat = false;

    let enPassant = false;

    do {
      x += this.moves.x;
      y += this.moves.y;
      if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        // Pawn captures
        if (!repeat) {
          if (x >= 1 && board.pieces[x - 1][y] && board.pieces[x - 1][y].color === opponent) {
            this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x: x - 1, y }, this, board.pieces[x - 1][y]));
            if (y === 0 || y === 7) this.promoteMove({ x, y });
            this.check(board.pieces[x - 1][y], board);
          }
          if (x <= 6 && board.pieces[x + 1][y] && board.pieces[x + 1][y].color === opponent) {
            this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x: x + 1, y }, this, board.pieces[x + 1][y]));
            if (y === 0 || y === 7) this.promoteMove({ x, y });
            this.check(board.pieces[x + 1][y], board);
          }

          // En Passant capture
          if (board.enPassant && y === board.enPassant.y && (board.enPassant.x === x - 1 || board.enPassant.x === x + 1)) {
            this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x: board.enPassant.x, y: board.enPassant.y }, this, board.pieces[board.enPassant.x][board.enPassant.y - this.moves.y]));
          }

          // Repeat to make the pawn double move
          if (!this.hasMoved) {
            repeat = true;
          }
        } else if (repeat) {
          // This is the double push
          repeat = false;
          enPassant = true;
        }

        if (board.pieces[x][y]) {
          repeat = false;
        } else {
          // Move to empty square
          this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x, y }, this, false));
          if (y === 0 || y === 7) this.promoteMove({ x, y });
          this.legalMoves[this.legalMoves.length - 1].enPassant = enPassant;
        }
      } else {
        // Can't move more because on the edge of the board
        repeat = false;
      }
    } while (repeat);
  }

  promoteMove(pos) {
    let currentMove = this.legalMoves.pop();
    let piecesArray = [
      new Queen(this.color, null, pos.x, pos.y, false),
      new Rook(this.color, null, pos.x, pos.y, false),
      new Bishop(this.color, null, pos.x, pos.y, false),
      new Knight(this.color, null, pos.x, pos.y, false),
    ];
    for (let piece of piecesArray) {
      piece.promoted = true;
      let newMove = new Move({ x: this.x, y: this.y }, pos, piece);
      newMove.promote = true;
      newMove.capture = currentMove.capture;
      newMove.to = currentMove.to;
      newMove.from = currentMove.from;
      newMove.hasMoved = true;
      newMove.weight = piece.value - currentMove.capture.value || 0;

      this.legalMoves.push(newMove);
    }
  }
}
