// Global variables
let canvas, ctx, width, height, frameCounter = 0, timePassed = 0,
    ball, leftPaddle, rightPaddle, ballSpeed, paddleSpeed, baseSize,
    player1 = new Player(), player2 = new Player(), scoreCanvas,
    scoreCtx, paddleMargin, debug = true;


const LOADING_STATE = -1, MENU_STATE = 0, RUNNING_STATE = 1, END_STATE = 2;
let state = LOADING_STATE;

const Levels = [
    { aiReaction: 0.2, aiError: 40 }, // 0:  ai is losing by 8
    { aiReaction: 0.3, aiError: 50 }, // 1:  ai is losing by 7
    { aiReaction: 0.4, aiError: 60 }, // 2:  ai is losing by 6
    { aiReaction: 0.5, aiError: 70 }, // 3:  ai is losing by 5
    { aiReaction: 0.6, aiError: 80 }, // 4:  ai is losing by 4
    { aiReaction: 0.7, aiError: 90 }, // 5:  ai is losing by 3
    { aiReaction: 0.8, aiError: 100 }, // 6:  ai is losing by 2
    { aiReaction: 0.9, aiError: 110 }, // 7:  ai is losing by 1
    { aiReaction: 1.0, aiError: 120 }, // 8:  tie
    { aiReaction: 1.1, aiError: 130 }, // 9:  ai is winning by 1
    { aiReaction: 1.2, aiError: 140 }, // 10: ai is winning by 2
    { aiReaction: 1.3, aiError: 150 }, // 11: ai is winning by 3
    { aiReaction: 1.4, aiError: 160 }, // 12: ai is winning by 4
    { aiReaction: 1.5, aiError: 170 }, // 13: ai is winning by 5
    { aiReaction: 1.6, aiError: 180 }, // 14: ai is winning by 6
    { aiReaction: 1.7, aiError: 190 }, // 15: ai is winning by 7
    { aiReaction: 1.8, aiError: 200 }  // 16: ai is winning by 8
];

if (debug) {
    meter = new FPSMeter(document.querySelector("#fpsmeter"), {
        maxFps: 60,
        smoothing: 10,
        theme: "transparent",
        graph: 1,
        history: 20,
        heat: 1,
    });
}

// Eventlisteners
window.addEventListener("DOMContentLoaded", setup);
window.addEventListener("keydown", keyInput);
window.addEventListener("keyup", keyInput);
window.addEventListener("touchstart", keyInput);


function setup() {
    if (state == LOADING_STATE) {
        // Setup canvas's for drawing
        canvas = document.querySelector("#myCanvas");
        ctx = canvas.getContext("2d");
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;


        scoreCanvas = document.createElement("canvas");
        scoreCanvas.width = canvas.width;
        scoreCanvas.height = canvas.height;
        scoreCtx = scoreCanvas.getContext("2d");
        document.body.appendChild(scoreCanvas);

        // Set some variables
        let maxAngle = Math.atan2(height / 2, width / 2);
        ballSpeed = Math.sqrt(width * width + height * height) / 200;


        paddleSpeed = ballSpeed * .525;
        baseSize = height / 81, paddleMargin = Math.floor(baseSize * 5);

        // Show starting scores
        drawDigit(scoreCtx, player1.score, width / 4, height / 50, baseSize * 6, baseSize * 10);
        drawDigit(scoreCtx, player2.score, width / 4 * 3, height / 50, baseSize * 6, baseSize * 10);

        // Init paddles and ball
        // Player 1 gets a free shot. (Someone has to start...)
        // tl;dr Player 2 is defending at start
        leftPaddle = new Paddle(paddleMargin, height / 2, baseSize * 1.5, baseSize * 10);
        rightPaddle = new Paddle(width - paddleMargin, height / 2, baseSize * 1.5, baseSize * 10);
        ball = new Ball(paddleMargin, height / 2, Math.floor(baseSize * .8), ballSpeed);


        if (debug) {
            console.log("Width: " + width, "Height: " + height, "Paddlespeed: " + paddleSpeed, "Ballspeed: " + ballSpeed,
                "Basesize: " + baseSize, "Paddlemargin: " + paddleMargin, "Ballradius: " + ball.radius);
        }


        // Update state and start animation loop
        state = MENU_STATE;
        frameCounter = requestAnimationFrame(animate);
    }
}

