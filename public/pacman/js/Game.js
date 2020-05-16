import { levels } from "./levels.js";

export class Game {
  constructor(context) {
    this.context = context;
    this.score = 0;
    this.highScore = localStorage.getItem("highScore") || 0;
    this.STATES = ["Ready", "Running", "Pacdie", "Pacwin", "GameOver", "Paused", "Select", "Intermission"];
    this.state = this.STATES[0];
    this.maxLives = 5;
    this.lives = this.maxLives;
    this.size = { width: 28, height: 36 };
    this.baseSpeed = 20 / 16;
    this.dotsEaten = 0;
    this.totalDots = 244;
    this.level = 0;
    this.over = false;
    this.win = false;
    this.levels = levels;
    this.ticks = 0;
    this.timer = 0;
    this.startAt = 0;
    this.debug = {
      checkeredBackground: false,
      ghostMovePath: false,
      ghostTarget: false,
      useableTiles: false,
      intersections: false,
      ghostMode: false
    };
    this.ghostMode = "scatter";
    this.credits = 0;
    this.colors = {
      blinky: "#ff0000",
      pinky: "#ffb8ff",
      inky: "#00ffff",
      clyde: "#ffb850",
      dots: "#ffb8ad",
      yellow: "#ffff00"
    }
    this.colors.start = this.colors.clyde;
    this.colors.bonus = this.colors.dots;
    this.colors.players = this.colors.inky;
    this.colors.midway = this.colors.pinky;
  }
  
  reset(timer) {
    this.ghostMode = "scatter";
    this.pacman.reset();
    for (let ghost in this.ghosts) {
      this.ghosts[ghost].reset();
    }
    this.startAt = timer;
    if (this.lives > 0) {
      this.state = this.STATES[0];
    }
    else {
      this.state = this.STATES[4];
    }
  }
  
  init() {
    this.dotsEaten = 0;
    this.over = false;
    this.win = false;
  }

  update(timer) {
    this.timer = timer - this.startAt;
    if (this.dotsEaten >= this.totalDots) {
      this.win = true;
    }
    
    if (this.score >= this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore);
    }
    
    // Get ready...
    if (this.state == this.STATES[0] && this.timer >= 2000) {
      this.state = this.STATES[1];
      this.startAt = timer;
      this.lives--;
    }
    
    // Game is running
    if (this.state == this.STATES[1]) {
      let acc = 0;
      for (let i = 0; i < this.levels[this.level].modes.length; i++) {
        acc += this.levels[this.level].modes[i].duration * 1000;
        if (this.timer < acc) {
          if (this.ghostMode !== this.levels[this.level].modes[i].mode) {
            this.ghostMode = this.levels[this.level].modes[i].mode;
            // console.log("New ghost mode: " + this.ghostMode);
            for (let ghost in this.ghosts) {
                // this.ghosts[ghost].mustTurnAround = true;
            }
          }
          break;
        }
      }
      
      // How the ghosts become active
      // https://www.gamasutra.com/view/feature/132330/the_pacman_dossier.php?page=4
      if (!this.ghosts.blinky.active) {
        this.ghosts.blinky.active = true;
      }
      if (!this.ghosts.pinky.active) {
        this.ghosts.pinky.active = true;
      }
      if (!this.ghosts.inky.active && this.pacman.lastAteTime + 4000 <= this.timer || this.dotsEaten >= 30) {
        this.pacman.lastAteTime = this.timer;
        this.ghosts.inky.active = true;
      }
      if (!this.ghosts.clyde.active && this.pacman.lastAteTime + 4000 <= this.timer || this.dotsEaten >= 60) {
        this.ghosts.clyde.active = true;
      }
      this.ticks++;
      this.pacman.update(this.levels[this.level].pacSpeed, this);
      for (let ghost in this.ghosts) {
        this.ghosts[ghost].update(this.levels[this.level].ghostSpeed, this);
        this.ghosts[ghost].checkCollision(this);
      }
      if(this.pacman.dead && this.timer > this.pacman.diedAt + 1000) {
        this.startAt = timer;
        this.timer = timer - this.startAt;
        this.state = this.STATES[2];
      }
    }
    
