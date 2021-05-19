import { ChessPiece } from "./Piece.js";

export class Rook extends ChessPiece {
  constructor(color, img, posX, posY) {
    super(color, img, posX, posY);
    this.type = "rook";
    this.moves = [
      { x: 1, repeat: true },
      { x: -1, repeat: true },
      { y: 1, repeat: true },
      { y: -1, repeat: true },
    ];
    this.value = 500;
  }
}
