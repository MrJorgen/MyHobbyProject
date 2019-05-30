import { Snake } from "./Snake.js";
import { Food } from "./Food.js";
import { Genetics } from "./Genetics.js";
(function() {
  let canvas = document.querySelector("#snake"),
    ctx = canvas.getContext("2d"),
    width = (canvas.width = 400),
    height = (canvas.height = 400),
    scale = 20,
    snake = null,
    food = null,
    lastTime = 0,
    moveTimer = 0,
    frameCounter = null,
    score = document.querySelector("#score"),
    oldSnake,
    speed = 1000 / 60,
    generation = 1,
    bestScore = {
      score: 0,
      generation: 0
    };

  function setup() {
    let evolution = new Genetics();
    if (oldSnake) {
      if (snake.score >= bestScore.score) {
        bestScore.score = snake.score;
        bestScore.generation = generation;
        score.textContent = "Best score: " + bestScore.score + " At generation: " + bestScore.generation;
      }
      let newSnake = new Snake(width / 2, height / 2, scale);
      newSnake.brain = evolution.newSnake(oldSnake, snake);
      oldSnake = snake;
      snake = newSnake;
      
      document.querySelector("#generation").textContent = generation;
      generation++;
    }
    else {
      snake = new Snake(width / 2, height / 2, scale);
      oldSnake = new Snake(width / 2, height / 2, scale);
    }
    food = new Food();
    food.newPosition(width, height);
    document.addEventListener("keydown", handleKeys);
    frameCounter = window.requestAnimationFrame(animate);
  }

  function simulate() {}

  function animate(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    moveTimer += deltaTime;

    // Delay snake movement
    if (moveTimer >= speed) {
      snake.update();
      snake.checkCollision(width, height);
      snake.think(width, height, food);

      // Check if snake eats food
      if (snake.x === food.x && snake.y === food.y) {
        let foodPos = true;
        do {
          food.newPosition(width, height);
          foodPos = true;
          snake.tail.forEach(tail => {
            if (tail.x == food.x && tail.y == food.y) {
              foodPos = false;
            }
          });
        } while (!foodPos);
        food.show(ctx);
        snake.growing = true;
        snake.score++;
        // score.textContent = snake.score;
      }
      
      // Draw everything
      if (!snake.dead) {
        // Clear canvas
        ctx.fillStyle = "#ccc";
        ctx.strokeStyle = "#000";
        ctx.fillRect(0, 0, width, height);

        // Optional grid
        drawGrid();

        snake.age++;

        food.show(ctx);
        snake.show(ctx);

        moveTimer = 0;
      } else {
        // snake.showDeadSnake(ctx);
      }
    }

    if (!snake.dead) {
      frameCounter = window.requestAnimationFrame(animate);
    } else {
      setTimeout(setup, snake.speed);
    }
  }

  function handleKeys(e) {
    if (!e.repeat && snake.canMove) {
      switch (e.which) {
        // Left arrow
        case 37:
          if (snake.dir !== snake.directions.RIGHT) {
            snake.dir = snake.directions.LEFT;
            snake.canMove = false;
          }
          break;

        // Up arrow
        case 38:
          if (snake.dir !== snake.directions.DOWN) {
            snake.dir = snake.directions.UP;
            snake.canMove = false;
          }
          break;

        // Right arrow
        case 39:
          if (snake.dir !== snake.directions.LEFT) {
            snake.dir = snake.directions.RIGHT;
            snake.canMove = false;
          }
          break;

        // Down arrow
        case 40:
          if (snake.dir !== snake.directions.UP) {
            snake.dir = snake.directions.DOWN;
            snake.canMove = false;
          }
          break;
      }
    }
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;

    for (let col = 0; col < width; col += scale) {
      ctx.beginPath();
      ctx.moveTo(col + 0.5, 0 + 0.5);
      ctx.lineTo(col + 0.5, height + 0.5);
      ctx.stroke();
      ctx.closePath();
    }

    for (let row = 0; row < height; row += scale) {
      ctx.beginPath();
      ctx.moveTo(0.5, row + 0.5);
      ctx.lineTo(width + 0.5, row + 0.5);
      ctx.stroke();
      ctx.closePath();
    }

    ctx.restore();
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