function animate(timePassed) {
    let score = 0;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);


    // Pre-game state. Choose number of players and start the game
    if (state == MENU_STATE) {

        ctx.save();
        let fontSize = Math.floor(height / 25);
        ctx.font = fontSize + "px Times New Roman";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";

        // Some instructions
        ctx.fillText("Press \"1\" to start a 1 player game", width / 2, (height / 2) - (fontSize / 2));
        ctx.fillText("Press \"2\" to start a 2 player game", width / 2, (height / 2) + (fontSize / 2));
        fontSize = Math.floor(fontSize * .65);
        ctx.font = fontSize + "px Times New Roman";
        ctx.fillText("Player 1 moves paddle with W(up) & S(down)", width / 2, (height / 2) + (fontSize * 2.5));
        ctx.fillText("Player 2 moves paddle with Up & Down arrow", width / 2, (height / 2) + (fontSize * 3.5));

        ctx.restore();
    }

    // Game is running
    if (state == RUNNING_STATE) {

        // Hide mousecursor
        scoreCanvas.style.cursor = "none";
        // Draw the "net"
        ctx.save();
        ctx.strokeStyle = "#fff";
        ctx.setLineDash([baseSize]);
        ctx.lineWidth = baseSize;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
        ctx.restore();

        if (rightPaddle.AI) {
            advancedPaddleAi(rightPaddle, ball);
        }
        if (leftPaddle.AI) {
            advancedPaddleAi(leftPaddle, ball);
        }

        // Update and draw paddles
        leftPaddle.update();
        rightPaddle.update();
        leftPaddle.draw(ctx);
        rightPaddle.draw(ctx);

        // Update ball and scores
        ball.update(player1, player2);
        ball.draw(ctx);
        scoreUpdate();
    }

    // Game over state. Stop the game and show who won
    if (state !== END_STATE) {
        if (meter) {
            meter.tick();
        }
        frameCounter = requestAnimationFrame(animate);
    }
}

