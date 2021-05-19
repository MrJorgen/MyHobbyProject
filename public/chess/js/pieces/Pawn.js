import { ChessPiece } from "./Piece.js";

export class Pawn extends ChessPiece {
  constructor(color, img, posX, posY) {
    super(color, img, posX, posY);
    this.type = "pawn";
    this.value = 100;
    if (color === "white") {
      this.moves = [{ y: -1 }];
      if (this.y !== 6) this.hasMoved = true;
    } else if (color == "black") {
      if (this.y !== 1) this.hasMoved = true;
      this.moves = [{ y: 1 }];
    }
  }
}
