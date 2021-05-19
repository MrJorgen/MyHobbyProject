export class GuideLayer {
  constructor(ctx, squareSize) {
    this.ctx = ctx;
    this.squareSize = squareSize;
    this.padding = squareSize / 2;
    this.setup();
  }

  setup() {
    this.ctx.translate(this.padding + 0.5, this.padding + 0.5);
  }

  clearAll() {
    this.ctx.clearRect(0, 0, this.squareSize * 8 + 0.5, this.squareSize * 8 + 0.5);
  }

  markMove(currentMove) {
    let { from, to } = currentMove,
      squareSize = this.squareSize;
    this.ctx.fillStyle = "rgb(255, 255, 0, 0.4)";
    this.ctx.fillRect(from.x * squareSize + 0.5, from.y * squareSize + 0.5, squareSize, squareSize);
    this.ctx.fillRect(to.x * squareSize + 0.5, to.y * squareSize + 0.5, squareSize, squareSize);
  }

  moveToEmpty(pos) {
    let { x, y } = pos;
    x = (x + 1) * this.squareSize - this.padding;
    y = (y + 1) * this.squareSize - this.padding;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.squareSize * 0.2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  moveToCapture(pos) {
    let { x, y } = pos;
    let trim = 0.5;
    let radius = this.squareSize * 0.05;
    // this.ctx.lineWidth = this.squareSize * 0.025;
    this.ctx.lineWidth = this.squareSize * 0.04;
    x = x * this.squareSize + 0.5;
    y = y * this.squareSize + 0.5;
    let x1 = x + this.ctx.lineWidth * trim,
      y1 = y + this.ctx.lineWidth * trim;

    let x2 = x - this.ctx.lineWidth * trim + this.squareSize,
      y2 = y - this.ctx.lineWidth * trim + this.squareSize;

    // this.ctx.strokeStyle = "rgba(180, 50, 50, 0.75)";
    this.ctx.strokeStyle = "rgba(200, 70, 70, 1)";
    this.ctx.beginPath();
    this.ctx.moveTo(x1 + radius, y1);
    this.ctx.arcTo(x2, y1, x2, y2, radius);
    this.ctx.arcTo(x2, y2, x, y2, radius);
    this.ctx.arcTo(x1, y2, x1, y1, radius);
    this.ctx.arcTo(x1, y1, x2, y1, radius);
    this.ctx.stroke();

    // Below is for circle
    /*
  
      let { x, y } = pos;
      x = (x + 1) * this.squareSize;
      y = (y + 1) * this.squareSize;
      this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
      this.ctx.lineWidth = this.squareSize * 0.08;
      this.ctx.clearRect(x, y, this.squareSize, this.squareSize);
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.squareSize * 0.45, 0, Math.PI * 2);
      this.ctx.stroke();
      */
  }
}
