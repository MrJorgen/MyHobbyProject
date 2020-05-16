class Ghost {
  constructor() {
    this.target = { col: null, row: null };
    this.dead = false;
    this.scared = false;
    this.canMove = true;
    this.directions = ["up", "left", "down", "right"];
    this.DIR = {
      up: { x: 0, y: -1 },
      left: { x: -1, y: 0 },
      down: { x: 0, y: 1 },
      right: { x: 1, y: 0 }
    }
    this.mode = null;
    this.active = false;
    this.turning = false;
    this.currentSpeed = 0.8;
    this.mustTurnAround = false;
    this.canTurnAround = false;
    this.atHome = true;
    this.path = [];
  }

  update(currentSpeed, game) {
    if (game.pacman.dead || game.state == game.STATES[4]) {
      return;
    }
    // Double speed when dead(eyes)
    this.currentSpeed = this.dead ? currentSpeed * 2 : currentSpeed;
    this.path = [];
    let { tileSize, maze } = game,
      nextTile = {
        col: Math.floor(this.pos.x),
        row: Math.floor(this.pos.y),
      },
      currentTile = {
        col: Math.floor(this.pos.x),
        row: Math.floor(this.pos.y),
      }

    // Ghost is in chasemode
    if (game.ghostMode === "chase" && !this.dead) {
      this.chase(game);
    }

    // Ghost is in scattermode
    if (game.ghostMode === "scatter" && !this.dead) {
      this.target.col = this.home.col;
      this.target.row = this.home.row;
    }

    // Ghost is no longer scared
    if (this.scared && game.timer >= this.scaredStart + game.levels[game.level].scaredDuration) {
      this.scared = false;
    }

    // Ghost is scared
    if (this.scared) {
      this.currentSpeed = 10 / 16;
    }

    // Tunnel speed penalty
    if (currentTile.row == 17 && currentTile.col <= 5 || currentTile.row == 17 && currentTile.col >= 22) {
      this.currentSpeed *= 0.4;
    }

    // Ghost exiting home
    if (currentTile.col >= 11 && currentTile.col <= 16 && currentTile.row >= 16 && currentTile.row <= 18) {
      this.exitHome(tileSize);
      return;
    }
    else {
      this.atHome = false;
    }

    // Ghost is active
    if (this.active) {
      // This is where the ghost starts to look in the direction it will move next
      if (!this.turning) {
        nextTile.col += this.heading.x;
        nextTile.row += this.heading.y;
        let nextDirection = this.turn(game, nextTile, this.currentDirection);
        if (this.currentDirection !== nextDirection) {
          this.currentDirection = nextDirection;
          this.turnAt = nextTile;
          this.turning = true;
        }
      }
      // And this is where it actually turns
      if (this.turning && this.turnAt.col == currentTile.col && this.turnAt.row == currentTile.row) {
        // console.log(this.name + " is turning " + this.currentDirection);
        if (this.heading.x < 0 && Math.floor(this.pos.x) > this.pos.x + (this.heading.x * this.currentSpeed / tileSize) ||
          this.heading.x > 0 && Math.floor(this.pos.x) < this.pos.x + (this.heading.x * this.currentSpeed / tileSize) ||
          this.heading.y < 0 && Math.floor(this.pos.y) > this.pos.y + (this.heading.y * this.currentSpeed / tileSize) ||
          this.heading.y > 0 && Math.floor(this.pos.y) < this.pos.y + (this.heading.y * this.currentSpeed / tileSize)
        ) {
          this.turning = false;
          this.heading = this.DIR[this.currentDirection];
          if (!this.atHome) {
            if (this.heading.x == 0) {
              this.pos.x = Math.round(this.pos.x);
            }
            if (this.heading.y == 0) {
              this.pos.y = Math.round(this.pos.y);
            }
          }
        }
      }
      this.pos.x += this.heading.x * this.currentSpeed / tileSize;
      this.pos.y += this.heading.y * this.currentSpeed / tileSize;

      if (game.debug.ghostMovePath && !this.scared) {
        this.projectPath(game, nextTile);
      }

      // Wrap around in tunnel
      if (this.pos.x < -1) {
        this.pos.x += 28;
      }
      if (this.pos.x > 28) {
        this.pos.x -= 28;
      }
    }
  }

  checkCollision(game) {
    let myTile = {
        col: Math.floor(this.pos.x),
        row: Math.floor(this.pos.y)
      },
      otherTile = {
        col: Math.floor(game.pacman.pos.x),
        row: Math.floor(game.pacman.pos.y)
      }
    if (myTile.col == otherTile.col && myTile.row == otherTile.row) {
      this.collide(game);
    }
  }

  collide(game) {
    if (this.scared) {
      this.dead = true;
      this.target.col = 13.5;
      this.target.row = 14;
    }
    else {
      if (!game.pacman.dead) {
        game.pacman.die(game);
      }
    }
  }

  draw(ctx, timer, game) {
    if (game.state == game.STATES[4]) { return };
    let { tileSize, debug } = game,
      size = tileSize,
      animLength = this.images[this.currentDirection].length;

    if (this.scared && !this.dead) {
      ctx.drawImage(
        this.images["scared"].blue[Math.floor(timer / 7.5) % animLength],
        Math.round(this.pos.x * size - (size / 2)),
        Math.round(this.pos.y * size - (size / 2))
      )
    }
    else if (this.dead) {
      ctx.drawImage(
        this.images.dead[this.currentDirection],
        Math.round(this.pos.x * size - (size / 2)),
        Math.round(this.pos.y * size - (size / 2))
      )
    }
    else {
      // Each frame should be drawn for 8 frames or 8 * (1000 / 60)
      ctx.drawImage(
        this.images[this.currentDirection][Math.floor(timer / 7.5) % animLength],
        Math.round(this.pos.x * size - (size / 2)),
        Math.round(this.pos.y * size - (size / 2))
      )
    }
    // Draw target
    if (game.debug.ghostTarget) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.color;
      ctx.setLineDash([3, 2]);

      ctx.beginPath();
      ctx.moveTo(this.target.col * size, this.target.row * size + 0.5);
      ctx.lineTo(this.target.col * size + size, this.target.row * size + 0.5);

      ctx.moveTo(this.target.col * size - 0.5 + size, this.target.row * size);
      ctx.lineTo(this.target.col * size - 0.5 + size, this.target.row * size + size);

      ctx.moveTo(this.target.col * size + size, this.target.row * size - 0.5 + size);
      ctx.lineTo(this.target.col * size, this.target.row * size - 0.5 + size);

      ctx.moveTo(this.target.col * size + 0.5, this.target.row * size + size);
      ctx.lineTo(this.target.col * size + 0.5, this.target.row * size);
      ctx.stroke();

      // ctx.setLineDash([]);
      // ctx.lineWidth = 2;
      // ctx.beginPath();
      // ctx.moveTo(this.pos.x * size + (size / 2), this.pos.y * size + (size / 2));
      // ctx.lineTo(this.target.col * size + (size / 2), this.target.row * size + (size / 2));
      // ctx.stroke();

      ctx.restore();
    }
  }

  turn(game, nextTile, currentDirection) {
    // headings = ["up", "left", "down", "right"],
    let maze = game.maze,
      possibleTiles = [],
      { row, col } = nextTile;

    // Prohibit turn up row 14 and row 26
    if (row == 14 || row == 26) {
      if (col == 12 || col == 15) {
        if (currentDirection !== "down") {
          return currentDirection;
        }
      }
    }

    // Force left turn when exiting home
    if (this.pos.x == 13.5 && row >= 14 && row <= 17 && currentDirection == this.directions[0]) {
      // console.log(this.name + " is exiting home");
      return this.directions[1];
    }

    // Prohibit entering Ghost Home when not dead
    if (row == 14 && col >= 13 && col <= 14) {
      if (currentDirection !== "up") {
        return currentDirection;
      }
    }

    // Force turn around
    if (this.mustTurnAround) {
      this.mustTurnAround = false;
      if (currentDirection == "down") {
        possibleTiles.push({ row: row - 1, col: col, dir: 0 });
      }
      if (currentDirection == "right") {
        possibleTiles.push({ row: row, col: col - 1, dir: 1 });
      }
      if (currentDirection == "up") {
        possibleTiles.push({ row: row + 1, col: col, dir: 2 });
      }
      if (currentDirection == "left") {
        possibleTiles.push({ row: row, col: col + 1, dir: 3 });
      }
      return this.directions[possibleTiles[0].dir];
    }

    // Check for possible turns
    // Turn Up
    if (maze[row - 1][col] >= 0 && currentDirection !== "down") {
      possibleTiles.push({ row: row - 1, col: col, dir: 0 });
    }
    // Turn Left
    if (maze[row][col - 1] >= 0 && currentDirection !== "right") {
      possibleTiles.push({ row: row, col: col - 1, dir: 1 });
    }

    // Turn Down
    if (maze[row + 1][col] >= 0 && currentDirection !== "up") {
      possibleTiles.push({ row: row + 1, col: col, dir: 2 });
    }
    // Turn Right
    if (maze[row][col + 1] >= 0 && currentDirection !== "left") {
      possibleTiles.push({ row: row, col: col + 1, dir: 3 });
    }

    if (possibleTiles.length == 0) {
      return currentDirection;
    }
    if (possibleTiles.length <= 1) {
      return this.directions[possibleTiles[0].dir];
    }

    // Chase target
    if (game.ghostMode !== "scared" && possibleTiles.length > 1) {
      let shortest = { index: 0, dist: Infinity };
      for (let i = 0; i < possibleTiles.length; i++) {
        let chosenTile = possibleTiles[i];
        if (distToTarget(this.target, chosenTile) < shortest.dist) {
          shortest.dist = distToTarget(this.target, chosenTile);
          shortest.index = possibleTiles[i].dir;
        }
      }
      return this.directions[shortest.index];
    }

    // Make a random turn when scared
    if (this.scared) {
      let random = Math.floor(Math.random() * possibleTiles.length);
      return this.directions[possibleTiles[random].dir];
    }
  }

  reset() {
    this.pos.x = this.startPos.x;
    this.pos.y = this.startPos.y;
    this.currentDirection = this.startDir;
    this.heading = this.DIR[this.startDir];
    this.dead = false;
    this.scared = false;
    this.active = false;
    this.turning = false;
    this.target.col = this.home.col;
    this.target.row = this.home.row;
  }

  enterHome() {

  }

  exitHome(tileSize) {
    // headings = ["up", "left", "down", "right"],
    this.target = { col: 12, row: 14 };
    this.currentSpeed *= 0.5;
    let nextPos = {
      col: this.pos.x + this.heading.x * this.currentSpeed / tileSize,
      row: this.pos.y + this.heading.y * this.currentSpeed / tileSize
    }

    // Ghost is not active and bouncing up and down
    if (!this.active) {
      if (nextPos.row <= 16.5) {
        if (this.currentDirection == "up") {
          this.currentDirection = this.directions[2];
          this.heading = this.DIR.down;
        }
      }
      if (nextPos.row >= 17.5) {
        if (this.currentDirection == "down") {
          this.currentDirection = this.directions[0];
          this.heading = this.DIR.up;
        }
      }
    }
    // Ghost is becoming active and exiting home
    else {
      if (this.pos.x < 13.5 && this.heading == this.DIR.left || this.pos.x > 13.5 && this.heading == this.DIR.right) {
        this.pos.x = 13.5;
      }
      if (this.pos.x > 13.5 && this.heading !== this.DIR.left) {
        this.currentDirection = this.directions[1];
        this.heading = this.DIR.left;
      }
      if (this.pos.x < 13.5 && this.heading !== this.DIR.right) {
        this.currentDirection = this.directions[3];
        this.heading = this.DIR.right;
      }

      if (this.pos.x == 13.5 && this.heading !== this.DIR.up) {
        this.heading = this.DIR.up;
        this.currentDirection = this.directions[0];
      }
    }
    this.pos.x += this.heading.x * this.currentSpeed / tileSize;
    this.pos.y += this.heading.y * this.currentSpeed / tileSize;
  }

  projectPath(game) {
    let tempDir = this.currentDirection,
      tempTile = { col: Math.floor(this.pos.x), row: Math.floor(this.pos.y) };
    this.path.push({ col: tempTile.col, row: tempTile.row });

    if (this.turning) {
      this.path.push({ col: this.turnAt.col, row: this.turnAt.row });
      tempTile.col = this.turnAt.col;
      tempTile.row = this.turnAt.row;
    }

    let i = 0;
    let exit = false;
    while (!exit) {
      // debugger;
      tempDir = this.turn(game, tempTile, tempDir);
      if (tempDir === "left") {
        tempTile.col--;
      }
      if (tempDir === "right") {
        tempTile.col++;
      }
      if (tempDir === "up") {
        tempTile.row--;
      }
      if (tempDir === "down") {
        tempTile.row++;
      }
      this.path.forEach((tmp) => {
        if (tmp.col == tempTile.col && tmp.row == tempTile.row) {
          exit = true;
        }
      });
      this.path.push({ col: tempTile.col, row: tempTile.row });

      i++;
      if (i > 500 || tempTile.col == this.target.col && tempTile.row == this.target.row) { exit = true; }
    }

    game.context.save();
    game.context.strokeStyle = this.color;
    game.context.fillStyle = this.color;
    game.context.lineWidth = 2;
    game.context.beginPath();
    game.context.moveTo(this.path[0].col * game.tileSize + 4, this.path[0].row * game.tileSize + 4);
    for (let i = 0; i < this.path.length; i++) {
      game.context.lineTo(this.path[i].col * game.tileSize + 4, this.path[i].row * game.tileSize + 4);
    }
    game.context.stroke();

    game.context.beginPath();
    game.context.arc(this.path[this.path.length - 1].col * game.tileSize + 4, this.path[this.path.length - 1].row * game.tileSize + 4, 3, 0, Math.PI * 2);
    game.context.fill();

    game.context.restore();
    if (this.name == "blinky") {
    }
  }
}
// End generic ghost class

