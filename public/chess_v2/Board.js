import { BRD_SQ_NUM, COLOURS, PIECES, SQUARES, RAND_32 } from "./Defs.js";

let pieceKeys = new Array(14 * 120);
let sideKey;
let castleKeys = new Array(16);
const MAXGAMEMOVES = 2048;
const MAXPOSITIONMOVES = 256;
const MAXDEPTH = 64;

initHashKeys();

export class Board {
  constructor() {
    this.pieces = new Array(BRD_SQ_NUM);
    this.side = COLOURS.white;
    this.fiftyMove = 0;
    this.hisPly = 0;
    this.ply = 0;
    this.enPassant = 0;
    this.castlePerm = 0;
    this.material = new Array(2); // WHITE, BLACK: sum of value of each players pieces
    this.pieceNum = new Array(13); // the count of pieces on the board, indexed by PIECES array
    this.pList = new Array(140); // where the pieces is located on the board
    this.posKey = 0;
    this.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
    this.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
    this.moveListStart = new Array(MAXDEPTH);
  }

  generatePosKey() {
    let finalKey = 0,
      piece = PIECES.empty;

    for (let sq = 0; sq < BRD_SQ_NUM; sq++) {
      piece = this.pieces[sq];
      if (piece !== PIECES.empty && piece !== SQUARES.OFFBOARD) {
        finalKey ^= pieceKeys[piece * 120 + sq];
      }
    }

    if (this.side === COLOURS.white) {
      finalKey ^= sideKey;
    }

    if (this.enPassant !== SQUARES.NO_SQ) {
      finalKey ^= pieceKeys[this.enPassant];
    }

    finalKey ^= castleKeys[this.castlePerm];
    this.posKey = finalKey;
    return finalKey;
  }
}

function pieceIndex(piece, pieceCount) {
  return piece * 10 + pieceCount;
}

function initHashKeys() {
  for (let index = 0; index < 14 * 120; ++index) {
    pieceKeys[index] = RAND_32();
  }

  sideKey = RAND_32();

  for (let index = 0; index < 16; ++index) {
    castleKeys[index] = RAND_32();
  }
}

function parseFen(fen) {}
