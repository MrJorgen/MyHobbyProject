import ChessPiece from "./Piece.js";

export default class Rook extends ChessPiece {
  constructor(color, posX, posY, promoted = false) {
    super(color, posX, posY);
    this.type = "rook";
    this.isSlidingPiece = true;
    this.hasMoved = true;
    this.promoted = promoted;
    this.moves = [{ x: 1 }, { x: -1 }, { y: 1 }, { y: -1 }];
    this.value = 500;
  }
}
