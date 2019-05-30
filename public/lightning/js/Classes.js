export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
      this.x += other.x;
      this.y += other.y;
  }

  show(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

export class Lightning {
  constructor(lines) {
    this.lines = lines;
    this.displayFrames = 5;
    this.fadeRate = 0.08;
    this.opacity = 1;
    this.color = this.setColor();
    this.branches = [];
    this.repeats = 0;
    // this.repeats = Math.floor(Math.random() * 3);
  }
  setColor() {
    this.color = `rgba(220, 200, 255, ${this.opacity})`;
  }
}

export class Line {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.angle = this.getDirection();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.startPoint.x, this.startPoint.y);
    ctx.lineTo(this.endPoint.x, this.endPoint.y);
    ctx.stroke();
    ctx.closePath();
  }
  
  getDirection() {
    return Math.atan2(this.endPoint.y - this.startPoint.y, this.endPoint.x - this.startPoint.x);
  }

  getLength() {
    return Math.sqrt(Math.pow(this.endPoint.x - this.startPoint.x, 2) + Math.pow(this.endPoint.y - this.startPoint.y, 2));
  }
}
