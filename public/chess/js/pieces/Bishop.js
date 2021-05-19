import { ChessPiece } from "./Piece.js";

export class Bishop extends ChessPiece {
  constructor(color, img, posX, posY) {
    super(color, img, posX, posY);
    this.type = "bishop";
    this.value = 330;
    this.moves = [
      { x: 1, y: 1, repeat: true },
      { x: 1, y: -1, repeat: true },
      { x: -1, y: 1, repeat: true },
      { x: -1, y: -1, repeat: true },
    ];
  }
}
