import { NeuralNetwork } from "./NN.js";

export class Snake {
  constructor(x, y, scale = 10, width, height) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.score = 0;
    this.growing = false;
    this.dead = false;
    this.canMove = true;
    this.tail = [];
    this.brain = new NeuralNetwork(4, 4, 4);
    this.age = 0;
    this.directions = {
      UP: { x: 0, y: -this.scale },
      RIGHT: { x: this.scale, y: 0 },
      DOWN: { x: 0, y: this.scale },
      LEFT: { x: -this.scale, y: 0 }
    }
    this.dir = this.directions.RIGHT;
    this.lifeSpan = (width / this.scale) * (height / this.scale);
  }

  think(width, height, food) {
    let inputs = [];

    // Where am I?
    inputs.push(this.x / width);
    inputs.push(this.y / height);

    // Where am I going?
    // inputs.push((this.dir.x + this.scale) / this.scale * 2);
    // inputs.push((this.dir.y + this.scale) / this.scale * 2);
    
    // Where is the food?
    inputs.push(food.x / width);
    inputs.push(food.y / height);

    console.log(inputs);
    let outputs = this.brain.predict(inputs);
    let index = outputs.indexOf(Math.max(...outputs));

    switch (index) {
      case 0:
        if (this.dir !== this.directions.DOWN) {
          this.dir = this.directions.UP;
          this.canMove = false;
        }
        // console.log("⬆️");
        break;
        case 1:
        if (this.dir !== this.directions.LEFT) {
          this.dir = this.directions.RIGHT;
          this.canMove = false;
        }
        // console.log("➡️");
        this.canMove = false;
        break;
        case 2:
        if (this.dir !== this.directions.UP) {
          this.dir = this.directions.DOWN;
          this.canMove = false;
        }
        // console.log("⬇️");
        break;
        case 3:
        if (this.dir !== this.directions.RIGHT) {
          this.dir = this.directions.LEFT;
          this.canMove = false;
        }
        // console.log("⬅️");
        break;
    }

    /*
    Inputs:
    1 = Distance to top wall
    2 = Distance to right wall
    3 = Distance to bottom wall
    4 = Distance to left wall
    5 = Foods x position
    6 = Foods y position

    Outputs:
    1 = UP
    2 = RIGHT
    3 = DOWN
    4 = LEFT
    */
  }

  update() {
    this.tail.unshift({ x: this.x, y: this.y });
    if (!this.growing) {
      this.tail.pop();
    }
    this.x += this.dir.x;
    this.y += this.dir.y;
    this.canMove = true; // Prevent more than one movement before position is updated
    this.growing = false;
  }

  showDeadSnake(ctx) {
    // Made this just to show a read "head" for one iteration
    this.x -= this.dir.x;
    this.y -= this.dir.y;
    ctx.fillStyle = "#f22";
    ctx.fillRect(this.x, this.y, this.scale, this.scale);
    ctx.strokeRect(this.x + (ctx.lineWidth / 2), this.y + (ctx.lineWidth / 2), this.scale, this.scale);
  }

  checkCollision(width, height) {
    // Check edges
    if (this.x < 0 || this.x >= width || this.y < 0 || this.y >= height) {
      this.dead = true;
    }
    // Check tail
    this.tail.forEach((tail) => {
      if (this.x == tail.x && this.y == tail.y) {
        this.dead = true;
      }
    });
  }

  show(ctx) {
    ctx.save();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;


    // Snake head
    ctx.fillStyle = "#0c0";
    ctx.fillRect(this.x, this.y, this.scale, this.scale);
    ctx.strokeRect(this.x + (ctx.lineWidth / 2), this.y + (ctx.lineWidth / 2), this.scale, this.scale);

    // Snake tail
    ctx.fillStyle = "#6f6";
    if (this.tail.length > 0) {
      this.tail.forEach((tail) => {
        ctx.fillRect(tail.x, tail.y, this.scale, this.scale);
        ctx.strokeRect(tail.x + (ctx.lineWidth / 2), tail.y + (ctx.lineWidth / 2), this.scale, this.scale);
      });
    }

    ctx.restore();
  }
}