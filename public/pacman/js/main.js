/*
look at this:
https://github.com/masonicGIT/pacman
https://www.gamasutra.com/view/feature/132330/the_pacman_dossier.php
https://gameinternals.com/understanding-pac-man-ghost-behavior
*/

import { Blinky, Pinky, Inky, Clyde } from "./Ghost.js";
import { Game } from "./Game.js";
import { Pacman } from "./Pacman.js";
import { maze } from "./maze.js";
import { resolveSprites } from "./spriteResolver.js";
import Tile from "./Tile.js";
import { startKeyTracking } from "./handleKeys.js";

let canvas = document.querySelector("#bgCanvas"),
  context = canvas.getContext("2d"),
  width = 224,
  height = 288,
  size = height / 36,
  spriteCanvas = document.querySelector("#spriteCanvas"),
  spriteContext = spriteCanvas.getContext("2d"),
  tiles = make2DArray(28, 36),
  game = new Game(spriteContext),
  scoreImages,
  pacman = new Pacman(13.5, 26),
  ghosts = {
    blinky: new Blinky(),
    pinky: new Pinky(),
    inky: new Inky(),
    clyde: new Clyde()
  };
  game.tileSize = size;
  game.tiles = tiles;
  game.maze = maze;
  game.ghosts = ghosts;
  game.pacman = pacman;
  
  let background = new Image(),
  spriteSheet = new Image();
  background.onload = () => {
    spriteSheet.onload = () => {
      fetch("./js/sprites.json")
      .then(response => response.json())
      .then((data) => {
        pacman.images = resolveSprites(spriteSheet, game.tileSize * 2, data.pacman);
        for (let ghost in ghosts) {
          ghosts[ghost].images = resolveSprites(spriteSheet, game.tileSize * 2, data[ghosts[ghost].name]);
          ghosts[ghost].images.scared = resolveSprites(spriteSheet, game.tileSize * 2, data.scared);
          ghosts[ghost].images.dead = resolveSprites(spriteSheet, game.tileSize * 2, data.dead);
        }
        game.images = {
          score: resolveSprites(spriteSheet, game.tileSize * 2, data["score"]),
          food: resolveSprites(spriteSheet, game.tileSize * 2, data["food"]),
          letters: resolveSprites(spriteSheet, game.tileSize, data["letters"])
        }
        init();
        startKeyTracking(game);
        animate();
      });
  }
  spriteSheet.src = "./img/sprites.png";
};
background.src = "./img/playfield Transparent.png";

function animate(timer = 0) {
  spriteContext.clearRect(0, 0, width, height);
  game.update(timer);
  game.draw(spriteContext, timer, scoreImages);
  requestAnimationFrame(animate);
}

function init() {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[0].length; col++) {
      let neighbors = 0;
      if (row >= 1 && col >= 1 && row < maze.length - 1 && col < maze[0].length - 1) {
        if (maze[row - 1][col] >= 0 && maze[row - 1][col] <= 2) {
          neighbors++;
        }
        if (maze[row][col - 1] >= 0 && maze[row][col - 1] <= 2) {
          neighbors++;
        }
        if (maze[row + 1][col] >= 0 && maze[row + 1][col] <= 2) {
          neighbors++;
        }
        if (maze[row][col + 1] >= 0 && maze[row][col + 1] <= 2) {
          neighbors++;
        }
      }

      let dot = (maze[row][col] > 0) ? maze[row][col] : 0;
      game.tiles[row][col] = new Tile(dot, neighbors);
    }
  }
  drawBackground();
  game.ghosts.blinky.active = true;
  game.ghosts.pinky.active = true;
  document.querySelector("#checkeredBackground").checked = game.debug.checkeredBackground;
  document.querySelector("#movePathCheckbox").checked = game.debug.ghostMovePath;
  document.querySelector("#targetCheckbox").checked = game.debug.ghostTarget;
  document.querySelector("#intersectionsCheckbox").checked = game.debug.intersections;
  document.querySelector("#ghostModeCheckbox").checked = game.debug.ghostMode;
}

document.querySelector("#creditsButton").onclick = () => { game.addCredits() };
document.querySelector("#checkeredBackground").onclick = (e) => {
  game.debug.checkeredBackground = e.target.checked;
  drawBackground();
};

document.querySelector("#movePathCheckbox").onclick = (e) => {
  game.debug.ghostMovePath = e.target.checked;
  drawBackground();
};

document.querySelector("#targetCheckbox").onclick = (e) => {
  game.debug.ghostTarget = e.target.checked;
};

document.querySelector("#intersectionsCheckbox").onclick = (e) => {
  game.debug.intersections = e.target.checked;
  drawBackground();
};

document.querySelector("#ghostModeCheckbox").onclick = (e) => {
  game.debug.ghostMode = e.target.checked;
};

function drawBackground() {
  context.save();
  if (!game.debug.checkeredBackground) {
    context.save();
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);
    context.restore();
  }
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[0].length; col++) {
      if (game.debug.checkeredBackground) {
        if (col % 2 == 0 && row % 2 == 0 || col % 2 == 1 && row % 2 == 1) {
          context.fillStyle = "#333";
          context.fillRect(col * size, row * size, size, size);
        }
        else {
          context.fillStyle = "#000";
          context.fillRect(col * size, row * size, size, size);
        }
      }
      if (game.debug.intersections) {
        if (game.maze[row][col] >= 0 && game.maze[row][col] <= 2) {
          context.fillStyle = "rgba(100, 100, 100, 1)";
          context.clearRect(col * 8, row * 8, 8, 8);
          context.fillRect(col * 8, row * 8, 8, 8);
        }
        // if (game.tiles[row][col].neighbors >= 3) {
        //   context.fillStyle = "rgba(180, 75, 75, 1)";
        //   context.clearRect(col * 8, row * 8, 8, 8);
        //   context.fillRect(col * 8, row * 8, 8, 8);
        // }
      }
    }
    context.restore();
  }
  context.drawImage(background, 0, 0);

  let highScoreString = "HIGH SCORE";
  for (let i = 0; i < highScoreString.length; i++) {
    context.drawImage(game.images.letters[highScoreString.charAt(i)], (9 + i) * 8, 0);
  }
}

function make2DArray(rows, cols) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function test() {
  let testCanvas = document.createElement("canvas"),
    testContext = testCanvas.getContext("2d");

  let step = 8;
  testCanvas.width = 224;
  testCanvas.height = 288;
  testCanvas.style.marginTop = "-288px";
  document.querySelector("#center").appendChild(testCanvas);

  // testContext.strokeStyle = "#000000ff";
  testContext.strokeStyle = "#2121fe";
  testContext.lineWidth = 1;
  testContext.translate(0.5, 0.5);

  testContext.beginPath();
  testContext.moveTo(0, 16 * step);
  testContext.lineTo(5 * step, 16 * step);
  testContext.lineTo(5 * step, 13 * step - 1);

  testContext.arcTo(0, 13 * step - 1, 0, 13 * step - 8, 5.5);
  testContext.arcTo(0, 3 * step, 4, 3 * step, 5.5);
  testContext.arcTo(28 * step - 1, 3 * step, 28 * step - 1, 3 * step + 8, 5.5);
  testContext.arcTo(28 * step - 1, 13 * step - 1, 28 * step - 8, 13 * step - 1, 5.5);

  testContext.lineTo(23 * step - 1, 13 * step - 1);
  testContext.lineTo(23 * step - 1, 16 * step);
  testContext.lineTo(28 * step - 1, 16 * step);

  testContext.stroke();
}