const PIECES = { EMPTY: 0, wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6, bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12 };

const BRD_SQ_NUM = 120;

const FILES = { FILE_A: 0, FILE_B: 1, FILE_C: 2, FILE_D: 3, FILE_E: 4, FILE_F: 5, FILE_G: 6, FILE_H: 7, FILE_NONE: 8 };

const RANKS = { RANK_1: 0, RANK_2: 1, RANK_3: 2, RANK_4: 3, RANK_5: 4, RANK_6: 5, RANK_7: 6, RANK_8: 7, RANK_NONE: 8 };

const COLOURS = { WHITE: 0, BLACK: 1, BOTH: 2 };

const CASTLEBIT = { WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8 };

const SQUARES = {
  A1: 21,
  B1: 22,
  C1: 23,
  D1: 24,
  E1: 25,
  F1: 26,
  G1: 27,
  H1: 28,
  A8: 91,
  B8: 92,
  C8: 93,
  D8: 94,
  E8: 95,
  F8: 96,
  G8: 97,
  H8: 98,
  NO_SQ: 99,
  OFFBOARD: 100,
};

const MAXGAMEMOVES = 2048;
const MAXPOSITIONMOVES = 256;
const MAXDEPTH = 64;
const INFINITE = 30000;
const MATE = 29000;
const PVENTRIES = 10000;

const FilesBrd = new Array(BRD_SQ_NUM);
const RanksBrd = new Array(BRD_SQ_NUM);

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const PceChar = ".PNBRQKpnbrqk";
const SideChar = "wb-";
const RankChar = "12345678";
const FileChar = "abcdefgh";

function FR2SQ(f, r) {
  return 21 + f + r * 10;
}

const PieceBig = [false, false, true, true, true, true, true, false, true, true, true, true, true];
const PieceMaj = [false, false, false, false, true, true, true, false, false, false, true, true, true];
const PieceMin = [false, false, true, true, false, false, false, false, true, true, false, false, false];
const PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
const PieceCol = [
  COLOURS.BOTH,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
];

const PiecePawn = [false, true, false, false, false, false, false, true, false, false, false, false, false];
const PieceKnight = [false, false, true, false, false, false, false, false, true, false, false, false, false];
const PieceKing = [false, false, false, false, false, false, true, false, false, false, false, false, true];
const PieceRookQueen = [false, false, false, false, true, true, false, false, false, false, true, true, false];
const PieceBishopQueen = [false, false, false, true, false, true, false, false, false, true, false, true, false];
const PieceSlides = [false, false, false, true, true, true, false, false, false, true, true, true, false];

const KnDir = [-8, -19, -21, -12, 8, 19, 21, 12];
const RkDir = [-1, -10, 1, 10];
const BiDir = [-9, -11, 11, 9];
const KiDir = [-1, -10, 1, 10, -9, -11, 11, 9];

const DirNum = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8];
const PceDir = [0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir];
const LoopNonSlidePce = [PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0];
const LoopNonSlideIndex = [0, 3];
const LoopSlidePce = [PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0];
const LoopSlideIndex = [0, 4];

const PieceKeys = new Array(14 * 120);
let SideKey;
const CastleKeys = new Array(16);

const Sq120ToSq64 = new Array(BRD_SQ_NUM);
const Sq64ToSq120 = new Array(64);

function RAND_32() {
  return (Math.floor(Math.random() * 255 + 1) << 23) | (Math.floor(Math.random() * 255 + 1) << 16) | (Math.floor(Math.random() * 255 + 1) << 8) | Math.floor(Math.random() * 255 + 1);
}

const Mirror64 = [
  56, 57, 58, 59, 60, 61, 62, 63, 48, 49, 50, 51, 52, 53, 54, 55, 40, 41, 42, 43, 44, 45, 46, 47, 32, 33, 34, 35, 36, 37, 38, 39, 24, 25, 26, 27, 28, 29, 30, 31, 16, 17, 18, 19, 20, 21, 22, 23, 8, 9,
  10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7,
];

function SQ64(sq120) {
  return Sq120ToSq64[sq120];
}

function SQ120(sq64) {
  return Sq64ToSq120[sq64];
}

function PCEINDEX(pce, pceNum) {
  return pce * 10 + pceNum;
}

function MIRROR64(sq) {
  return Mirror64[sq];
}

const Kings = [PIECES.wK, PIECES.bK];
const CastlePerm = [
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 13, 15, 15, 15, 12, 15, 15, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 7, 15, 15, 15, 3, 15, 15, 11,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
];

/*	
0000 0000 0000 0000 0000 0111 1111 -> From 0x7F
0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F
0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xF
0000 0000 0100 0000 0000 0000 0000 -> EP 0x40000
0000 0000 1000 0000 0000 0000 0000 -> Pawn Start 0x80000
0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece >> 20, 0xF
0001 0000 0000 0000 0000 0000 0000 -> Castle 0x1000000
*/

function FROMSQ(m) {
  return m & 0x7f;
}
function TOSQ(m) {
  return (m >> 7) & 0x7f;
}
function CAPTURED(m) {
  return (m >> 14) & 0xf;
}
function PROMOTED(m) {
  return (m >> 20) & 0xf;
}

const MFLAGEP = 0x40000;
const MFLAGPS = 0x80000;
const MFLAGCA = 0x1000000;

const MFLAGCAP = 0x7c000;
const MFLAGPROM = 0xf00000;

const NOMOVE = 0;

function SQOFFBOARD(sq) {
  if (FilesBrd[sq] == SQUARES.OFFBOARD) return true;
  return false;
}

function HASH_PCE(pce, sq) {
  GameBoard.posKey ^= PieceKeys[pce * 120 + sq];
}

function HASH_CA() {
  GameBoard.posKey ^= CastleKeys[GameBoard.castlePerm];
}
function HASH_SIDE() {
  GameBoard.posKey ^= SideKey;
}
function HASH_EP() {
  GameBoard.posKey ^= PieceKeys[GameBoard.enPas];
}

const GameController = {};
GameController.EngineSide = COLOURS.BOTH;
GameController.PlayerSide = COLOURS.BOTH;
GameController.GameOver = false;

const UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;
