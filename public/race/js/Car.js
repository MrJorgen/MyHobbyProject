export class Car {
  constructor(x, y, img) {
    this.posX = x;
    this.posY = y;
    this.velX = 0;
    this.velY = 0;
    this.accX = 0;
    this.accY = 0;
    this.img = img;
    this.heading = Math.PI;
    this.turningLeft = false;
    this.turningRight = false;
    this.accelerate = false;
    this.speed = 0;
    this.maxSpeed = 0;
    this.acceleration = 0.5;
    this.accelButton = 1;
    this.steerButton = 0;
    this.condition = 1;
    this.turnSpeed = 0.055;
    this.friction = 0.96;
  }

  update(width, height) {
    let speed = this.getSpeed(),
      acceleration = this.acceleration * this.accelButton;
    
      // This causes the car to drift
    this.velX = Math.cos(this.heading) * speed * 0.05 + (this.velX * 0.95);
    this.velY = Math.sin(this.heading) * speed * 0.05 + (this.velY * 0.95);
    
    if (this.turningLeft) {
      this.heading -= this.turnSpeed * this.steerButton;
    }
    if (this.turningRight) {
      this.heading += this.turnSpeed * this.steerButton;
    }

    if (this.accelerate) {
      this.accX = Math.cos(this.heading) * acceleration;
      this.accY = Math.sin(this.heading) * acceleration;
    }
    // Add acceleration to velocity
    this.velX += this.accX;
    this.velY += this.accY;
    // Add friction to velocity
    this.velX *= this.friction;
    this.velY *= this.friction;
    // Add velocity to position
    this.posX += this.velX;
    this.posY += this.velY;
    // Set acceleration to 0 because it's not a continous force
    this.accX = 0;
    this.accY = 0;
    this.edges(width, height);
  }

  getSpeed() {
    return Math.sqrt(this.velX * this.velX + this.velY * this.velY);
  }
  
  findMaxSpeed() {
    let currentSpeed = 0,
      maxSpeed = -1,
      acceleration = this.acceleration,
      friction = 0.96;
    while (currentSpeed >= maxSpeed) {
      currentSpeed += acceleration;
      currentSpeed *= friction;
      currentSpeed = parseFloat(currentSpeed.toFixed(10));
      if (currentSpeed > maxSpeed) {
        maxSpeed = currentSpeed;
      }
      else {
        break;
      }
    }
    this.maxSpeed = maxSpeed;
  }

  edges(width, height) {
    if (this.posX - this.img.width / 2 < 0) {
      this.posX = 0 + this.img.width / 2;
      this.velX = 0;
      this.velY = 0;
    }
    if (this.posY - this.img.height / 2 < 0) {
      this.posY = 0 + this.img.height / 2;
      this.velX = 0;
      this.velY = 0;
    }
  }

  show(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(this.posX, this.posY);
    ctx.rotate(this.heading);
    ctx.shadowColor = "black";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2, this.img.width, this.img.height);
    ctx.restore();
  }
}
