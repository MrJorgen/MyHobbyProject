export class Drawing {
  constructor(board, guide, anim, images, squareSize) {
    this.boardCtx = board;
    this.guideCtx = guide;
    this.animCtx = anim;
    this.images = images;
    this.squareSize = squareSize;
  }

  redraw(pieces) {
    let startPos = this.squareSize / 2;
    this.boardCtx.clearRect(startPos, startPos, this.squareSize * 8, this.squareSize * 8);
    for (let x = 0; x < pieces.length; x++) {
      for (let y = 0; y < pieces[x].length; y++) {
        if (pieces[x][y]) {
          let piece = pieces[x][y];
          this.boardCtx.drawImage(this.images[piece.color][piece.type], piece.x * this.squareSize + startPos, piece.y * this.squareSize + startPos, this.squareSize, this.squareSize);
        }
      }
    }
  }

  drawPiece(img, coords) {
    let { x, y } = coords;
    let startPos = this.squareSize / 2;
    this.boardCtx.clearRect(startPos + x * this.squareSize, startPos + y * this.squareSize, this.squareSize, this.squareSize);
    this.boardCtx.drawImage(img, x * this.squareSize + startPos, y * this.squareSize + startPos, this.squareSize, this.squareSize);
  }

  clearSquare(coords) {
    let { x, y } = coords,
      startPos = this.squareSize / 2;
    this.boardCtx.clearRect(x * this.squareSize + startPos, y * this.squareSize + startPos, this.squareSize, this.squareSize);
  }
}
