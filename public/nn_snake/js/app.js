import { Game } from "./Game.js";

(function() {
  let scale = 20,
    width = 20,
    height = 20,
    score = document.querySelector("#score"),
    canvas = document.querySelector("#snake"),
    ctx = canvas.getContext("2d"),
    popSize = 250,
    games = [];

  function setup() {
    canvas.width = width * scale;
    canvas.height = height * scale;
    draw();

    for (let i = 0; i < popSize; i++) {
      games[i] = new Game(width * scale, height * scale, scale, i);
    }

    for (let game of games) {
      game.start();
      game.run();
    }

    games.forEach(game => {
      game.snake.fitness = game.snake.age + game.snake.score * 10;
    });

    games.sort((a, b) => b.snake.fitness - a.snake.fitness);

    score.textContent = "Score: " + games[0].snake.fitness + " Index: " + games[0].index;
    console.log("Age: " + games[0].snake.age);
    console.log("Score: " + games[0].snake.score);
    console.log("Fitness: " + games[0].snake.fitness);
    console.log("Index: " + games[0].index);
    console.log("Done!");
  }

  function draw() {
    drawGrid(height, width, scale);
  }

  function keyHandler(e) {
    if (!e.repeat && game.snake.canMove) {
      switch (e.which) {
        // Left arrow
        case 37:
          if (game.snake.dir !== game.snake.directions.RIGHT) {
            game.snake.dir = game.snake.directions.LEFT;
            game.snake.canMove = false;
          }
          break;

        // Up arrow
        case 38:
          if (game.snake.dir !== game.snake.directions.DOWN) {
            game.snake.dir = game.snake.directions.UP;
            game.snake.canMove = false;
          }
          break;

        // Right arrow
        case 39:
          if (game.snake.dir !== game.snake.directions.LEFT) {
            game.snake.dir = game.snake.directions.RIGHT;
            game.snake.canMove = false;
          }
          break;

        // Down arrow
        case 40:
          if (game.snake.dir !== game.snake.directions.UP) {
            game.snake.dir = game.snake.directions.DOWN;
            game.snake.canMove = false;
          }
          break;
      }
    }
  }

  function drawGrid() {
    let fullWidth = width * scale, fullHeight = height * scale;
    ctx.save();
    ctx.fillStyle = "#ccc";
    ctx.strokeStyle = "#000";
    ctx.fillRect(0, 0, fullWidth, fullHeight);

    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;

    for (let col = 0; col < fullWidth; col += scale) {
      ctx.beginPath();
      ctx.moveTo(col + 0.5, 0 + 0.5);
      ctx.lineTo(col + 0.5, fullHeight + 0.5);
      ctx.stroke();
      ctx.closePath();
    }

    for (let row = 0; row < fullHeight; row += scale) {
      ctx.beginPath();
      ctx.moveTo(0.5, row + 0.5);
      ctx.lineTo(fullWidth + 0.5, row + 0.5);
      ctx.stroke();
      ctx.closePath();
    }

    ctx.restore();
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
