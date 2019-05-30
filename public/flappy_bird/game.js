// Globals
const TWO_PI = Math.PI * 2;

let canvas, context, width, height, centerX, centerY, backGroundOffset = 0, foreGroundOffset = 0, frameCounter = 0,
    spriteSheet, theta = 0, randomBird, bird, pipes = [], backGround, pipesCleared = 0, sparks = 29, sparkPos = {},
    sfx = {}, speed = 2, myLocation = { lat: 0, lng: 0 };

// Window on load event, starts the game
window.addEventListener("load", function () {
    window.addEventListener("keydown", function (event) {
        if (event.keyCode == 32) {
            if (bird.dead) { setup(); }
        }
    });
    window.addEventListener("touchstart", function () {
        if (bird.dead) { setup(); }
    });

    canvas = document.querySelector("#canvas"), context = canvas.getContext("2d");
    spriteSheet = document.querySelector("#spriteSheet");
    sfx = {
        die: document.querySelector("#die"),
        hit: document.querySelector("#hit"),
        point: document.querySelector("#point"),
        swooshing: document.querySelector("#swooshing"),
        wing: document.querySelector("#wing"),
    };

    canvas.width = width = sprites.backGround.day.width;
    canvas.height = height = sprites.backGround.day.height;
    centerX = width / 2, centerY = height / 2;

    setup();
    draw();

    // This is now more a reset function
    function setup() {
        console.clear();
        pipes = [], pipesCleared = 0, speed = 2;
        backGroundOffset = 0, foreGroundOffset = 0, frameCounter = 0, theta = 0;
        randomBird = Math.floor(Math.random() * sprites.bird.length);
        bird = new Bird(Math.round(width / 4), Math.round(centerY), randomBird);
        backGround = sprites.backGround.night;

        // Set background depending on time of day(needs your location to find the data)
        if (!getDaylightData()) {

            // Generic hours if something went wrong with geolocation or sunrise-sunset.org
            if (new Date().getHours() > 6 && new Date().getHours() < 18) {
                backGround = sprites.backGround.day;
            }
        }
    }

    function getDaylightData() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                myLocation = { lat: position.coords.latitude, lng: position.coords.longitude }
                let xhr = new XMLHttpRequest(),
                    url = "https://api.sunrise-sunset.org/json?formatted=0" +
                        "&lat=" + myLocation.lat +
                        "&lng=" + myLocation.lng;

                xhr.open("GET", url, true);

                xhr.onload = function () {
                    let response = JSON.parse(this.responseText);
                    if (response.status == "OK") {
                        let now = new Date();
                        let dayBegin = new Date(response.results.nautical_twilight_begin);
                        let dayEnd = new Date(response.results.nautical_twilight_end);
                        dayBegin.setMinutes(dayBegin.getMinutes() + dayBegin.getTimezoneOffset());
                        dayEnd.setMinutes(dayEnd.getMinutes() + dayEnd.getTimezoneOffset());

                        // Some debugging....
                        console.log("Result begin:", response.results.nautical_twilight_begin);
                        console.log("Result end:", response.results.nautical_twilight_end);
                        console.log("Now:", now);
                        console.log("Begin:", dayBegin);
                        console.log("End:", dayEnd);

                        if (now > dayBegin && now < dayEnd) {
                            console.log("Daytime");
                            backGround = sprites.backGround.day;
                        }
                        else {
                            console.log("Nightime");
                            backGround = sprites.backGround.night;
                        }
                        // Tell caller everything went ok
                        return true;
                    }
                    else {
                        // Couldn't get proper data from sunrise-sunset.org
                        return false;
                    }
                }

                xhr.onerror = function () {
                    // Something went wrong with the AJAX connection
                    return false;
                }

                xhr.send();
            });
        }
        else {
            // No geolocation data
            return false;
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
            // Top pipe (-50 to clear for the opening)
            drawSprite(pipes[i].x, pipes[i].y - sprites.pipe.green.top.height - 50, sprites.pipe.green.top);
            // Bottom pipe(+50 to clear for the opening)
            drawSprite(pipes[i].x, pipes[i].y + 50, sprites.pipe.green.bottom);
            // Animate pipe
            if (!bird.dead || !bird.crashed) {
                pipes[i].x -= speed;
            }

            // If pipe is outside canvas
            if (pipes[i].x <= -sprites.pipe.green.top.width) {
                pipes.splice(i, 1);
            }

            // If bird passed through
            if (bird.x > pipes[i].x + 26 && !pipes[i].cleared) {
                pipesCleared += 1;
                pipes[i].cleared = true;
                sfx.point.currentTime = 0;
                sfx.point.play();
            }
        }
        // New pipe at 120px from the last one
        if (pipes.length > 0 && pipes[pipes.length - 1].x < width - sprites.pipe.green.top.width - 120 || bird.active && pipes.length == 0) {
            pipes.push({ x: width, y: 100 + Math.round(Math.random() * (sprites.pipe.green.top.height - 100)), cleared: false });
        }

        // Draw continueous foreground sprite
        drawSprite(0 - foreGroundOffset, backGround.height - sprites.foreGround.height, sprites.foreGround);
        drawSprite(0 - foreGroundOffset + sprites.foreGround.width, backGround.height - sprites.foreGround.height, sprites.foreGround);

        // Update and draw bird
        bird.update(pipes);
        bird.draw(context);

        // Draw score to screen
        let tenth = Math.floor(pipesCleared / 10);
        if (tenth > 0) {
            drawSprite(centerX - (sprites.numbersBig[0].width / 2) - sprites.numbersBig[0].width - 2, centerY / 4, sprites.numbersBig[tenth]);
        }
        drawSprite(centerX - (sprites.numbersBig[0].width / 2), centerY / 4, sprites.numbersBig[pipesCleared % 10]);

        // Crashed and hit the ground, display after game graphics
        if (bird.dead) {

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

        if (!bird.active && !bird.dead) {
            // Pregame graphics
            drawSprite(centerX - sprites.getReady.width / 2, centerY / 2, sprites.getReady);
            drawSprite(centerX - sprites.tapToPlay.width / 2, centerY - (sprites.tapToPlay.height / 2), sprites.tapToPlay);
        }

        // ForeGround movement and loop...
        if (bird.dead || bird.crashed) {
            speed = 0;
        }
        // Reset foreground
        foreGroundOffset += speed;
        if (foreGroundOffset > sprites.foreGround.width) {
            foreGroundOffset = 0;
        }

        // Blink screen when bird hits pipe
        if (bird.blink > 0) {
            context.save();
            context.fillStyle = "rgba(255, 255, 255, 0.5)";
            context.fillRect(0, 0, width, height);
            context.restore();
            bird.blink--;
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