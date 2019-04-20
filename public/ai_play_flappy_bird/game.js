import { sprites } from "./sprites.js";
import { Bird } from "./bird.js";
import { sfx } from "./sfx.js";
import { getDaylightData } from "./daylight.js";
import { nextGeneration } from "./ga.js";

// Globals
const TWO_PI = Math.PI * 2, pipeOpening = 100, pipeFrequnce = 120;

let canvas, context, width, height, centerX, centerY, backGroundOffset = 0, foreGroundOffset = 0, frameCounter = 0,
  spriteSheet, randomBird, pipes = [], backGround, pipesCleared = 0, sparks = 29, sparkPos = {}, scores = { pipes: 0, score: 0, current: 0 },
  speed = 2; //bird;

// For nn & ga
let birds = [], totalBirds = 250, birdsHeaven = [], generation = 1;

// Window on load event, starts the game
window.addEventListener("load", function () {
  window.addEventListener("keydown", function (event) {
    if (event.keyCode == 32) {
      if (birds.length <= 0) {
        setup();
      }
    }
  });
  window.addEventListener("touchstart", function () {
    if (birds.length <= 0) { setup(); }
  });

  canvas = document.querySelector("#canvas"), context = canvas.getContext("2d");
  spriteSheet = document.querySelector("#spriteSheet");

  canvas.width = width = sprites.backGround.day.width;
  canvas.height = height = sprites.backGround.day.height;
  centerX = width / 2, centerY = height / 2;

  setup();
  draw();

  // This is now more a reset function
  function setup() {
    // console.clear();
    pipes = [], pipesCleared = 0, speed = 2;
    backGroundOffset = 0, foreGroundOffset = 0, frameCounter = 0;

    if (birdsHeaven.length == 0) {
      for (let i = 0; i < totalBirds; i++) {
        let randomBird = Math.floor(Math.random() * sprites.bird.length);
        let bird = new Bird(Math.round(width / 4), Math.round(centerY), randomBird);
        birds.push(bird);
      }
    }
    else {
      // This is where genetic "magic" happens
      birds = nextGeneration(totalBirds, birdsHeaven, width, centerY);
      generation++;
      birdsHeaven = [];
    }

    // backGround = getDaylightData();
    backGround = sprites.backGround.day;

    // Set background depending on time of day(needs your location to find the data)
    if (!backGround) {

      // Generic hours if something went wrong with geolocation or sunrise-sunset.org
      if (new Date().getHours() > 6 && new Date().getHours() < 18) {
        backGround = sprites.backGround.day;
      }
    }
  }

  // Main game loop
  function draw(time) {
    // No need to clear every frame since the background is constantly updated
    context.clearRect(0, 0, width, height);
    // Draw background sprites
    drawSprite(0 - backGroundOffset, 0, backGround);
    // drawSprite(0 - backGroundOffset + backGround.width, 0, backGround);

    // Update and draw pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      // Top pipe (- pipeOpening / 2 to clear for the opening)
      drawSprite(pipes[i].x, pipes[i].y - sprites.pipe.green.top.height - (pipeOpening / 2), sprites.pipe.green.top);

      // Bottom pipe (+ pipeOpening / 2 to clear for the opening)
      drawSprite(pipes[i].x, pipes[i].y + (pipeOpening / 2), sprites.pipe.green.bottom);

      // Animate pipe
      if (birds.length > 0) {
        pipes[i].x -= speed;
      }

      // If pipe is outside canvas
      if (pipes[i].x <= -sprites.pipe.green.top.width) {
        pipes.splice(i, 1);
      }

      // If bird passed through
      for (let bird of birds) {
        if (bird.x > pipes[i].x + 26 && !pipes[i].cleared) {
          pipesCleared += 1;
          pipes[i].cleared = true;
          // sfx.point.currentTime = 0;
          // sfx.point.play();
        }
      }
    }
    // New pipe at pipeFrequnce from the last one
    if (pipes.length > 0 && pipes[pipes.length - 1].x < width - sprites.pipe.green.top.width - pipeFrequnce || birds.length > 0 && pipes.length == 0) {
      pipes.push({ x: width, y: 100 + Math.round(Math.random() * (sprites.pipe.green.top.height - 100)), cleared: false });
    }

    // Draw continueous foreground sprite
    drawSprite(0 - foreGroundOffset, backGround.height - sprites.foreGround.height, sprites.foreGround);
    drawSprite(0 - foreGroundOffset + sprites.foreGround.width, backGround.height - sprites.foreGround.height, sprites.foreGround);

    // Update and draw birds
    for (let bird of birds) {
      bird.update(pipes, height);
      bird.think(pipes, width, height);
      bird.draw(context);

      // Get highest score
      scores.score = Math.max(scores.score, bird.score);
      scores.current = bird.score;
    }
    scores.pipes = Math.max(scores.pipes, pipesCleared);

    // Remove "dead" birds and add the to the "birdHeaven" array
    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].crashed) {
        birdsHeaven.push(birds.splice(i, 1)[0]);
      }
    }

    context.textAlign = "left";
    context.fillStyle = "#000";
    context.font = "14px Verdana";
    // context.textBaseline = "left";
    context.fillText("Generation: " + generation, 0, height - 69);
    context.fillText("Population: " + totalBirds, 0, height - 53);
    context.fillText("Birds alive: " + birds.length, 0, height - 37);
    context.fillText("Highest score: " + Math.max(scores.score), 0, height - 21);
    context.fillText("Most pipes cleared: " + scores.pipes, 0, height - 5);

    // Draw score to screen
    // TODO: Refactor this to do a for loop for each number of the counter
    let pipeStr = pipesCleared.toString();
    for (let i = 0; i < pipeStr.length; i++) {
      let pos = pipeStr.charAt(pipeStr.length - 1 - i);
      drawSprite(centerX - (sprites.numbersBig[0].width / 2) - ((sprites.numbersBig[0].width + 2) * i), centerY / 4, sprites.numbersBig[pos]);
    }

    // let tenth = Math.floor(pipesCleared / 10);
    // if (tenth > 0) {
    //   drawSprite(centerX - (sprites.numbersBig[0].width / 2) - sprites.numbersBig[0].width - 2, centerY / 4, sprites.numbersBig[tenth]);
    // }
    // drawSprite(centerX - (sprites.numbersBig[0].width / 2), centerY / 4, sprites.numbersBig[pipesCleared % 10]);

    /*
    // Crashed and hit the ground, display after game graphics
    // if (bird.dead) {

    // No more birds alive
    if (birds.length <= 0) {

      // Game Over
      drawSprite(centerX - sprites.gameOver.width / 2, centerY / 2, sprites.gameOver);

      // Result sign
      drawSprite(centerX - sprites.sign.width / 2, centerY - sprites.sign.height / 2, sprites.sign);

      // Score
      // New hiscore
      if (highScore()) {
        drawSprite(centerX - (sprites.sign.width / 2) + 140, centerY - (sprites.sign.height / 2) + 64, sprites.newHiscore);
      }
      // Draw score numbers
      if (tenth > 0) {
        drawSprite(centerX - (sprites.sign.width / 2) + 190 - sprites.numbersMedium[0].width, centerY - (sprites.sign.height / 2) + 40, sprites.numbersMedium[tenth]);
      }
      drawSprite(centerX - (sprites.sign.width / 2) + 192, centerY - (sprites.sign.height / 2) + 40, sprites.numbersMedium[pipesCleared % 10]);

      // Hiscore
      tenth = Math.floor(localStorage.getItem("flappy_hiscore") / 10);
      if (tenth > 0) {
        drawSprite(centerX - (sprites.sign.width / 2) + 190 - sprites.numbersMedium[0].width, centerY - (sprites.sign.height / 2) + 82, sprites.numbersMedium[tenth]);
      }
      drawSprite(centerX - (sprites.sign.width / 2) + 192, centerY - (sprites.sign.height / 2) + 82, sprites.numbersMedium[localStorage.getItem("flappy_hiscore") % 10]);

      // Play again button
      drawSprite(centerX - (sprites.play.width * 1.1), centerY + sprites.play.height, sprites.play);

      // Highscores(podium) button
      drawSprite(centerX + (sprites.highScore.width * .1), centerY + sprites.highScore.height, sprites.highScore);

      // Draw medal(if earned what type)
      let medalAwarded = null;
      if (pipesCleared >= 10 && pipesCleared < 20) {
        medalAwarded = sprites.medal.bronze;
      }
      if (pipesCleared >= 20 && pipesCleared < 30) {
        medalAwarded = sprites.medal.silver;
      }
      if (pipesCleared >= 30 && pipesCleared < 40) {
        medalAwarded = sprites.medal.gold;
      }
      if (pipesCleared >= 40) {
        medalAwarded = sprites.medal.platinum;
      }
      if (medalAwarded) {
        drawSprite(55, 239, medalAwarded);

        // Sparks
        let medalCenter = {
          x: 55 + medalAwarded.width / 2 - (sprites.spark[0].width / 2),
          y: 239 + medalAwarded.height / 2 - (sprites.spark[0].height / 2),
        };

        // Set a new position of the spark
        if (sparks == 29) {
          sparkPos = {
            angle: Math.random() * TWO_PI,
            distance: Math.round(Math.random() * (medalAwarded.width / 2)),
          }
        }
        if (sparks > 0) {
          drawSprite(medalCenter.x + (Math.cos(sparkPos.angle) * sparkPos.distance),
            medalCenter.y + (Math.sin(sparkPos.angle) * sparkPos.distance),
            sprites.spark[Math.floor(sparks / 10)]
          );
        }
        sparks--;
        if (sparks < -20) {
          sparks = 29;
        }
      }
    }
    */

    /*
    if (!bird.active && !bird.dead) {
      // Pregame graphics
      drawSprite(centerX - sprites.getReady.width / 2, centerY / 2, sprites.getReady);
      drawSprite(centerX - sprites.tapToPlay.width / 2, centerY - (sprites.tapToPlay.height / 2), sprites.tapToPlay);
    }
    */

    // ForeGround movement and loop...
    // if (bird.dead || bird.crashed) {
    if (birds.length <= 0) {
      speed = 0;
    }
    // Reset foreground
    foreGroundOffset += speed;
    if (foreGroundOffset > sprites.foreGround.width) {
      foreGroundOffset = 0;
    }

    /*
    // Blink screen when bird hits pipe
    if (bird.blink > 0) {
      context.save();
      context.fillStyle = "rgba(255, 255, 255, 0.5)";
      context.fillRect(0, 0, width, height);
      context.restore();
      bird.blink--;
    }
    */
    if (birds.length <= 0) {
      setup();
    }
    frameCounter = window.requestAnimationFrame(draw);
  }

  // What does this do... :)
  function drawSprite(x, y, sprite) {
    let clipX = sprite.x, clipY = sprite.y,
      clipWidth = sprite.width, clipHeight = sprite.height;
    context.drawImage(spriteSheet, clipX, clipY, clipWidth, clipHeight, x, y, clipWidth, clipHeight);
  }
});

