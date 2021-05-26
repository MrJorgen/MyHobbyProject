import ChessPiece from "./Piece.js";

export default class Rook extends ChessPiece {
  constructor(color, posX, posY, promoted = false) {
    super(color, posX, posY);
    this.type = "rook";
    this.hasMoved = true;
    this.promoted = promoted;
    this.moves = [
      { x: 1, repeat: true },
      { x: -1, repeat: true },
      { y: 1, repeat: true },
      { y: -1, repeat: true },
    ];
    this.value = 500;
  }
}