// A more advanced AI. Calculates where the point of impact will be...
function advancedPaddleAi(paddle, ball, timePassed) {

    // If the ball is moving towards paddle
    let movingTowards = Math.abs(paddle.x - ball.x + ball.vx) > Math.abs(paddle.x - ball.x);
    if (movingTowards) {

        // Recalculate predicted if closer than 1/3
        let dist = Math.abs(ball.x + ball.radius - paddle.x + paddle.w);

        console.log(dist < width / 3);
        if (dist < width / 3 && !paddle.ballClose) {
            paddle.ballClose = true;
            paddle.calc = true;
        }

        // Calculate point of impact if not already done
        if (paddle.calc) {

            // Make a temporary ball for calculating path
            let predictBall = new Ball(ball.x, ball.y, ball.radius / 2, ball.speed);

            // Normalize vx and adjust vy
            let ratio = ball.vy / ball.vx;
            predictBall.vx = ball.vx / Math.abs(ball.vx);
            predictBall.vy = predictBall.vx * ratio;

            // The actual algorithm for calculating where the ball will hit
            if (predictBall.vx > 0) {
                // Ball is moving to the right paddle
                while (predictBall.x + ball.radius < paddle.x - 1) {
                    predictBall.update();
                }
            }
            else {
                // Ball is moving to the left paddle
                while (predictBall.x > paddle.x + paddle.w + 1) {
                    predictBall.update();
                }
            }

            paddle.moveTo.x = predictBall.x;
            paddle.moveTo.y = predictBall.y;
            paddle.moveTo.radius = ball.radius;
            // OK. let's implement some randomness(humans isn't perfect so neither should an AI :) )

            // The steeper the angle, the harder to hit...
            let offSet = ratio * 2;

            // This should be the random number that is farthest away from 0.5(center paddle)
            let randomHigh = Math.max(Math.random(), Math.random(), Math.random());
            let randomLow = Math.min(Math.random(), Math.random(), Math.random());
            let random = Math.random() < .5 ? randomLow : randomHigh;
            paddle.moveTo.rndY = paddle.moveTo.y - (paddle.h * offSet) + random * (paddle.h * offSet * 2);


            paddle.calc = false;
        }

        // Draw point of impact(for debugging and showoff only :) )
        if (debug) {
            ctx.save();

            ctx.lineWidth = ball.radius / 8;

            // Red box for actual hit
            ctx.strokeStyle = "rgba(255, 50, 50, 1)";
            ctx.strokeRect(paddle.moveTo.x, paddle.moveTo.y, ball.radius, ball.radius);

            // Yellow box for guessed hit
            ctx.strokeStyle = "rgba(255, 255, 50, 1)";
            ctx.strokeRect(paddle.moveTo.x, paddle.moveTo.rndY, ball.radius, ball.radius);

            ctx.restore();
        }

        // Move paddle.
        // Paddle moves to place itself so it hits near the middle(the "else if" statement)
        // Ball is above.
        if (paddle.moveTo.rndY + ball.radius < paddle.y && !paddle.moveUp) {
            paddle.moveUp = true;
        }
        else if (paddle.moveTo.rndY + (ball.radius / 2) >= paddle.y + (paddle.h / 2) && paddle.moveUp) {
            paddle.moveUp = false;
        }

        // Ball is below
        if (paddle.moveTo.rndY > paddle.y + paddle.h) {
            paddle.moveDown = true;
        }
        else if (paddle.moveTo.rndY + (ball.radius / 2) <= paddle.y + (paddle.h / 2)) {
            paddle.moveDown = false;
        }

    }

    // The paddle is settling near the center if the ball is moving away...
    else {

        /* 
        if (paddle.y + paddle.h < height / 2) {
            paddle.moveDown = true;
        }
        else if (paddle.y > height / 2) {
            paddle.moveUp = true;
        }
        else {
            paddle.moveDown = false;
            paddle.moveUp = false;
        }
         */
        paddle.moveDown = false;
        paddle.moveUp = false;
    }
}


function scoreUpdate() {
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);

    if (player1.score >= 10 || player2.score >= 10) {
        if (player1.score >= 10) {
            player1.wins = true;
        }
        else {
            player2.wins = true;
        }
        state = END_STATE;
    }

    // Player1 score
    drawDigit(scoreCtx, player1.score, width / 4, height / 50, baseSize * 6, baseSize * 10);

    // Player2 score
    drawDigit(scoreCtx, player2.score, width / 4 * 3, height / 50, baseSize * 6, baseSize * 10);
}

