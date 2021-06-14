"use strict";
import { Player } from "./Player.js";
import Rook from "./pieces/Rook.js";
import Knight from "./pieces/Knight.js";
import Bishop from "./pieces/Bishop.js";
import Queen from "./pieces/Queen.js";
import King from "./pieces/King.js";
import Pawn from "./pieces/Pawn.js";
import { make2dArray } from "./utilities.js";
import { correct } from "./pos5.js";

export class ChessBoard {
  constructor(settings) {
    if (!(settings instanceof ChessBoard)) {
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
      this.calculatedMoves = 0;
      this.latestVerifiedMove = null;
      this.fen = settings.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      this.fiftyMove = 0;
      this.enPassant = false;
      this.perfLog = [];
      this.isPerfRunning = false;
      this.depth = 0;
      this.decodeFen(settings.fen);
    }
  }

  displayMove(move) {
    let lanes = "abcdefgh";
    let tmpString = `${lanes.charAt(move.from.x)}${8 - move.from.y}`;
    // tmpString += ` -> ${lanes.charAt(move.to.x)}${8 - move.to.y}`;
    tmpString += `${lanes.charAt(move.to.x)}${8 - move.to.y}`;

    if (move.promote) {
      if (move.promotePiece.type == "rook") tmpString += "r";
      if (move.promotePiece.type == "knight") tmpString += "n";
      if (move.promotePiece.type == "bishop") tmpString += "b";
      if (move.promotePiece.type == "queen") tmpString += "q";
    }

    return tmpString;
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
          this.enPassant = { x, y };
        }
      }

      if (fenArray.length >= 5) {
        this.fiftyMove = parseInt(fenArray[4]);
      }

      if (fenArray.length >= 6) {
        this.moveIndex += parseInt(fenArray[5]) * 2;
      }

      // Finally update what moves each piece can make on the current board setup
      this.updatePieces("black");
      this.updatePieces("white");
      this.newVerify(this.turn);
    } else {
      console.error("There is no FEN string to decode!");
    }
  }

  clearAll() {
    this.pieces = make2dArray(8, 8);
  }

  perft(depth, color = this.turn) {
    if (depth <= 0 || this.players[color].possibleMoves.length == 0) return 1;
    // if (depth == 1) {
    //   return this.players[color].possibleMoves.length;
    // }

    // if (this.players[color].possibleMoves.length == 0) {
    //   depth = 0;
    //   return 0;
    // }

    let numPositions = 0;
    this.calculatedMoves++;

    this.updateAllPieces(color);
    let tmpMoves = [...this.players[color].possibleMoves];

    for (let move of tmpMoves) {
      // console.log(this.displayMove(move), move.piece.color, move.piece.type);
      this.perfLog.push({ move: this.displayMove(move), player: move.color });
      this.makeMove(move);
      let currentMovePositions = this.perft(depth - 1, this.players[color].opponent);
      numPositions += currentMovePositions;
      if (depth == 2 && this.settings.debug) {
        // console.log(this.displayMove(move), move.piece.color, move.piece.type, currentMovePositions);
        // if (currentMovePositions === correct[this.displayMove(move)]) {
        //   console.log(`${this.displayMove(move)}: ${currentMovePositions} -> ${correct[this.displayMove(move)]} `, "✔️");
        // } else {
        //   console.log(`${this.displayMove(move)}: ${currentMovePositions} -> ${correct[this.displayMove(move)]}`, "❌", currentMovePositions - correct[this.displayMove(move)]);
        // }
        // this.perfLog.push(`${this.displayMove(move)}: ${currentMovePositions}`);
      }
      // this.perfLog.push({ move: this.displayMove(move), positions: currentMovePositions, player: move.color });
      this.unMakeMove();
    }
    return numPositions;
  }

  makeMove(incomingMove) {
    let { from, to, capture } = incomingMove,
      myColor = incomingMove.piece.color;

    // incomingMove.enPassant = this.enPassant;
    this.history.push(incomingMove);

    this.moveIndex++;
    this.fiftyMove++;

    if (capture) {
      if (capture.isKing) {
        console.log(this);
        console.log(incomingMove);
        throw new Error("The " + myColor + " player is about to capture " + this.players[myColor].opponent + "s king!");
      }
      delete this.pieces[capture.x][capture.y];
      this.players[myColor].captures.push(capture);
      if (!this.verify) this.fiftyMove = 0;
    }

    this.pieces[to.x][to.y] = incomingMove.piece;
    this.pieces[to.x][to.y].move(to, this.verify);
    delete this.pieces[from.x][from.y];

    this.enPassant = false;
    if (incomingMove.enPassant) {
      this.enPassant = {
        x: incomingMove.piece.x,
        y: incomingMove.piece.y - incomingMove.piece.moves.y,
      };
      // TODO: En passant gets lost when unmaking a move that captures an en passant pawn normally
      // this.history[this.history.length - 1].enPassant = this.enPassant;
    }

    // Is it a castle move?
    if (incomingMove.castle) {
      this.makeMove(incomingMove.castle);
      this.moveIndex--;
      this.fiftyMove--;
    }
    // Check if it's a pawn to promote
    if (incomingMove.promote) {
      this.fiftyMove = 0;
      this.pawnPromo(incomingMove);
    }

    // Player has made a move and should no longer be in check(otherwise it would be illegal)
    this.players[myColor].isChecked = false;
    this.players[myColor].getKing(this).isChecked = false;

    // Move is done now prepare for the next
    // What is needed here is what squares the upcoming opponent(this current player who just made a move) attacks and
    // what moves the upcoming(current opponent) can do
    if (!this.perfRunning) {
      this.updateAllPieces(this.players[myColor].opponent);
      // this.updatePieces(myColor);
      // this.updatePieces(this.players[myColor].opponent);
      // this.newVerify(this.players[myColor].opponent);
    }
  }

  updatePieces(color) {
    this.players[color].possibleMoves = [];
    this.players[color].attackedSquares = [];

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        // let piece = this.pieces[x][y];
        if (this.pieces[x][y] && this.pieces[x][y].color === color) {
          this.pieces[x][y].findLegalMoves(this);
          this.players[color].possibleMoves.push(...this.pieces[x][y].legalMoves);
          this.players[color].attackedSquares.push(...this.pieces[x][y].attackSquares);
        }
      }
    }
  }

  updateAllPieces(nextMoveColor) {
    let opponent = this.players[nextMoveColor].opponent;
    this.players[nextMoveColor].possibleMoves = [];
    this.players[opponent].attackedSquares = [];

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.pieces[x][y] && this.pieces[x][y].color === opponent) {
          this.pieces[x][y].findLegalMoves(this);
          this.players[opponent].attackedSquares.push(...this.pieces[x][y].attackSquares);
        }
      }
    }

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.pieces[x][y] && this.pieces[x][y].color === nextMoveColor) {
          this.pieces[x][y].findLegalMoves(this);
          this.players[nextMoveColor].possibleMoves.push(...this.pieces[x][y].legalMoves);
        }
      }
    }

    this.players[nextMoveColor].attackedSquares = [];
    this.players[opponent].possibleMoves = [];
    this.newVerify(nextMoveColor);
  }

  gatherPlayerMoves(color) {
    this.players[color].possibleMoves = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        let piece = this.pieces[x][y];
        if (piece && piece.color === color) {
          this.players[color].possibleMoves.push(...piece.legalMoves);
        }
      }
    }
  }

  setMovesToPieces(color) {
    this.players[color].possibleMoves.forEach((move) => {
      this.pieces[move.from.x][move.from.y].legalMoves.push(move);
    });
  }

  pawnPromo(incomingMove) {
    let { to } = incomingMove;
    // TODO: Make this so you can chose what to promote to(bishop, knight, rook or queen)
    let tmpPiece = this.pieces[to.x][to.y];
    this.pieces[to.x][to.y] = incomingMove.promotePiece;
    this.pieces[to.x][to.y].findLegalMoves(this);
  }

  unMakeMove() {
    if (this.history.length <= 0) return;
    let currentMove = (this.latestVerifiedMove = this.history.pop());

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

    this.enPassant = currentMove.enPassant;

    // Place captured piece back
    if (currentMove.capture) {
      this.pieces[currentMove.capture.x][currentMove.capture.y] = currentMove.capture;
      this.enPassant = currentMove.enPassant;
      this.players[currentMove.piece.color].captures.pop();
    }

    // Update the players pieces
    this.moveIndex--;
    if (!this.isPerfRunning) {
      // this.updatePieces(this.players[currentMove.piece.color].opponent);
      // this.updatePieces(currentMove.piece.color);
      // this.newVerify(currentMove.piece.color);
      this.updateAllPieces(currentMove.piece.color);
    }
  }

  clearAllPlayersMoves(pieces) {
    pieces.forEach((piece) => {
      piece.legalMoves = [];
    });
  }

  newVerify(color) {
    let player = this.players[color],
      opponent = this.players[this.players[color].opponent],
      myKing = null,
      opponentAttacks = [],
      playerMoves = [],
      playerPieces = [],
      opponentPieces = [];

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.pieces[x][y]) {
          if (this.pieces[x][y].color == player.color) {
            playerPieces.push(this.pieces[x][y]);
          } else if (this.pieces[x][y].color == opponent.color) {
            opponentPieces.push(this.pieces[x][y]);
          }
        }
      }
    }

    opponentAttacks = [...opponent.attackedSquares];
    playerMoves = [...player.possibleMoves];
    myKing = player.getKing(this);
    // myKing = playerPieces.find((piece) => piece.isKing);

    // Filter out what moves the king can/can't do
    // The king is the only piece that can't move to an attacked square
    for (let attackedSquare of opponentAttacks) {
      myKing.legalMoves.forEach((kingMove, i) => {
        if (kingMove.to.x === attackedSquare.x && kingMove.to.y === attackedSquare.y) {
          // King can't move here
          myKing.legalMoves.splice(i, 1);
        }
      });
    }
    this.pieces[myKing.x][myKing.y].legalMoves = myKing.legalMoves;

    if (player.isChecked) {
      let piecesAttackingKing = opponentPieces.filter((piece) => piece.isChecking);
      // Allow all friendly pieces(but the king) to only block check or take the attacking piece
      if (piecesAttackingKing.length == 1) {
        playerPieces.forEach((piece) => {
          // Skip checking the king since it's already done
          if (!piece.isKing) {
            if (piece.isPinned) {
              // If the piece is pinned it can't move
              piece.legalMoves = [];
              piece.isPinned = false;
            } else {
              // The piece is not pinned, now find what(if any) move(s) can block the check
              let tmpMoves = [];
              piece.legalMoves.forEach((move) => {
                player.blockSquares.forEach((square) => {
                  if (square.x == move.to.x && square.y == move.to.y) {
                    tmpMoves.push(move);
                  }
                });
              });
              piece.legalMoves = tmpMoves;
            }
          }
        });
        this.gatherPlayerMoves(player.color);
      }
      // Pieces can't block attacks from 2 or more pieces(the only option is to move the king)
      if (piecesAttackingKing.length >= 2) {
        this.players[player.color].possibleMoves = myKing.legalMoves;
        this.clearAllPlayersMoves(playerPieces);
        this.setMovesToPieces(player.color);
      }
      piecesAttackingKing.forEach((piece) => {
        piece.isChecking = false;
      });
    } else {
      // Player is not in check but may have pinned pieces restricting their movement
      playerPieces.forEach((piece) => {
        if (piece.isPinned) {
          let tmpMoves = [];
          piece.legalMoves.forEach((move) => {
            piece.pinnedSquares.forEach((square) => {
              if (square.x == move.to.x && square.y == move.to.y) {
                tmpMoves.push(move);
              }
            });
          });
          piece.legalMoves = tmpMoves;
          piece.isPinned = false;
        }
      });
      this.gatherPlayerMoves(player.color);
    }
  }
}
