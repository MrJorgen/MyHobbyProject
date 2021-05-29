export class Drawing {
  constructor(board, guide, anim, images, squareSize) {
    this.boardCtx = board;
    this.guideCtx = guide;
    this.animCtx = anim;
    this.images = images;
    this.squareSize = squareSize;
    this.padding = this.squareSize / 2;
    this.boardCtx.translate(this.padding, this.padding);
    this.guideCtx.translate(this.padding, this.padding);
    this.animCtx.translate(this.padding, this.padding);
  }

  redraw(pieces) {
    this.boardCtx.clearRect(0, 0, this.squareSize * 8, this.squareSize * 8);
    for (let x = 0; x < pieces.length; x++) {
      for (let y = 0; y < pieces[x].length; y++) {
        if (pieces[x][y]) {
          let piece = pieces[x][y];
          this.drawPiece(this.images[piece.color][piece.type], piece);
        }
      }
    }
  }

  drawPiece(img, coords) {
    let { x, y } = coords;
    this.boardCtx.clearRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
    this.boardCtx.drawImage(img, x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
  }

  clearSquare(coords) {
    let { x, y } = coords;
    this.boardCtx.clearRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
  }

  animateImage(img, x, y) {
    let scale = 1.1;
    if (this.squareSize * scale > img.width) {
      scale = img.width / this.squareSize;
    }
    let halfScale = (scale - 1) / 2 + 1;

    this.animCtx.save();
    this.animCtx.clearRect(-this.padding, -this.padding, this.squareSize * 9, this.squareSize * 9);
    this.animCtx.translate(x, y);
    this.animCtx.shadowBlur = 10;
    this.animCtx.shadowOffsetX = 5;
    this.animCtx.shadowOffsetY = 5;
    this.animCtx.shadowColor = "rgba(0, 0, 0, 0.5)";
    this.animCtx.drawImage(img, -this.squareSize * halfScale, -this.squareSize * halfScale, this.squareSize * scale, this.squareSize * scale);
    this.animCtx.restore();
  }

  clearGuide() {
    this.guideCtx.clearRect(-this.padding, -this.padding, this.squareSize * 9, this.squareSize * 9);
  }

  clearAnim() {
    this.animCtx.clearRect(-this.padding, -this.padding, this.squareSize * 9 + 0.5, this.squareSize * 9 + 0.5);
  }

  markMove(currentMove) {
    let { from, to } = currentMove;
    this.markSquare(from);
    this.markSquare(to);
  }

  markSquare(coords) {
    this.guideCtx.fillStyle = "rgb(255, 255, 0, 0.4)";
    this.guideCtx.fillRect(coords.x * this.squareSize, coords.y * this.squareSize, this.squareSize + 1, this.squareSize + 1);
  }

  attackedSquare(coords) {
    // this.guideCtx.fillStyle = "rgb(128, 255, 255, 0.3)";
    this.guideCtx.fillStyle = "rgb(192, 64, 64, 0.3)";
    this.guideCtx.fillRect(coords.x * this.squareSize, coords.y * this.squareSize, this.squareSize + 1, this.squareSize + 1);
  }

  moveToEmpty(pos) {
    let { x, y } = pos;
    x = x * this.squareSize + this.padding;
    y = y * this.squareSize + this.padding;
    this.guideCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
    this.guideCtx.beginPath();
    this.guideCtx.arc(x, y, this.squareSize * 0.2, 0, Math.PI * 2);
    this.guideCtx.fill();
  }

  moveToCapture(pos) {
    let { x, y } = pos;
    let trim = 0.5;
    let radius = this.squareSize * 0.05;
    this.guideCtx.lineWidth = this.squareSize * 0.04;
    x = x * this.squareSize + 0.5;
    y = y * this.squareSize + 0.5;
    let x1 = x + this.guideCtx.lineWidth * trim,
      y1 = y + this.guideCtx.lineWidth * trim;

    let x2 = x - this.guideCtx.lineWidth * trim + this.squareSize,
      y2 = y - this.guideCtx.lineWidth * trim + this.squareSize;

    this.guideCtx.strokeStyle = "rgba(200, 70, 70, 1)";
    this.guideCtx.beginPath();
    this.guideCtx.moveTo(x1 + radius, y1);
    this.guideCtx.arcTo(x2, y1, x2, y2, radius);
    this.guideCtx.arcTo(x2, y2, x, y2, radius);
    this.guideCtx.arcTo(x1, y2, x1, y1, radius);
    this.guideCtx.arcTo(x1, y1, x2, y1, radius);
    this.guideCtx.stroke();

    // Below is for circle
    /*
      let { x, y } = pos;
      x = (x + 1) * this.squareSize;
      y = (y + 1) * this.squareSize;
      this.guideCtx.strokeStyle = "rgba(0, 0, 0, 0.25)";
      this.guideCtx.lineWidth = this.squareSize * 0.08;
      this.guideCtx.clearRect(x, y, this.squareSize, this.squareSize);
      this.guideCtx.beginPath();
      this.guideCtx.arc(x, y, this.squareSize * 0.45, 0, Math.PI * 2);
      this.guideCtx.stroke();
    */
  }
}
