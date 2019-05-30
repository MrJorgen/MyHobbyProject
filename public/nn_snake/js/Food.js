export class Food {
  constructor(x = 0, y = 0, scale = 20) {
    this.x = x;
    this.y = y;
    this.scale = scale;
  }

  newPosition(width, height) {
    this.x = Math.floor(Math.random() * (width / this.scale)) * this.scale;
    this.y = Math.floor(Math.random() * (height / this.scale)) * this.scale;
  }

  show(ctx) {
    ctx.save();
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#ff3";
    ctx.lineWidth = 1;

    ctx.fillRect(this.x, this.y, this.scale, this.scale);


    ctx.beginPath();
    ctx.strokeRect(this.x + (ctx.lineWidth / 2), this.y + (ctx.lineWidth / 2), this.scale, this.scale);
    ctx.closePath();

    ctx.restore();
  }

}

