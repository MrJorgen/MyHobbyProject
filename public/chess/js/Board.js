import { Player } from "./Player.js";
import { ChessPiece } from "./Piece.js";
import { loadImage, black, white, make2dArray } from "./utilities.js";
import { Move } from "./Move.js";

export class ChessBoard {
  constructor(ctx, guideCtx, settings) {
    this.pieces = null;
    this.turn = "white";
    this.ctx = ctx;
    this.squareSize = settings.squareSize;
    this.guides = {
      ctx: guideCtx,
    };
    this.players = {
      white: new Player("white", settings.ai.white),
      black: new Player("black", settings.ai.black),
    };
    this.history = [];
    this.moveIndex = 0;
    this.sounds = { move: new Audio("./sounds/move-self.webm"), capture: new Audio("./sounds/capture.webm"), illegal: new Audio("./sounds/illegal.webm") };
    this.theme = settings.theme;
  }

  async loadPieces(theme) {
    for (let piece of white) {
      let imgSrc = `./img/pieces/${theme}/${piece.imgName}.png`;
      piece.img = await loadImage(imgSrc);
      this.pieces[piece.x][piece.y] = new ChessPiece(piece.type, "white", piece.img, piece.x, piece.y, piece.value);
      this.players.white.pieces.push(this.pieces[piece.x][piece.y]);
    }

    for (let piece of black) {
      let imgSrc = `./img/pieces/${theme}/${piece.imgName}.png`;
      piece.img = await loadImage(imgSrc);
      this.pieces[piece.x][piece.y] = new ChessPiece(piece.type, "black", piece.img, piece.x, piece.y, piece.value);
      this.players.black.pieces.push(this.pieces[piece.x][piece.y]);
    }
  }

  async setup(theme) {
    this.pieces = make2dArray(8, 8);
    await this.loadPieces(theme);
    this.ctx.clearRect(0, 0, this.squareSize * 8, this.squareSize * 8);
    for (let tmp of this.pieces) {
      for (let piece of tmp) {
        if (piece) {
          this.drawPiece(piece, piece);
          piece.findLegalMoves(this);
        }
      }
    }
    this.getAllPossibleMoves();
  }

  makeMove(incomingMove, capture = false, castle = false) {
    let { from, to } = incomingMove;
    if (this.pieces[to.x][to.y]) {
      capture = this.pieces[to.x][to.y];
    }
    let currentMove = new Move({ x: from.x, y: from.y }, to, this.pieces[from.x][from.y], capture, castle);

    // Delete the to square, no matter if there is a piece on it, it is cleared before "landing" on it, just to make sure...
    delete this.pieces[to.x][to.y];
    this.history.push(currentMove);
    this.moveIndex++;
    console.log(this.history);

    this.pieces[to.x][to.y] = this.pieces[from.x][from.y];
    this.pieces[from.x][from.y].move(to);
    delete this.pieces[from.x][from.y];

    // Check if it's a pawn to promote
    this.pawnPromo(to);
    this.updatePieces();
  }

  updatePieces() {
    // When a piece has moved update all pieces legal moves
    for (let x = 0; x < this.pieces.length; x++) {
      for (let y = 0; y < this.pieces[x].length; y++) {
        if (this.pieces[x][y]) {
          this.pieces[x][y].findLegalMoves(this);
        }
      }
    }
    this.getAllPossibleMoves();
  }

  deepEqual(x, y) {
    const ok = Object.keys,
      tx = typeof x,
      ty = typeof y;
    return x && y && tx === "object" && tx === ty ? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key])) : x === y;
  }

  pawnPromo(to) {
    // TODO: Make this so you can chose what to promote to(bishop, knight, rook or queen)
    if (this.pieces[to.x][to.y].type === "pawn" && (to.y === 0 || to.y === 7)) {
      this.pieces[to.x][to.y] = new ChessPiece("queen", this.pieces[to.x][to.y].color, null, this.pieces[to.x][to.y].x, this.pieces[to.x][to.y].y, 9, true);
    }
  }
  demoteToPawn() {}

  unMakeMove() {
    let currentMove = this.history.pop();
    this.moveIndex--;

    console.log(currentMove);
    // Clear spaces
    delete this.pieces[currentMove.to.x][currentMove.to.y];
    delete this.pieces[currentMove.from.x][currentMove.from.y];

    // Place captured piece back
    if (currentMove.capture) {
      this.pieces[currentMove.to.x][currentMove.to.y] = currentMove.capture;
    }

    // Place current piece back
    this.pieces[currentMove.from.x][currentMove.from.y] = currentMove.piece;
    this.pieces[currentMove.from.x][currentMove.from.y].x = currentMove.from.x;
    this.pieces[currentMove.from.x][currentMove.from.y].y = currentMove.from.y;
    this.pieces[currentMove.from.x][currentMove.from.y].hasMoved = currentMove.hasMoved;
    if (currentMove.isCastle) {
      this.unMakeMove();
    }
    this.updatePieces();
  }

  getAllPossibleMoves() {
    this.players.white.pieces = [];
    this.players.black.pieces = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.pieces[x][y]) {
          this.players[this.pieces[x][y].color].pieces.push(this.pieces[x][y]);
        }
      }
    }
    for (let color in this.players) {
      let player = this.players[color];
      player.possibleMoves = [];
      for (let piece of player.pieces) {
        if (piece.legalMoves.length > 0) {
          player.possibleMoves.push({ piece, moves: piece.legalMoves });
        }
      }
    }
  }

  redraw() {
    let startPos = this.squareSize / 2;
    this.ctx.clearRect(startPos, startPos, this.squareSize * 8, this.squareSize * 8);
    for (let x = 0; x < this.pieces.length; x++) {
      for (let y = 0; y < this.pieces[x].length; y++) {
        if (this.pieces[x][y]) {
          let piece = this.pieces[x][y];
          this.ctx.drawImage(piece.img, piece.x * this.squareSize + startPos, piece.y * this.squareSize + startPos, this.squareSize, this.squareSize);
        }
      }
    }
  }

  drawPiece(piece, coords) {
    let { x, y } = coords;
    let startPos = this.squareSize / 2;
    this.ctx.clearRect(startPos + x * this.squareSize, startPos + y * this.squareSize, this.squareSize, this.squareSize);
    this.ctx.drawImage(piece.img, x * this.squareSize + startPos, y * this.squareSize + startPos, this.squareSize, this.squareSize);
  }

  clearSquare(coords) {
    let { x, y } = coords,
      startPos = this.squareSize / 2;
    this.ctx.clearRect(x * this.squareSize + startPos, y * this.squareSize + startPos, this.squareSize, this.squareSize);
  }
}
