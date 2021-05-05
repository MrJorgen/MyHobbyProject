export class GuideLayer {
  constructor(ctx, squareSize) {
    this.ctx = ctx;
    this.squareSize = squareSize;
    this.padding = squareSize / 2;
  }

  clearAll() {
    this.ctx.clearRect(this.padding, this.padding, this.squareSize * 8, this.squareSize * 8);
  }

  markMove(from, to) {
    this.ctx.fillStyle = "rgb(220, 200, 100, 0.5)";
    this.ctx.fillRect(from.x * this.squareSize + this.padding, from.y * this.squareSize + this.padding, this.squareSize, this.squareSize);
    this.ctx.fillRect(to.x * this.squareSize + this.padding, to.y * this.squareSize + this.padding, this.squareSize, this.squareSize);
  }

  moveToEmpty(pos) {
    /*
      // Testing to draw a rounded green rectangle
      let { x, y } = pos;
      let radius = this.squareSize * 0.05;
      this.ctx.lineWidth = this.squareSize * 0.025;
      x = this.padding + x * this.squareSize;
      y = this.padding + y * this.squareSize;
      this.ctx.strokeStyle = "rgba(50, 180, 50, 1)";
      this.ctx.beginPath();
      this.ctx.moveTo(x + radius, y);
      this.ctx.arcTo(x + this.squareSize, y, x + this.squareSize, y + this.squareSize, radius);
      this.ctx.arcTo(x + this.squareSize, y + this.squareSize, x, y + this.squareSize, radius);
      this.ctx.arcTo(x, y + this.squareSize, x, y, radius);
      this.ctx.arcTo(x, y, x + this.squareSize, y, radius);
      this.ctx.stroke();
      */

    // Below is for drawing is small circle
    // ---------------------------------------
    let { x, y } = pos;
    x = (x + 1) * this.squareSize;
    y = (y + 1) * this.squareSize;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    this.ctx.clearRect(x - this.padding, y - this.padding, this.squareSize, this.squareSize);
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.squareSize * 0.2, 0, Math.PI * 2);
    this.ctx.fill();
    return;

    let type = null;
    if (type === "check") {
      color = "rgba(255, 0, 0, 0.25)";
      let grd = this.ctx.createRadialGradient(this.padding.x, this.padding.y, this.squareSize * 0.01, this.padding.x, this.padding.y, this.squareSize * 0.5);
      grd.addColorStop(0, color);
      grd.addColorStop(1, "rgba(255, 255, 255, 0)");
      this.ctx.fillStyle = grd;
      this.ctx.beginPath();
      this.ctx.arc((pos.x + 1) * this.squareSize, (pos.y + 1) * this.squareSize, this.squareSize * 0.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    /*
     */
  }

  moveToCapture(pos) {
    let { x, y } = pos;
    let radius = this.squareSize * 0.05;
    this.ctx.lineWidth = this.squareSize * 0.025;
    x = this.padding + x * this.squareSize;
    y = this.padding + y * this.squareSize;
    this.ctx.clearRect(x, y, this.squareSize, this.squareSize);
    let x1 = x + this.ctx.lineWidth * 0.75,
      y1 = y + this.ctx.lineWidth * 0.75;
    let x2 = x - this.ctx.lineWidth * 0.75 + this.squareSize,
      y2 = y - this.ctx.lineWidth * 0.75 + this.squareSize;

    this.ctx.strokeStyle = "rgba(180, 50, 50, 1)";
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
      this.ctx.clearRect(x - this.padding, y - this.padding, this.squareSize, this.squareSize);
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.squareSize * 0.45, 0, Math.PI * 2);
      this.ctx.stroke();
      */
  }
}
