export class Move {
  constructor(from, to, piece, capture = false, castle = false, isCastleRookMove = false, weight = 0) {
    this.from = from;
    this.to = to;
    this.piece = piece;
    this.color = this.piece.color;
    this.capture = capture;
    this.hasMoved = piece.hasMoved;
    this.castle = castle;
    this.isCastleRookMove = isCastleRookMove;
    this.weight = weight;
    this.enPassant = false;
    this.promote = false;
    this.promotePiece = null;
    if (this.capture) {
      this.weight = capture.value - piece.value;
    } else if (this.piece.type === "pawn") {
      // this.weight = Math.abs(from.y - to.y);
      // this.weight += 3.5 - Math.abs(to.x - 3.5) * 0.1;
    }
  }
}