function drawDigit(scoreCtx, n, x, y, w, h) {
    if (n > 9) return;
    var dw = dh = baseSize * 2;

    // DIGITS: is like an old digital lcd clock.
    // Index 0 = Top horizontal line
    // Index 1 = Top left vertical line
    // Index 2 = Top right vertical line
    // Index 3 = Middle horizontal line
    // Index 4 = Bottom left vertical line
    // Index 5 = Bottom right vertical line
    // Index 6 = Bottom horizontal line
    let DIGITS = [
        [1, 1, 1, 0, 1, 1, 1], // 0
        [0, 0, 1, 0, 0, 1, 0], // 1
        [1, 0, 1, 1, 1, 0, 1], // 2
        [1, 0, 1, 1, 0, 1, 1], // 3
        [0, 1, 1, 1, 0, 1, 0], // 4
        [1, 1, 0, 1, 0, 1, 1], // 5
        [1, 1, 0, 1, 1, 1, 1], // 6
        [1, 0, 1, 0, 0, 1, 0], // 7
        [1, 1, 1, 1, 1, 1, 1], // 8
        [1, 1, 1, 1, 0, 1, 0]  // 9
    ];
    scoreCtx.fillStyle = "rgba(255, 255, 255, 1)";

    var blocks = DIGITS[n];
    if (blocks[0]) {
        scoreCtx.fillRect(x, y, w, dh);
    }
    if (blocks[1]) {
        scoreCtx.fillRect(x, y, dw, (h / 2) + 1);
    }
    if (blocks[2]) {
        scoreCtx.fillRect(x + w - dw, y, dw, (h / 2) + 1);
    }
    if (blocks[3]) {
        scoreCtx.fillRect(x, y + h / 2 - dh / 2, w, dh);
    }
    if (blocks[4]) {
        scoreCtx.fillRect(x, y + h / 2, dw, (h / 2));
    }
    if (blocks[5]) {
        scoreCtx.fillRect(x + w - dw, y + h / 2, dw, (h / 2));
    }
    if (blocks[6]) {
        scoreCtx.fillRect(x, y + h - dh, w, dh);
    }
}

function keyInput(event) {
    // Movement keys
    // 38 = ArrowUp, 40 = ArrowDown, 87 = w, 83 = s

    // Menu keys
    // 49 = 1 key, 97 = Numpad 1
    // 50 = 2 key, 98 = Numpad 2


    // console.log(event.which);

    // Debug toggle
    if (event.which === 68 && event.type == "keydown") {
        debug = !debug;
        document.querySelector("#fpsmeter").style.display = "none";
        // document.querySelector("#debuginfo").style.display = "none";
        if (debug) {
            document.querySelector("#fpsmeter").style.display = "block";
            // document.querySelector("#debuginfo").style.display = "block";
        }
    }

    if (state == MENU_STATE) {
        // 0 = Start a computer vs computer game
        if (event.which === 48 || event.which === 96 && event.type == "keyup" || event.type == "touchstart") {
            leftPaddle.AI = true;
            rightPaddle.AI = true;
            state = RUNNING_STATE;
        }

        // 1 = Start a human vs computer game
        else if (event.which === 49 || event.which === 97 && event.type == "keyup") {
            leftPaddle.AI = false;
            rightPaddle.AI = true;
            state = RUNNING_STATE;
        }

        // 2 = Start a human vs human game
        else if (event.which === 50 || event.which === 98 && event.type == "keyup") {
            leftPaddle.AI = false;
            rightPaddle.AI = false;
            state = RUNNING_STATE;
        }

        // 3 = Start a computer vs human game
        else if (event.which === 51 || event.which === 99 && event.type == "keyup") {
            leftPaddle.AI = true;
            rightPaddle.AI = false;
            state = RUNNING_STATE;
        }
    }

    if (state == RUNNING_STATE) {
        // Arrowkeys moves right paddle
        if (!rightPaddle.AI) {
            if (event.which === 38 && event.type == "keydown") {
                rightPaddle.moveUp = true;
            }
            else if (event.which === 38 && event.type == "keyup") {
                rightPaddle.moveUp = false;
            }

            if (event.which === 40 && event.type == "keydown") {
                rightPaddle.moveDown = true;
            }
            else if (event.which === 40 && event.type == "keyup") {
                rightPaddle.moveDown = false;
            }
        }

        // w & s moves left paddle
        if (!leftPaddle.AI) {
            if (event.which === 87 && event.type == "keydown") {
                leftPaddle.moveUp = true;
            }
            if (event.which === 87 && event.type == "keyup") {
                leftPaddle.moveUp = false;
            }

            if (event.which === 83 && event.type == "keydown") {
                leftPaddle.moveDown = true;
            }
            if (event.which === 83 && event.type == "keyup") {
                leftPaddle.moveDown = false;
            }
        }
    }
}
