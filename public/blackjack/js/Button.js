export class Button {
  constructor(x, y, width, height, text, color, ctx) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.textColor = color;
    this.active = false;
    this.hover = false;
    this.setup(ctx);
  }

  setup(ctx) {
    let fillGradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    fillGradient.addColorStop(0, "#363636");
    fillGradient.addColorStop(1, "#282828");
    this.fillGradient = fillGradient;
    let highLightGradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    highLightGradient.addColorStop(0, "#444444");
    highLightGradient.addColorStop(1, "#363636");
    this.highLightGradient = highLightGradient;
    let strokeGradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    strokeGradient.addColorStop(0, "#505050");
    strokeGradient.addColorStop(1, "#262626");
    this.strokeGradient = strokeGradient;
  }
  
  draw(ctx) {
    let radius = this.height * 0.1;
    ctx.save();

    // Button
    if (this.hover) {
      ctx.fillStyle = this.highLightGradient;
    }
    else {
      ctx.fillStyle = this.fillGradient;
    }
    ctx.strokeStyle = this.strokeGradient;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arcTo(this.x + this.width / 2, this.y, this.x + this.width, this.y, radius);
    ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, radius);
    ctx.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, radius);
    ctx.arcTo(this.x, this.y + this.height, this.x, this.y, radius);
    ctx.arcTo(this.x, this.y, this.x + this.width, this.y, radius);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // Text
    ctx.fillStyle = this.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold " + this.height * 0.6 + "px DIN Condensed";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + this.height * 0.01);

    ctx.restore();
  }
}