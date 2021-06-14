import { Move } from "../Move.js";

// https://www.chessprogramming.org/Simplified_Evaluation_Function

export default class ChessPiece {
  constructor(color, posX, posY) {
    this.color = color;
    this.x = posX;
    this.y = posY;
    this.hasMoved = false;
    this.legalMoves = [];
    this.attackSquares = [];
    this.pinnedSquares = [];
    this.enPassant = false;
    this.isChecking = false;
    this.isPinned = false;
    this.isSlidingPiece = false;
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
    this.attackSquares = [];
    this.isChecking = false;
    let opponent = board.players[this.color].opponent,
      blocksAdded = false;

    for (let i = 0; i < this.moves.length; i++) {
      let branchMoves = [];
      let x = this.x,
        y = this.y,
        repeat = this.isSlidingPiece,
        pinnedPiece = null,
        searchPin = false,
        pinnedSquares = [];

      do {
        x += this.moves[i].x || 0;
        y += this.moves[i].y || 0;
        if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
          if (board.pieces[x][y]) {
            // Capture opponents piece
            if (board.pieces[x][y].color === opponent) {
              if (!searchPin) {
                this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x, y }, this, board.pieces[x][y]));
                this.check(board.pieces[x][y], board);
              }
              if (searchPin && board.pieces[x][y].isKing) {
                pinnedPiece.isPinned = true;
                pinnedPiece.pinnedSquares = [...pinnedSquares, { x: this.x, y: this.y }];
                repeat = false;
              }
              if (searchPin && !board.pieces[x][y].isKing) {
                pinnedPiece.isPinned = false;
                searchPin = false;
                repeat = false;
              }
              if (!searchPin && !board.pieces[x][y].isKing) {
                pinnedPiece = board.pieces[x][y];
                searchPin = true;
              }
            } else if (board.pieces[x][y].color === this.color) {
              if (!searchPin) {
                branchMoves.push({ x, y });
              }
              repeat = false;
            }
          } else {
            if (!onlyCaptures) {
              // Move to empty square
              if (!searchPin) {
                this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x, y }, this, false));
                branchMoves.push({ x, y });
              }
              pinnedSquares.push({ x, y });
            }
          }
          if (this.isSlidingPiece && this.isChecking && !blocksAdded) {
            board.players[opponent].blockSquares = [{ x: this.x, y: this.y }];
            board.players[opponent].blockSquares.push(...branchMoves);
            x += this.moves[i].x || 0;
            y += this.moves[i].y || 0;
            if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
              branchMoves.push({ x, y });
            }
            blocksAdded = true;
          }
          if (!this.isSlidingPiece && this.isChecking && !blocksAdded) {
            board.players[opponent].blockSquares = [{ x: this.x, y: this.y }];
            blocksAdded = true;
          }
        } else {
          repeat = false;
        }
      } while (repeat);
      this.attackSquares.push(...branchMoves);
    }
  }

  getAttackSquares(board, onlyCaptures = false) {
    this.attackSquares = [];

    for (let i = 0; i < this.moves.length; i++) {
      let branchMoves = [];
      let x = this.x,
        y = this.y,
        repeat = this.isSlidingPiece,
        pinnedPiece = null,
        searchPin = false,
        pinnedSquares = [];

      do {
        x += this.moves[i].x || 0;
        y += this.moves[i].y || 0;
        if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
          if (board.pieces[x][y]) {
            // Capture opponents piece
            if (board.pieces[x][y].color === opponent) {
              if (!searchPin) {
                this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x, y }, this, board.pieces[x][y]));
                this.check(board.pieces[x][y], board);
              }
              if (searchPin && board.pieces[x][y].isKing) {
                pinnedPiece.isPinned = true;
                pinnedPiece.pinnedSquares = [...pinnedSquares, { x: this.x, y: this.y }];
                repeat = false;
              }
              pinnedPiece = board.pieces[x][y];
              searchPin = true;
            } else if (board.pieces[x][y].color === this.color) {
              if (!searchPin) {
                branchMoves.push({ x, y });
              }
              repeat = false;
            }
          } else {
            if (!onlyCaptures) {
              // Move to empty square
              if (!searchPin) {
                this.legalMoves.push(new Move({ x: this.x, y: this.y }, { x, y }, this, false));
                branchMoves.push({ x, y });
              }
              pinnedSquares.push({ x, y });
            }
          }
          if (this.isSlidingPiece && this.isChecking && !blocksAdded) {
            board.players[opponent].blockSquares = [{ x: this.x, y: this.y }];
            board.players[opponent].blockSquares.push(...branchMoves);
            x += this.moves[i].x || 0;
            y += this.moves[i].y || 0;
            if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
              branchMoves.push({ x, y });
            }
            blocksAdded = true;
          }
          if (!this.isSlidingPiece && this.isChecking && !blocksAdded) {
            board.players[opponent].blockSquares = [{ x: this.x, y: this.y }];
            blocksAdded = true;
          }
        } else {
          repeat = false;
        }
      } while (repeat);
      this.attackSquares.push(...branchMoves);
    }
  }

  check(piece, board) {
    if (piece.isKing) {
      this.isChecking = true;
      piece.isChecked = true;
      board.players[piece.color].isChecked = true;
    }
  }
}
