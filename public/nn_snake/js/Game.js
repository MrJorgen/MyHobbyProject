import { Snake } from "./Snake.js";
import { Food } from "./Food.js";

export class Game {
  constructor(width, height, scale, index) {
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.snake = new Snake(this.width / 2, this.height / 2, this.scale);
    this.food = new Food();
    this.index = index;
  }

  start() {
    this.food.newPosition(this.width, this.height);
  }

  update() {
    this.snake.update();
    this.snake.checkCollision(this.width, this.height);
    this.snake.think(this.width, this.height, this.food);
    // Check if snake eats food
    if (this.snake.x === this.food.x && this.snake.y === this.food.y) {
      let foodPos = true;
      do {
        this.food.newPosition(this.width, this.height);
        foodPos = true;
        this.snake.tail.forEach(tail => {
          if (tail.x == this.food.x && tail.y == this.food.y) {
            foodPos = false;
          }
        });
      } while (!foodPos);
      this.snake.growing = true;
      this.snake.score++;
    }
    this.snake.age++;
  }
  run() {
    while (!this.snake.dead) {
      this.update();
    }
    // this.snake.fitness = this.snake.score * 10 + this.snake.age;
    // console.log(this.snake.age);
  }
}
