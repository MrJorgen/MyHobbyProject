import ChessPiece from "./Piece.js";

export default class Knight extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);
    this.type = "knight";
    this.value = 320;
    this.moves = [
      { x: 2, y: 1 },
      { x: 2, y: -1 },
      { x: -2, y: 1 },
      { x: -2, y: -1 },
      { x: 1, y: 2 },
      { x: 1, y: -2 },
      { x: -1, y: 2 },
      { x: -1, y: -2 },
    ];
  }
}
