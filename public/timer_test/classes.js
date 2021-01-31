export class Particle {
  constructor(x, y, radius) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.desired = {x: 0, y: 0 };
    this.radius = radius;
    this.distance = Math.min(canvas.width / 4, canvas.height / 4);
    this.steeringForce = 30;
  }

  update(canvas) {
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
    this.edges(canvas);
  }

  edges(canvas) {
      if (this.pos.x - this.radius - this.distance < 0) {
        this.acc.x = Math.abs((this.pos.x + this.radius) / this.distance / this.steeringForce);
      }
      
      if(this.pos.x + this.radius + this.distance > canvas.width) {
        this.acc.x = -((canvas.width - this.pos.x + this.radius) / this.distance / this.steeringForce);
      }
      
      if (this.pos.y - this.radius - this.distance < 0) {
        this.acc.y = Math.abs((this.pos.y + this.radius) / this.distance / this.steeringForce);
      }
      
      if(this.pos.y + this.radius + this.distance > canvas.height) {
        this.acc.y = -((canvas.height - this.pos.y + this.radius) / this.distance / this.steeringForce);
      }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}