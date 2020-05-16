export default class Tile {
  constructor(dot, neighbors) {
    this.neighbors = neighbors;
    this.eaten = false;
    this.noUpturn = false;
    this.dot = dot;
  }

  eat(game) {
    this.eaten = true;
    if (this.dot === 1) {
      game.score += 10;
      game.pacman.pauseEnd = game.timer + (1 / 60);
    }
    if (this.dot === 2) {
      game.score += 50;
      game.pacman.pauseEnd = game.timer + (3 / 60);
      for (let ghost in game.ghosts) {
        game.ghosts[ghost].scared = true;
        game.ghosts[ghost].scaredStart = game.timer;
      }
    }
  }
}