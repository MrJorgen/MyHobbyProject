import { Board } from "./Board.js";
// prettier-ignore
import { PIECES, BRD_SQ_NUM, FILES, RANKS, COLOURS, SQUARES, FilesBrd, RanksBrd, fr2Sq, CASTLEBIT,
         BOOL, pieceBig, pieceMaj, pieceMin, pieceVal, pieceCol, piecePawn, pieceKnight, pieceKing,
         pieceRookQueen, pieceBishopQueen, pieceSlides, RAND_32, SQ64, SQ120 } from "./Defs.js";

let board = new Board();

debug();

function debug() {
  console.log("fr2Sq(7, 7): " + fr2Sq(7, 7));
  console.log("FilesBrd[0]: " + FilesBrd[0], "\nRanksBrd[0]: " + RanksBrd[0]);
  console.log("FilesBrd[SQUARES.A1]: " + FilesBrd[SQUARES.A1], "\nRanksBrd[SQUARES.A1]: " + RanksBrd[SQUARES.A1]);
  console.log("FilesBrd[SQUARES.E8]: " + FilesBrd[SQUARES.E8], "\nRanksBrd[SQUARES.E8]: " + RanksBrd[SQUARES.E8]);
  console.log("Board: ", board);
  console.log("pieceBig", pieceBig);
  console.log("RAND_32", RAND_32());
  console.log("SQ64(55)", SQ64(55));
  console.log("SQ120(55)", SQ120(55));
}
