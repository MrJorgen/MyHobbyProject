import { Player } from "./Player.js";
import { ChessPiece } from "./Piece.js";
import { loadImage, colors, make2dArray } from "./utilities.js";
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
    this.verify = false;
    this.tmpIndex = 0;
  }

  async loadPieces(theme) {
    for (let color of colors) {
      for (let piece of color) {
        let img = await loadImage(`./img/pieces/${theme}/${piece.imgName}.png`);
        this.pieces[piece.x][piece.y] = new ChessPiece(piece.type, piece.color, img, piece.x, piece.y, piece.value);
        if (this.pieces[piece.x][piece.y].type === "king") {
          this.pieces[piece.x][piece.y].isKing = true;
        }
        this.players[piece.color].pieces.push(this.pieces[piece.x][piece.y]);
      }
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
    let { from, to } = incomingMove,
      myColor = this.pieces[from.x][from.y].color;
    if (this.pieces[to.x][to.y]) {
      capture = this.pieces[to.x][to.y];
    }
    let currentMove = new Move({ x: from.x, y: from.y }, to, this.pieces[from.x][from.y], capture, castle);

    // Delete the to square, just to make sure it is empty when landing on it
    delete this.pieces[to.x][to.y];
    this.history.push(currentMove);
    this.moveIndex++;

    this.pieces[to.x][to.y] = this.pieces[from.x][from.y];
    this.pieces[from.x][from.y].move(to);
    delete this.pieces[from.x][from.y];

    // Player has made a move and should no longer be in check(or else it would be illegal)
    this.players[myColor].isChecked = false;
    for (let piece of this.players[myColor].pieces) {
      if (piece.isKing) {
        piece.isChecked = false;
        break;
      }
    }

    // Check if it's a pawn to promote
    this.pawnPromo(to);
    this.updatePieces(this.players[myColor].opponent);
  }

  updatePieces(color) {
    // When a piece has moved update player[color] pieces legal moves
    for (let x = 0; x < this.pieces.length; x++) {
      for (let y = 0; y < this.pieces[x].length; y++) {
        if (this.pieces[x][y] && this.pieces[x][y].color === color) {
          this.pieces[x][y].findLegalMoves(this);
        }
      }
    }
    this.getAllPossibleMoves([color]);
  }

  pawnPromo(to) {
    // TODO: Make this so you can chose what to promote to(bishop, knight, rook or queen)
    if (this.pieces[to.x][to.y].type === "pawn" && (to.y === 0 || to.y === 7)) {
      this.pieces[to.x][to.y] = new ChessPiece("queen", this.pieces[to.x][to.y].color, null, this.pieces[to.x][to.y].x, this.pieces[to.x][to.y].y, 9, true);
    }
  }

  unMakeMove() {
    let currentMove = this.history.pop();
    this.moveIndex--;

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
    this.updatePieces(currentMove.piece.color);
  }

  getAllPossibleMoves(colors = ["black", "white"]) {
    // Update what pieces the players "own"
    for (let color of colors) {
      this.players[color].pieces = [];
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          if (this.pieces[x][y] && this.pieces[x][y].color == color) {
            this.players[color].pieces.push(this.pieces[x][y]);
          }
        }
      }
    }

    // Make an array of possible moves for each player
    for (let color in this.players) {
      let player = this.players[color];
      player.possibleMoves = [];
      for (let piece of player.pieces) {
        if (piece.legalMoves.length > 0) {
          for (let i = 0; i < piece.legalMoves.length; i++) {
            player.possibleMoves.push(piece.legalMoves[i]);
          }
        }
      }
    }

    if (colors.length < 2 && !this.verify) {
      this.verifyMoves(colors[0]);
    }
  }

  verifyMoves(color) {
    this.tmpIndex++;
    console.log(this.tmpIndex);
    let player = this.players[color],
      illegalMoves = [],
      myKing;
    this.verify = true;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.pieces[x][y] && this.pieces[x][y].isKing && this.pieces[x][y].color === color) {
          myKing = this.pieces[x][y];
        }
      }
    }
    for (let move of player.possibleMoves) {
      myKing.isChecked = false;
      // console.log(player);
      this.makeMove(move);
      if (myKing.isChecked) {
        // Remove this move from the array
        console.log("Illegal move found!");
        // ---------------------------------------------
        // Remove illegal move from the array!!!!!!!!!!!!!!!!!!
      }
      this.unMakeMove();
    }
    this.updatePieces(this.players[color].opponent);
    this.verify = false;
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
