import ChessPiece from "./Piece.js";

export default class Bishop extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);
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
