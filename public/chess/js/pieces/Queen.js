import ChessPiece from "./Piece.js";

export default class Queen extends ChessPiece {
  constructor(color, img, posX, posY, promoted = false) {
    super(color, img, posX, posY);
    this.type = "queen";
    this.value = 900;
    this.promoted = promoted;
    this.moves = [
      { x: 1, repeat: true },
      { x: -1, repeat: true },
      { y: 1, repeat: true },
      { y: -1, repeat: true },
      { x: 1, y: 1, repeat: true },
      { x: 1, y: -1, repeat: true },
      { x: -1, y: 1, repeat: true },
      { x: -1, y: -1, repeat: true },
    ];
  }
}