    // Pacman dying procedure
    if (this.state == this.STATES[2]) {
      if (this.timer >= 3100) {
        this.reset(timer);
      }
    }
  }
  
  draw(ctx, timer, scoreImages) {
    // Draw pacman and ghosts
    let size = this.tileSize;
    this.drawDots(ctx);
    this.pacman.draw(this);
    
    if (this.state !== this.STATES[2]) {
      for (let ghost in this.ghosts) {
        this.ghosts[ghost].draw(ctx, timer, this);
      }
    }

    if (Math.floor(this.timer / 1000 * 4) % 2 == 0) {
      let playerTurnString = "1UP";
      for (let i = 0; i < playerTurnString.length; i++) {
        ctx.drawImage(this.images.letters[playerTurnString.charAt(i)], (3 + i) * 8, 0);
      }
    }

    /*
    // For debugging... Show current timer
    let timerString = Math.floor(this.timer);
    timerString = timerString.toString().padStart(5, " ");
    for (let i = 0; i < timerString.length; i++) {
      ctx.drawImage(this.images.letters[timerString.charAt(i)][0], (23 + i) * size, 1 * size);
    }
    
    // For debugging... Show game state
    let stateString = this.state.toString();
    stateString = stateString.toUpperCase().padStart(7, " ");
    for (let i = 0; i < stateString.length; i++) {
      ctx.drawImage(this.images.letters[stateString.charAt(i)][0], (21 + i) * size, 2 * size);
    }
    */
    
    // Draw scores
    let scoreString = this.score.toString().padStart(2, "0").padStart(7, " ");
    for (let i = 0; i < scoreString.length; i++) {
      ctx.drawImage(this.images.letters[scoreString.charAt(i)], i * size, 1 * size);
    }

    let highScoreString = this.highScore.toString().padStart(2, "0").padStart(7, " ");
    for (let i = 0; i < highScoreString.length; i++) {
      ctx.drawImage(this.images.letters[highScoreString.charAt(i)], (10 + i) * size, 1 * size);
    }

    // Draw remaining lives
    if (this.lives > 0) {
      let lives = this.lives > this.maxLives ? this.maxLives : this.lives,
        size = this.tileSize * 2;
      for (let i = 0; i < lives; i++) {
        ctx.drawImage(this.pacman.images.left[1], size + i * size, 34 * this.tileSize);
      }
    }

    if (this.state == this.STATES[0]) {
      let buffer =  this.drawTextInCustomColor("READY!", this.colors.yellow);
      ctx.drawImage(buffer, 11 * size, 20 * size);
    }

    if (this.state == this.STATES[4]) {
      let buffer =  this.drawTextInCustomColor("GAME  OVER", this.colors.blinky);
      ctx.drawImage(buffer, 9 * size, 20 * size);
    }

    // "Print" ghostmode to screen
    if (this.debug.ghostMode) {
      let ghostMode = this.ghostMode.padStart(7, " ").toUpperCase();
      for (let i = 0; i < ghostMode.length; i++) {
        ctx.drawImage(this.images.letters[ghostMode.charAt(i)][0], (21 + i) * size, 0 * size);
      }
    }
  }

  drawTextInCustomColor(text, color) {
    let size = this.tileSize;
    let buffer = document.createElement("canvas"),
      bufferCtx = buffer.getContext("2d");
    bufferCtx.fillStyle = color;
    for (let i = 0; i < text.length; i++) {
      bufferCtx.drawImage(this.images.letters[text.charAt(i)], i * size, 0);
    }
    bufferCtx.globalCompositeOperation = "source-in";
    bufferCtx.fillRect(0, 0, text.length * size, size);
    return buffer;
  }

  drawDots(ctx) {
    for (let row = 0; row < this.maze.length; row++) {
      for (let col = 0; col < this.maze[0].length; col++) {
        let tile = this.tiles[row][col],
          size = this.tileSize;
        if (tile.dot == 1 && !tile.eaten) {
          ctx.drawImage(this.images.food.small, col * size - (size / 2), row * size - (size / 2));
        }
        if (tile.dot == 2 && !tile.eaten && Math.floor(this.timer / 1000 * 6) % 2 == 0) {
          ctx.drawImage(this.images.food.large, col * size - (size / 2), row * size - (size / 2));
        }
      }
    }
  }

  extraLife() {
    
  }

  addCredits() {
    this.credits++;
    console.log("Credits: " + this.credits);
  }

}