export class Blinky extends Ghost {
  constructor() {
    super("blinky");
    this.name = "blinky";
    this.startDir = "left";
    this.currentDirection = "left";
    this.home = { col: 24, row: 0 };
    this.startPos = { x: 13.5, y: 14 };
    this.pos = { x: 13.5, y: 14 };
    this.color = "rgba(255, 0, 0, 1)";
    this.heading = this.DIR[this.startDir];
  }

  chase(game) {
    let pacTarget = {
      col: Math.floor(game.pacman.pos.x),
      row: Math.floor(game.pacman.pos.y)
    };
    this.target.col = pacTarget.col;
    this.target.row = pacTarget.row;
  }
}

export class Pinky extends Ghost {
  constructor() {
    super("pinky");
    this.startDir = "down";
    this.currentDirection = "down";
    this.name = "pinky";
    this.home = { col: 2, row: 0 };
    this.startPos = { x: 13.5, y: 17 };
    this.pos = { x: 13.5, y: 17 };
    this.color = "rgba(252, 181, 254, 1)";
    this.heading = this.DIR[this.startDir];
  }

  chase(game) {
    this.target.col = Math.floor(game.pacman.pos.x + Math.sign(game.pacman.heading.x) * 4);
    this.target.row = Math.floor(game.pacman.pos.y + Math.sign(game.pacman.heading.y) * 4);

    // The infamous bug
    if (game.pacman.currentDirection == "up") {
      this.target.col -= 4;
    }
  }
}

