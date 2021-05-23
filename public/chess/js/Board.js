"use strict";
import { Player } from "./Player.js";
import Rook from "./pieces/Rook.js";
import Knight from "./pieces/Knight.js";
import Bishop from "./pieces/Bishop.js";
import Queen from "./pieces/Queen.js";
import King from "./pieces/King.js";
import Pawn from "./pieces/Pawn.js";
import { make2dArray } from "./utilities.js";

export class ChessBoard {
  constructor(settings) {
    this.squareSize = settings.squareSize;
    this.players = {
      white: new Player("white", settings.ai.white),
      black: new Player("black", settings.ai.black),
    };
    this.settings = settings;
    this.theme = settings.theme;
    this.pieces = null;
    this.turn = "white";
    this.history = [];
    this.moveIndex = 0;
    this.verify = false;
    this.calculatedMoves = 0;
    this.latestVerifiedMove = null;
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    this.fiftyMove = 0;
    this.enPassant = false;
  }

  async decodeFen(fen) {
    this.fen = fen || this.fen;
    if (this.fen) {
      this.clearAll();
      let fenArray = this.fen.split(" "),
        x = 0,
        y = 0,
        pieceChars = "rnbqkpRNBQKP";

      // Check if/what piece it is
      for (let char of fenArray[0]) {
        if (char !== "/") {
          if (pieceChars.includes(char)) {
            let tmpPiece = {};

            // Check if Char is lower- or uppercase(black or white)
            if (char === char.toLowerCase()) {
              tmpPiece.color = "black";
            } else {
              tmpPiece.color = "white";
            }

            tmpPiece.x = x;
            tmpPiece.y = y;

            switch (char.toLowerCase()) {
              case "r":
                this.pieces[x][y] = new Rook(tmpPiece.color, tmpPiece.x, tmpPiece.y);
                break;
              case "n":
                this.pieces[x][y] = new Knight(tmpPiece.color, tmpPiece.x, tmpPiece.y);
                break;
              case "b":
                this.pieces[x][y] = new Bishop(tmpPiece.color, tmpPiece.x, tmpPiece.y);
                break;
              case "q":
                this.pieces[x][y] = new Queen(tmpPiece.color, tmpPiece.x, tmpPiece.y);
                break;
              case "k":
                this.pieces[x][y] = new King(tmpPiece.color, tmpPiece.x, tmpPiece.y);
                break;
              case "p":
                this.pieces[x][y] = new Pawn(tmpPiece.color, tmpPiece.x, tmpPiece.y);
                break;
            }

            this.players[tmpPiece.color].pieces.push(this.pieces[x][y]);
            x++;
          } else {
            x += parseInt(char);
          }
        } else if (char === "/") {
          y++;
          x = 0;
        }
      }

      if (fenArray.length >= 2) {
        // Whos turn is it?
        this.turn = "white";
        if (fenArray[1] === "b") {
          this.turn = "black";
          this.moveIndex++;
        }
      }

      if (fenArray.length >= 3) {
        // Castle availability
        if (fenArray[2].charAt(0) !== "-") {
          let rooks = {
            q: { x: 0, y: 0 },
            k: { x: 7, y: 0 },
            Q: { x: 0, y: 7 },
            K: { x: 7, y: 7 },
          };
          for (let rook of fenArray[2]) {
            if (this.pieces[rooks[rook].x][rooks[rook].y]) {
              this.pieces[rooks[rook].x][rooks[rook].y].hasMoved = false;
            }
          }
        }
      }

      if (fenArray.length >= 4) {
        // En passant
        if (fenArray[3].length > 1) {
          let laneChars = "abcdefgh";
          let x = laneChars.search(fenArray[3].charAt(0));
          let y = 8 - parseInt(fenArray[3].charAt(1));
          console.log(x, y);
          this.enPassant = { x, y };
        }
      }

      if (fenArray.length >= 5) {
        this.fiftyMove = parseInt(fenArray[4]);
      }

      if (fenArray.length >= 6) {
        this.moveIndex += parseInt(fenArray[5]) * 2;
      }

      console.log(this);
      console.log(fenArray);

      // Finally update what moves each piece can make on the current board setup
      this.updatePieces("white");
      this.updatePieces("black");
      this.getAllPossibleMoves();
    } else {
      console.error("There is no FEN string to decode!");
    }
  }

