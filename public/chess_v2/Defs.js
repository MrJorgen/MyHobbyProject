// prettier-ignore-start
const PIECES = { empty: 0, wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6, bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12 };
const BRD_SQ_NUM = 120;
const FILES = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7 };
const RANKS = { 1: 0, 2: 1, 3: 2, 4: 2, 5: 4, 6: 5, 7: 6, 8: 7 };
const COLOURS = { white: 0, black: 1, both: 2 };
const SQUARES = { A1: 21, B1: 22, C1: 23, D1: 24, D1: 25, F1: 26, G1: 27, H1: 28, A8: 91, B8: 92, C8: 93, D8: 94, E8: 95, F8: 96, G8: 97, H8: 98, NO_SQ: 99, OFFBOARD: 100 };

let FilesBrd = new Array(BRD_SQ_NUM).fill(SQUARES.OFFBOARD);
let RanksBrd = new Array(BRD_SQ_NUM).fill(SQUARES.OFFBOARD);

const CASTLEBIT = { WK: 1, WQ: 2, BK: 4, BQ: 8 };

const BOOL = { FALSE: 0, TRUE: 1 };

const pieceBig = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
const pieceMaj = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
const pieceMin = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
const pieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
// prettier-ignore
const pieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK];
const piecePawn = [BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
const pieceKnight = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
const pieceKing = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE];
const pieceRookQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];
const pieceBishopQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE];
const pieceSlides = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];

function RAND_32() {
  // prettier-ignore
  return ((Math.floor(Math.random() * 255) + 1) << 23) | ((Math.floor(Math.random() * 255) + 1) << 16) |
         ((Math.floor(Math.random() * 255) + 1) << 8) | (Math.floor(Math.random() * 255) + 1);
}

let sq120toSq64 = new Array(BRD_SQ_NUM).fill(-1);
let sq64toSq120 = new Array(64).fill(-1);

function fr2Sq(file, rank) {
  return 21 + file + rank * 10;
}

function initFilesRanksBrd() {
  let sq = SQUARES.A1;

  for (let rank = RANKS[1]; rank <= RANKS[8]; rank++) {
    for (let file = FILES.A; file <= FILES.H; file++) {
      sq = fr2Sq(file, rank);
      FilesBrd[sq] = file;
      RanksBrd[sq] = rank;
    }
  }
}

function initTranslateTables() {
  let sq = SQUARES.A1;
  let sq64 = 0;

  for (let rank = RANKS[1]; rank <= RANKS[8]; rank++) {
    for (let file = FILES.A; file <= FILES.H; file++) {
      sq = fr2Sq(file, rank);
      sq64toSq120[sq64] = sq;
      sq120toSq64[sq] = sq64;
      sq64++;
    }
  }
}

function SQ64(sq120) {
  return sq120toSq64[sq120];
}

function SQ120(sq64) {
  return sq64toSq120[sq64];
}

initFilesRanksBrd();
initTranslateTables();

// prettier-ignore
export { PIECES, BRD_SQ_NUM, FILES, RANKS, COLOURS, SQUARES, FilesBrd, RanksBrd, fr2Sq, CASTLEBIT,
         BOOL, pieceBig, pieceMaj, pieceMin, pieceVal, pieceCol, piecePawn, pieceKnight, pieceKing,
         pieceRookQueen, pieceBishopQueen, pieceSlides, RAND_32, SQ64, SQ120 };