export class Inky extends Ghost {
  constructor() {
    super("inky");
    this.name = "inky";
    this.startDir = "up";
    this.currentDirection = "up";
    this.home = { col: 27, row: 35 };
    this.startPos = { x: 11.5, y: 17 };
    this.pos = { x: 11.5, y: 17 };
    this.color = "rgba(0, 255, 255, 1)";
    this.heading = this.DIR[this.startDir];
  }

  chase(game) {
    let inkyTarget = {
      col: Math.floor(game.pacman.pos.x + Math.sign(game.pacman.heading.x) * 2),
      row: Math.floor(game.pacman.pos.y + Math.sign(game.pacman.heading.y) * 2)
    }, blinkyVector = {
      col: inkyTarget.col - Math.floor(game.ghosts.blinky.pos.x),
      row: inkyTarget.row - Math.floor(game.ghosts.blinky.pos.y)
    }

    // The infamous bug
    if (game.pacman.currentDirection == "up") {
      blinkyVector.col -= 2;
    }
    this.target.col = inkyTarget.col + blinkyVector.col;
    this.target.row = inkyTarget.row + blinkyVector.row;
  }
}

export class Clyde extends Ghost {
  constructor() {
    super("clyde");
    this.name = "clyde";
    this.startDir = "up";
    this.currentDirection = "up";
    this.home = { col: 0, row: 35 };
    this.startPos = { x: 15.5, y: 17 };
    this.pos = { x: 15.5, y: 17 };
    this.color = "rgba(248, 187, 85, 1)";
    this.heading = this.DIR[this.startDir];
  }

  chase(game) {
    let pacTarget = {
      col: Math.floor(game.pacman.pos.x),
      row: Math.floor(game.pacman.pos.y)
    }, currentTile = {
      col: Math.floor(this.pos.x),
      row: Math.floor(this.pos.y),
    };
    if (distToTarget(pacTarget, currentTile) < 8) {
      this.target.col = this.home.col;
      this.target.row = this.home.row;
    }
    else {
      this.target.col = Math.floor(game.pacman.pos.x);
      this.target.row = Math.floor(game.pacman.pos.y);
    }
}

}

function distToTarget(a, b) {
  let dx = Math.floor(a.col) - Math.floor(b.col),
    dy = Math.floor(a.row) - Math.floor(b.row);
  return (Math.sqrt(dx * dx + dy * dy));
}