// Save and retrive hiscore
function highScore() {
  if (typeof (Storage) !== "undefined") {
    if (localStorage.getItem("flappy_hiscore")) {
      if (localStorage.getItem("flappy_hiscore") <= pipesCleared) {
        // console.log("This is a new highscore!");
        localStorage.setItem("flappy_hiscore", pipesCleared);
        return true;
      }
    }
    else {
      // console.log("No highscore found!");
      localStorage.setItem("flappy_hiscore", pipesCleared);
      // console.log(localStorage.getItem("flappy_hiscore"));
      return true;
    }
  }
  return false;
}

// Fullscreen eventlisteners and handlers
document.addEventListener("click", function (e) {
  fullScreen(canvas);
});

document.addEventListener("touchend", function (e) {
  e.preventDefault();
  fullScreen(canvas);
  return false;
});

function fullScreen(element) {
  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  }
}

document.addEventListener("fullscreenchange", FShandler);
document.addEventListener("webkitfullscreenchange", FShandler);
document.addEventListener("mozfullscreenchange", FShandler);
document.addEventListener("MSFullscreenChange", FShandler);

function FShandler(e) {
  let fullscreenElement = document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  if (fullscreenElement) {
    console.log("Enter fullscreen");
    let ratio = Math.min(window.innerWidth / width, window.innerHeight / height);
    // canvas.style.width = (width * ratio) + "px";
    // canvas.style.height = (height * ratio) + "px";
    canvas.style.height = "100%";
    // alert("Canvas height: " + canvas.style.height + "\nCanvas width: " + canvas.style.width + "\nWindow height: " + window.innerHeight + "\nWindow width: " + window.innerWidth);
  }
  else {
    console.log("Exit fullscreen");
    canvas.style.width = "";
    canvas.style.height = "";
  }
};