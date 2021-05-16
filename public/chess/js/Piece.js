import { Move } from "./Move.js";

// https://www.chessprogramming.org/Simplified_Evaluation_Function

export class ChessPiece {
  constructor(type, color, img, posX, posY, value, promoted = false) {
    this.type = type;
    // this.img = await loadImage(`./img/pieces/${img.theme}/${img.name}.png`);
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
    this.promoted = promoted;
    this.enPassant = false;
    this.isKing = this.type === "king" ? true : false;
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
            enPassant = true;
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

    // Special moves(Castling & En Passant)

    // Castling
    if (this.type === "king") {
      if (!this.hasMoved && !this.isChecked) {
        let queenSideRook = board.pieces[this.x - 4][this.y]?.type == "rook" && board.pieces[this.x - 4][this.y].color === this.color ? board.pieces[this.x - 4][this.y] : undefined;
        let kingSideRook = board.pieces[this.x + 3][this.y]?.type == "rook" && board.pieces[this.x + 3][this.y].color === this.color ? board.pieces[this.x + 3][this.y] : undefined;

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

  check(piece, board) {
    if (piece.isKing) {
      piece.isChecked = true;
      board.players[piece.color].isChecked = true;
    }
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
