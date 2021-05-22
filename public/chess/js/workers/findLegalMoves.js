import Bishop from "../pieces/Bishop.js";
import King from "../pieces/King.js";
import Knight from "../pieces/Knight.js";
import Pawn from "../pieces/Pawn.js";
import Queen from "../pieces/Queen.js";
import Rook from "../pieces/Rook.js";

self.onmessage = (evt) => {
  let { board, x, y } = evt.data;
  let piece = null,
    pieceName = board.pieces[x][y].type;

  switch (pieceName) {
    case "rook":
      piece = new Rook(board.pieces[x][y].color, x, y);
      break;

    case "knight":
      piece = new Knight(board.pieces[x][y].color, x, y);
      break;

    case "bishop":
      piece = new Bishop(board.pieces[x][y].color, x, y);
      break;

    case "queen":
      piece = new Queen(board.pieces[x][y].color, x, y);
      break;

    case "king":
      piece = new King(board.pieces[x][y].color, x, y);
      break;

    case "pawn":
      piece = new Pawn(board.pieces[x][y].color, x, y);
      break;
  }

  piece.findLegalMoves(board);
  postMessage({ legalMoves: piece.legalMoves, x, y });
};
