export class Pacman {
  constructor(x, y) {
    this.pos = { x: x, y: y };
    this.speed = 21 / 16;
    this.DIR = {
      up: { x: 0, y: -this.speed },
      left: { x: -this.speed, y: 0 },
      down: { x: 0, y: this.speed },
      right: { x: this.speed, y: 0 }
    }
    this.color = "rgb(255, 255, 0)";
    this.directions = ["up", "left", "down", "right"];
    this.currentDirection = this.directions[1];
    this.heading = this.DIR.left;
    this.start = { x: 13.5, y: 26 };
    this.stationaryImage = 0;
    this.moving = true;
    this.turning = false;
    this.lastAteTime = 0;
    this.eating = false;
    this.paused = false;
    this.pauseEnd = 0;
    this.diedAt = 0;
    this.dead = false;
  }

  update(currentSpeed, game) {
    if (this.pauseEnd > game.timer) {
      return;
    }
    let size = game.tileSize,
      nextTile = {
        col: Math.round(this.pos.x),
        row: Math.round(this.pos.y),
      },
      currentTile = game.tiles[nextTile.row][nextTile.col];

    // Check if Pacman is eating dots
    if (currentTile.dot > 0 && !currentTile.eaten) {
      currentTile.eat(game);
      game.dotsEaten++;
      this.lastAteTime = game.timer;
      this.eating = true;
    }
    else {
      this.eating = false;
    }


    // Check maze for walls
    if (!this.turning) {
      if (this.currentDirection === "left") {
        nextTile.col--;
      }
      if (this.currentDirection === "right") {
        nextTile.col++;
      }
      if (this.currentDirection === "up") {
        nextTile.row--;
      }
      if (this.currentDirection === "down") {
        nextTile.row++;
      }
    }


    if (game.maze[nextTile.row][nextTile.col] < 0) {
      this.pos.x = Math.round(this.pos.x);
      this.pos.y = Math.round(this.pos.y);
      this.moving = false;
    }

    if (this.moving && !this.eating) {
      this.pos.x += this.heading.x * currentSpeed / size;
      this.pos.y += this.heading.y * currentSpeed / size;
    }

    // Wrap around
    if (this.pos.x <= 0) {
      this.pos.x += 27;
    }
    if (this.pos.x > 27) {
      this.pos.x -= 27;
    }

  }

  draw(game) {
    let size = game.tileSize,
      ctx = game.context, timer = game.timer;
    if (!this.moving && game.state == game.STATES[1]) {
      timer = 0;
    }
    
    // "Full" pacman when getting ready and when he's just died
    if (
      game.state === game.STATES[0] ||
      (this.dead && (game.timer < (this.diedAt + 1000)) && game.state === game.STATES[1])
    ) {
      drawPacman(
        ctx,
        this.images.full,
        this.pos,
        size
      );
    }

    // Start of dying animation
    if (game.state == game.STATES[2] && game.timer <= 1000) {
      drawPacman(
        ctx,
        this.images.die[1],
        this.pos,
        size
      );
    }
    
    // Start of dying animation
    if (game.state == game.STATES[2] && game.timer > 1000) {
      let counter = Math.floor(game.timer - 1000);
      counter = 2 + Math.floor(counter / (1000 / 60 * 8));
      if (counter > this.images.die.length - 1) {
        counter = this.images.die.length - 1;
      }
      drawPacman(
        ctx,
        this.images.die[counter % this.images.die.length],
        this.pos,
        size
      );
    }
    
    // Game running, pacman is alive and well :)
    if (game.state == game.STATES[1] && !this.dead) {
      let animLength = this.images[this.currentDirection].length;
      drawPacman(
        ctx,
        this.images[this.currentDirection][Math.floor(timer / 30) % animLength],
        this.pos,
        size
      );
    }
  }

  reset() {
    this.pos.x = this.start.x;
    this.pos.y = this.start.y;
    this.currentDirection = this.directions[1];
    this.heading = this.DIR.left;
    this.dead = false;
    this.moving = true;
    this.turning = false;
    this.eating = false;
    this.paused = false;
    this.pauseEnd = 0;
    this.diedAt = 0;
  }

  die(game) {
    this.diedAt = Math.round(game.timer);
    this.moving = false;
    this.dead = true;
  }

  canMove(dir, maze) {
    let moveX = Math.round(dir.x) + Math.round(this.pos.x),
      moveY = Math.round(dir.y) + Math.round(this.pos.y);
    return (maze[moveY][moveX] >= 0);
  }
}

function drawPacman(ctx, image, pos, size) {
  ctx.drawImage(
    image,
    Math.floor(pos.x * size - (size / 2)),
    Math.floor(pos.y * size - (size / 2))
  );

}