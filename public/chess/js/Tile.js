export default class Tile {
  constructor(coordinate) {
    this.coordinate = coordinate;
    this.isOccupied = false;
    this.piece = null;
  }

  setPiece(piece) {
    this.isOccupied = true;
    this.piece = piece;
  }

  getPiece() {
    let tmpPiece = this.piece;
    this.isOccupied = false;
    this.piece = null;
    return tmpPiece;
  }
}
