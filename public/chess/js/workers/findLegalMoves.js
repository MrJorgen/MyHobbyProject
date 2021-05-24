import { ChessBoard } from "../Board.js";
import Bishop from "../pieces/Bishop.js";
import King from "../pieces/King.js";
import Knight from "../pieces/Knight.js";
import Pawn from "../pieces/Pawn.js";
import Queen from "../pieces/Queen.js";
import Rook from "../pieces/Rook.js";
import { make2dArray } from "../utilities.js";

self.onmessage = (evt) => {
  let newBoard = evt.data.newBoard,
    depth = evt.data.depth;

  let board = new ChessBoard(newBoard.settings);
  board.pieces = make2dArray(8, 8);
  for (let x = 0; x < newBoard.pieces.length; x++) {
    for (let y = 0; y < newBoard.pieces[x].length; y++) {
      if (newBoard.pieces[x][y]) {
        board.pieces[x][y] = createPieces(newBoard.pieces[x][y].type, newBoard.pieces[x][y].color, x, y);
      }
    }
  }

  board.decodeFen();

  ["black", "white"].forEach((color) => {
    board.updatePieces(color);
  });

  let numPositions = board.perft(depth);
  console.log(board);
  postMessage({ numPositions, depth });
  // close();
};

function createPieces(pieceName, color, x, y) {
  let piece = null;
  switch (pieceName) {
    case "rook":
      piece = new Rook(color, x, y);
      break;

    case "knight":
      piece = new Knight(color, x, y);
      break;

    case "bishop":
      piece = new Bishop(color, x, y);
      break;

    case "queen":
      piece = new Queen(color, x, y);
      break;

    case "king":
      piece = new King(color, x, y);
      break;

    case "pawn":
      piece = new Pawn(color, x, y);
      break;
  }
  return piece;
}
