import { NeuralNetwork } from "./lib/nn.js";
import { sprites } from "./sprites.js";
import { sfx } from "./sfx.js";

export class Bird {
  constructor(x, y, colorIndex = 0) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.offset = 0;
    this.images = sprites.bird[colorIndex]; // 0 = yellow, 1 = blue, 2 = red
    this.image = this.images[0];
    this.left = this.x - (this.image.width / 2);
    this.right = this.x + (this.image.width / 2);
    this.top = this.y - (this.image.height / 2);
    this.bottom = this.y + (this.image.height / 2);
    this.tick = 0;
    this.images.push(this.images[1]);
    this.active = true;
    this.angle = 0;
    this.crashed = false;
    this.dead = false;
    this.blink = 0;
    this.brain = new NeuralNetwork(6, 8, 2);
    this.score = 0;
    this.fitness = 0;
    this.gapDist = 0;
    // let self = this;
    // window.addEventListener("keydown", event => {
    //   if (event.keyCode == 32 && !event.repeat) {
    //     self.jump();
    //   }
    // });
    // window.addEventListener("touchstart", () => {
    //   self.jump();
    // });
  }

  think(pipes, width, height) {
    let closestPipe = null,
      closestDist = Infinity,
      pipeWidth = sprites.pipe.green.top.width;

    // Find next closest pipe including the one being passes until tail is out
    for (let i = 0; i < pipes.length; i++) {
      let dist = pipes[i].x + pipeWidth - this.left;
      if (dist < closestDist && dist > 0) {
        closestPipe = pipes[i];
        closestDist = dist;
      }
    }
    let inputs = [];
    inputs.push(this.top / height);
    inputs.push(this.bottom / height);
    inputs.push(this.right / width);
    // inputs.push(this.vy / 16); // Max vertical velocity is 15.290000000000003
    inputs.push(closestPipe.x / width);
    inputs.push((closestPipe.y - 50) / height);
    inputs.push((closestPipe.y + 50) / height);
    let output = this.brain.predict(inputs);
    if (output[0] > output[1]) {
      this.jump();
    }
  }

  /*
  inputs:
    0: bird top
    1: bird bottom
    2: bird front
    3: bird y vel
    4: pipe front(x closest to bird)
    5: pipe top y
    6: pipe bottom y


  */

  update(pipes, height) {
    if (this.active) {
      this.offset = 0; // Stop the hover movement
      this.vy += 0.33; // Gravity
    }

    // Hover animation
    if (!this.active && !this.dead) {
      this.offset = Math.round(Math.sin(this.tick / 8) * 4);
    }
    this.y += this.vy; // Add velocity to position
    this.top = this.y - (this.image.height / 2);
    this.bottom = this.y + (this.image.height / 2);
    this.tick++; // For animating the bird wings
    this.image = this.images[Math.floor(this.tick / 6) % 4]; // Set flap animation images
    // Angle up at jump
    if (this.vy < 0 && this.angle > -0.05 * Math.PI) {
      this.angle += this.vy / 100;
    }

    // if (this.top <= 0) { this.y = this.image.height / 2 };
    // Angle down at dive
    if (this.vy > 0 && this.angle < 0.5 * Math.PI) {
      this.angle += this.vy / 200;
      if (this.angle > 0.5) { this.angle = 0.5 };
    }
    // Check for collision with pipe
    this.collide(pipes);

    // Check if bird hit the ground
    if (this.y > (height - sprites.foreGround.height - this.image.height / 2) && !this.crashed) {
      this.dead = true;
      this.active = false;
      // Set correct position of the bird when crashed to the ground
      this.y = height - sprites.foreGround.height - this.image.height / 2;
      // if (!this.crashed) {
      //   sfx.hit.currentTime = 0;
      //   sfx.hit.play();
      // }
      this.crashed = true;

      this.gapDist = this.score;
    }
    if (!this.dead && !this.crashed) { this.score++ };
  }

  // Draw bird to canvas
  draw(ctx, x, y) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI * this.angle);
    ctx.drawImage(spriteSheet, this.image.x, this.image.y, this.image.width, this.image.height, 0 - (this.image.width / 2), 0 - (this.image.height / 2) + this.offset, this.image.width, this.image.height);
    ctx.restore();
  }

  // Jump and starts the game(exit intro)
  jump() {
    this.active = true;
    if (!this.crashed) {
      // this.vy = -6.3;
      this.vy = -6;
      // sfx.wing.currentTime = 0;
      // sfx.wing.play();
    }
  }

  // Check for collision with pipe
  collide(pipes) {

    for (let i = 0; i < pipes.length; i++) {
      // Set borders of the current pipe
      let currentPipe = {
        left: pipes[i].x,
        right: pipes[i].x + sprites.pipe.green.top.width,
        top: pipes[i].y - 50,
        bottom: pipes[i].y + 50
      };
      // Check for collision
      if (!this.crashed) {
        if (this.right > currentPipe.left && this.left < currentPipe.right) {
          if (this.top < currentPipe.top || this.bottom > currentPipe.bottom) {
            // console.log("Crashed!", pipes[i], this);
            this.blink = 6;
            this.crashed = true;
            this.gapDist = Math.min((currentPipe.top - this.bottom), (currentPipe.bottom - this.top));
            // sfx.hit.currentTime = 0;
            // sfx.hit.play();
            // setTimeout(() => {
            //   sfx.die.currentTime = 0;
            //   sfx.die.play();
            // }, 250);
          }
        }
      }
    }
  }
}