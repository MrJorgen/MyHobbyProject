export class Move {
  constructor(from, to, piece, capture = false, castle = false, isCastleRookMove = false, weight = 0) {
    this.from = from;
    this.to = to;
    this.piece = piece;
    this.capture = capture;
    this.hasMoved = piece.hasMoved;
    this.castle = castle;
    this.isCastleRookMove = isCastleRookMove;
    this.weight = weight;
    if (this.capture) {
      this.weight = capture.value - piece.value;
    }
  }
}
