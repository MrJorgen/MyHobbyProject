"use strict";
import { Player } from "./Player.js";
import { Rook } from "./pieces/Rook.js";
import { Knight } from "./pieces/Knight.js";
import { Bishop } from "./pieces/Bishop.js";
import { Queen } from "./pieces/Queen.js";
import { King } from "./pieces/King.js";
import { Pawn } from "./pieces/Pawn.js";
import { loadImage, colors, make2dArray } from "./utilities.js";

export class ChessBoard {
  constructor(ctx, settings) {
    this.pieces = null;
    this.turn = "white";
    this.ctx = ctx;
    this.squareSize = settings.squareSize;
    this.players = {
      white: new Player("white", settings.ai.white),
      black: new Player("black", settings.ai.black),
    };
    this.history = [];
    this.moveIndex = 0;
    this.sounds = { move: new Audio("./sounds/move-self.webm"), capture: new Audio("./sounds/capture.webm"), illegal: new Audio("./sounds/illegal.webm") };
    this.theme = settings.theme;
    this.verify = false;
    this.calculatedMoves = 0;
    this.latestVerifiedMove = null;
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    this.fiftyMove = 0;
  }

  async decodeFen(fen) {
    this.fen = fen || this.fen;
    if (this.fen) {
      this.clearAll();
      console.log(this);
      let fenArray = this.fen.split(" ");
      let x = 0,
        y = 0,
        pieceChars = "rnbqkpRNBQKP";
      for (let char of fenArray[0]) {
        if (char !== "/") {
          if (pieceChars.includes(char)) {
            let tmpPiece = {};

            // Check if Char is lower- or uppercase(black or white)
            if (char === char.toLowerCase()) {
              tmpPiece.color = "black";
              tmpPiece.imgName = `./img/pieces/${this.theme}/b`;
            } else {
              tmpPiece.color = "white";
              tmpPiece.imgName = `./img/pieces/${this.theme}/w`;
            }

            tmpPiece.imgName += `${char.toLowerCase()}.png`;
            tmpPiece.x = x;
            tmpPiece.y = y;
            tmpPiece.img = await loadImage(tmpPiece.imgName);

            switch (char.toLowerCase()) {
              case "r":
                this.pieces[x][y] = new Rook(tmpPiece.color, tmpPiece.img, tmpPiece.x, tmpPiece.y, tmpPiece.value);
                break;
              case "n":
                this.pieces[x][y] = new Knight(tmpPiece.color, tmpPiece.img, tmpPiece.x, tmpPiece.y, tmpPiece.value);
                break;
              case "b":
                this.pieces[x][y] = new Bishop(tmpPiece.color, tmpPiece.img, tmpPiece.x, tmpPiece.y, tmpPiece.value);
                break;
              case "q":
                this.pieces[x][y] = new Queen(tmpPiece.color, tmpPiece.img, tmpPiece.x, tmpPiece.y, tmpPiece.value);
                break;
              case "k":
                this.pieces[x][y] = new King(tmpPiece.color, tmpPiece.img, tmpPiece.x, tmpPiece.y, tmpPiece.value);
                break;
              case "p":
                this.pieces[x][y] = new Pawn(tmpPiece.color, tmpPiece.img, tmpPiece.x, tmpPiece.y, tmpPiece.value);
                break;
            }

            // this.pieces[x][y] = new ChessPiece(tmpPiece.color, tmpPiece.img, tmpPiece.x, tmpPiece.y, tmpPiece.value);
            this.players[tmpPiece.color].pieces.push(this.pieces[x][y]);
            this.drawPiece(tmpPiece, tmpPiece);
            x++;
          } else {
            x += parseInt(char);
          }
        } else if (char === "/") {
          y++;
          x = 0;
        }
      }

      this.turn = "black";
      if (fenArray[1] === "w") {
        this.turn = "white";
      }

      console.log(fenArray);
      // Finally update what moves each piece can make on the current board setup
      this.updatePieces("white");
      this.updatePieces("black");
      this.getAllPossibleMoves();
      // this.verifyMoves(this.turn);
    } else {
      console.error("There is no FEN string to decode!");
    }
  }

  clearAll() {
    this.pieces = make2dArray(8, 8);
  }

