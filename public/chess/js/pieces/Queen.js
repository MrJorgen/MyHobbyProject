import ChessPiece from "./Piece.js";

export default class Queen extends ChessPiece {
  constructor(color, posX, posY, promoted = false) {
    super(color, posX, posY);
    this.type = "queen";
    this.value = 900;
    this.isSlidingPiece = true;
    this.promoted = promoted;
    this.moves = [{ x: 1 }, { x: -1 }, { y: 1 }, { y: -1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }];
  }
}
