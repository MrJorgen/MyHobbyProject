import { Move } from "../Move.js";
import ChessPiece from "./Piece.js";

export default class King extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);
    this.type = "king";
    this.value = Infinity;
    this.moves = [{ x: 1 }, { x: -1 }, { y: 1 }, { y: -1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }];
    this.isKing = true;
    this.isChecked = false;
  }

  findLegalMoves(board, onlyCaptures = false) {
    // Add the kings normal moves
    super.findLegalMoves(board, onlyCaptures);

    // Exit if only capture moves are collected
    if (onlyCaptures) return;

    // Add the kings special moves(castling)
    if (this.x === 4 && (this.y == 7 || this.y == 0)) {
      if (!this.hasMoved && !this.isChecked) {
        let queenSideRook = undefined;
        if (board.pieces[this.x - 4][this.y] && board.pieces[this.x - 4][this.y].type === "rook" && board.pieces[this.x - 4][this.y].color === this.color) {
          queenSideRook = board.pieces[this.x - 4][this.y];
        }

        let kingSideRook = undefined;
        if (board.pieces[this.x + 3][this.y] && board.pieces[this.x + 3][this.y].type === "rook" && board.pieces[this.x + 3][this.y].color === this.color) {
          kingSideRook = board.pieces[this.x + 3][this.y];
        }

        let opponent = this.color == "black" ? "white" : "black";
        opponent = board.players[opponent];

        // Queenside
        if (queenSideRook && !queenSideRook.hasMoved) {
          let canCastle = true;
          // Check if the squares are empty
          for (let x = this.x - 1; x > queenSideRook.x; x--) {
            if (board.pieces[x][this.y]) {
              // Square is occupied
              canCastle = false;
              break;
            }
          }
          // Check if it's attacked
          // Get opponents attacked squares
          if (canCastle) {
            for (let move of opponent.attackedSquares) {
              // Compare squares
              if (move.y === this.y) {
                if (move.x === this.x - 2 || move.x === this.x - 1) {
                  canCastle = false;
                  break;
                }
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
            }
          }
          // Check if it's attacked
          // Get opponents attacked squares
          if (canCastle) {
            for (let move of opponent.attackedSquares) {
              // Compare squares
              if (move.y === this.y) {
                if (move.x === this.x + 2 || move.x === this.x + 1) {
                  canCastle = false;
                  break;
                }
              }
            }
          }
          if (canCastle) {
            // prettier-ignore
            // Move constructor(from, to, piece, capture = false, castle = false, isCastleRookMove = false, weight = 0)
            this.legalMoves.push(
                new Move(
                  { x: this.x, y: this.y }, // from
                  { x: this.x + 2, y: this.y }, // to
                  this, // piece
                  false, // capture
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