  async loadPieces() {
    for (let color of colors) {
      for (let piece of color) {
        let img = await loadImage(`./img/pieces/${this.theme}/${piece.imgName}.png`);
        this.pieces[piece.x][piece.y] = new ChessPiece(piece.type, piece.color, img, piece.x, piece.y, piece.value);
        this.players[piece.color].pieces.push(this.pieces[piece.x][piece.y]);
      }
    }
  }

  async setup() {
    this.pieces = make2dArray(8, 8);
    await this.loadPieces(this.theme);
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

  makeMove(incomingMove) {
    let { from, to, capture } = incomingMove,
      myColor = incomingMove.piece.color;

    // Delete the to square, just to make sure it is empty when landing on it
    delete this.pieces[to.x][to.y];
    this.history.push(incomingMove);
    this.moveIndex++;
    if (!this.verify) {
      this.fiftyMove++;
    }

    if (capture && !this.verify) {
      this.players[myColor].captures.push(capture);
      this.fiftyMove = 0;
    }

    this.pieces[to.x][to.y] = this.pieces[from.x][from.y];
    this.pieces[from.x][from.y].move(to, this.verify);
    delete this.pieces[from.x][from.y];

    // Is it a castle move?
    if (incomingMove.castle) {
      this.makeMove(incomingMove.castle);
    }
    // Check if it's a pawn to promote
    if (incomingMove.piece.type === "pawn") {
      if (!this.verify) {
        this.fiftyMove = 0;
      }
      this.pawnPromo(to);
    }

    // Player has made a move and should no longer be in check(else it would be illegal)
    this.players[myColor].isChecked = false;
    this.players[myColor].getKing(this).isChecked = false;

    // Update moves
    this.updatePieces(this.players[myColor].opponent);
    this.getAllPossibleMoves([this.players[myColor].opponent]);
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
  }

  pawnPromo(to) {
    // TODO: Make this so you can chose what to promote to(bishop, knight, rook or queen)
    if (to.y === 0 || to.y === 7) {
      this.pieces[to.x][to.y] = new Queen(this.pieces[to.x][to.y].color, null, this.pieces[to.x][to.y].x, this.pieces[to.x][to.y].y, true);
      this.pieces[to.x][to.y].findLegalMoves(this);
    }
  }

  unMakeMove() {
    let currentMove = (this.latestVerifiedMove = this.history.pop());

    this.moveIndex--;

    // Clear spaces
    delete this.pieces[currentMove.to.x][currentMove.to.y];
    delete this.pieces[currentMove.from.x][currentMove.from.y];

    // Place captured piece back
    if (currentMove.capture) {
      this.pieces[currentMove.to.x][currentMove.to.y] = currentMove.capture;
      this.players[currentMove.capture.color].updatePieces(this);
    }

    // Place current piece back
    this.pieces[currentMove.from.x][currentMove.from.y] = currentMove.piece;
    this.pieces[currentMove.from.x][currentMove.from.y].x = currentMove.from.x;
    this.pieces[currentMove.from.x][currentMove.from.y].y = currentMove.from.y;
    this.pieces[currentMove.from.x][currentMove.from.y].hasMoved = currentMove.hasMoved;

    if (currentMove.isCastleRookMove) {
      this.unMakeMove();
    }

    // Update the players pieces
    this.players[currentMove.piece.color].updatePieces(this);

    if (!this.verify) {
      this.updatePieces(currentMove.piece.color);
    }
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
    let player = this.players[color],
      tmpArray = [],
      myKing,
      isChecked = false;
    this.verify = true;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.pieces[x][y] && this.pieces[x][y].isKing && this.pieces[x][y].color === color) {
          myKing = this.pieces[x][y];
        }
      }
    }

    isChecked = myKing.isChecked;
    for (let move of player.possibleMoves) {
      myKing.isChecked = false;
      this.makeMove(move);
      if (!myKing.isChecked) {
        tmpArray.push(move);
      }
      this.unMakeMove();
      this.calculatedMoves++;
    }

    player.possibleMoves = tmpArray;
    this.verify = false;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.pieces[x][y]) {
          this.pieces[x][y].legalMoves = [];
        }
      }
    }

    myKing.isChecked = isChecked;
    this.players[color].isChecked = isChecked;

    player.possibleMoves.forEach((move) => {
      this.pieces[move.from.x][move.from.y].legalMoves.push(move);
    });
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