  clearAll() {
    this.pieces = make2dArray(8, 8);
  }

  perft(depth, color = this.turn) {
    if (depth == 0) return 1;

    let numPositions = 0;
    // this.updatePieces("black");
    // this.updatePieces("white");
    // this.getAllPossibleMoves();

    this.players[color].possibleMoves.forEach((move) => {
      this.makeMove(move);
      // console.log("From: ", move.from, "To: ", move.to, "Piece: ", move.piece.color, move.piece.type);
      numPositions += parseInt(this.perft(depth - 1, this.players[color].opponent));
      this.unMakeMove();
    });
    return numPositions;
  }

  makeMove(incomingMove) {
    let { from, to, capture } = incomingMove,
      myColor = incomingMove.piece.color;

    // Delete the to square, just to make sure it is empty when landing on it
    this.history.push(incomingMove);
    this.moveIndex++;
    if (!this.verify) {
      this.fiftyMove++;
    }

    if (capture && !this.verify) {
      delete this.pieces[capture.x][capture.y];
      this.players[myColor].captures.push(capture);
      this.fiftyMove = 0;
    }

    this.pieces[to.x][to.y] = incomingMove.piece;
    this.pieces[to.x][to.y].move(to, this.verify);
    delete this.pieces[from.x][from.y];

    if (!this.verify) {
      this.enPassant = false;
      if (incomingMove.enPassant) {
        this.enPassant = {
          x: incomingMove.piece.x,
          y: incomingMove.piece.y - incomingMove.piece.moves.y,
        };
      }
    }

    // Is it a castle move?
    if (incomingMove.castle) {
      this.makeMove(incomingMove.castle);
    }
    // Check if it's a pawn to promote
    if (incomingMove.promote) {
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
    // this.updatePieces(this.players[myColor].color);
    this.getAllPossibleMoves([this.players[myColor].opponent]);
  }

  updatePieces(color) {
    // When a piece has moved update player[color] each piece legal moves
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
    let tmpPiece = this.pieces[to.x][to.y];
    console.log("PawnPromo piece: ", tmpPiece);
    if (tmpPiece instanceof Pawn) {
      this.pieces[to.x][to.y] = new Queen(tmpPiece.color, to.x, to.y, true);
      this.pieces[to.x][to.y].findLegalMoves(this);
    }
  }

  unMakeMove() {
    if (this.history.length <= 0) return;
    let currentMove = (this.latestVerifiedMove = this.history.pop());

    this.moveIndex--;

    if (currentMove.promote && currentMove.piece.promoted) {
      let currentPiece = currentMove.piece;
      currentMove.piece.promoted = false;
      currentMove.piece = new Pawn(currentPiece.color, currentPiece.x, currentPiece.y);
    }

    // Clear spaces
    delete this.pieces[currentMove.to.x][currentMove.to.y];
    delete this.pieces[currentMove.from.x][currentMove.from.y];

    // Place current piece back
    this.pieces[currentMove.from.x][currentMove.from.y] = currentMove.piece;
    this.pieces[currentMove.from.x][currentMove.from.y].x = currentMove.from.x;
    this.pieces[currentMove.from.x][currentMove.from.y].y = currentMove.from.y;
    this.pieces[currentMove.from.x][currentMove.from.y].hasMoved = currentMove.hasMoved;

    if (currentMove.isCastleRookMove) {
      this.unMakeMove();
    }

    // Place captured piece back
    if (currentMove.capture) {
      this.pieces[currentMove.capture.x][currentMove.capture.y] = currentMove.capture;
    }

    // Update the players pieces
    // this.updatePieces(currentMove.piece.color);
    // this.getAllPossibleMoves(currentMove.piece.color);

    // if (!this.verify) {
    //   this.updatePieces(currentMove.piece.color);
    // }
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
    outerLoop: for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.pieces[x][y] && this.pieces[x][y].isKing && this.pieces[x][y].color === color) {
          myKing = this.pieces[x][y];
          break outerLoop;
        }
      }
    }

    if (myKing === undefined) {
      console.error(`${color} has no King!!!`);
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
}
