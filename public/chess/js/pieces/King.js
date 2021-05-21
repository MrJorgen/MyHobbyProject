import { Move } from "../Move.js";
import ChessPiece from "./Piece.js";

export default class King extends ChessPiece {
  constructor(color, img, posX, posY) {
    super(color, img, posX, posY);
    this.type = "king";
    this.value = Infinity;
    this.moves = [{ x: 1 }, { x: -1 }, { y: 1 }, { y: -1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }];
    this.isKing = true;
  }

  findLegalMoves(board) {
    super.findLegalMoves(board);
    if (this.x === 4) {
      if (!this.hasMoved && !this.isChecked) {
        let queenSideRook = undefined;
        if (board.pieces[this.x - 4][this.y] && board.pieces[this.x - 4][this.y].type === "rook" && board.pieces[this.x - 4][this.y].color === this.color) {
          queenSideRook = board.pieces[this.x - 4][this.y];
        }

        let kingSideRook = undefined;
        if (board.pieces[this.x + 3][this.y] && board.pieces[this.x + 3][this.y].type === "rook" && board.pieces[this.x + 3][this.y].color === this.color) {
          kingSideRook = board.pieces[this.x + 3][this.y];
        }

        // Queenside
        if (queenSideRook && !queenSideRook.hasMoved) {
          let canCastle = true;
          // Check if the squares are empty
          for (let x = this.x - 1; x > queenSideRook.x; x--) {
            if (board.pieces[x][this.y]) {
              // Square is occupied
              canCastle = false;
              break;
            } else {
              // Square is empty, now check if it's attacked
              let opponent = this.color == "black" ? "white" : "black";
              opponent = board.players[opponent];

              // Get opponents possible moves
              for (let move of opponent.possibleMoves) {
                // Compare squares
                if (move.x === x && move.y === this.y && x >= this.x - 2) {
                  canCastle = false;
                }
                if (!canCastle) break;
              }
            }
          }
          if (canCastle) {
            this.legalMoves.push(
              // prettier-ignore
              new Move(
                  { x: this.x, y: this.y },
                  { x: this.x - 2, y: this.y },
                  this,
                  false,
                  new Move({ x: this.x - 4, y: this.y }, { x: this.x - 1, y: this.y }, queenSideRook, false, false, true),
                  false,
                  3)
            );
          }
        }
        // Kingside
        if (kingSideRook && !kingSideRook.hasMoved) {
          let canCastle = true;
          // Check if the squares are empty
          for (let x = this.x + 1; x < kingSideRook.x; x++) {
            if (board.pieces[x][this.y]) {
              // Square is occupied
              canCastle = false;
              break;
            } else {
              // Square is empty, now check if it's attacked
              let opponent = this.color == "black" ? "white" : "black";
              opponent = board.players[opponent];

              // Get opponents possible moves
              for (let move of opponent.possibleMoves) {
                // Compare squares
                if (move.x === x && move.y === this.y && x >= this.x + 2) {
                  canCastle = false;
                }
                if (!canCastle) break;
              }
            }
          }
          if (canCastle) {
            // prettier-ignore
            this.legalMoves.push(
                new Move(
                  { x: this.x, y: this.y },
                  { x: this.x + 2, y: this.y },
                  this,
                  false,
                  new Move({ x: this.x + 3, y: this.y }, { x: this.x + 1, y: this.y }, kingSideRook, false, false, true),
                  false,
                  3)
              );
          }
        }
      }
    }
  }
}
