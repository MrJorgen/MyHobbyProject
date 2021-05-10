export class Move {
  constructor(from, to, piece, capture, castle) {
    this.from = from;
    this.to = to;
    this.piece = piece;
    this.capture = capture;
    this.hasMoved = piece.hasMoved;
    this.isCastle = castle;
  }
}
