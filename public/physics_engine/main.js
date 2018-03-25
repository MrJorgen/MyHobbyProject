let canvas, context, width, height, frameCounter, ball, backgroundColor = "black",
    balls = [], numBalls = 20;

let ballProperties = {
}

const TWO_PI = Math.PI * 2;

function init() {
    canvas = document.querySelector("#myCanvas"),
        context = canvas.getContext("2d");

    width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    ballProperties = {
        minRadius: Math.round(width / 100),
        maxRadius: Math.round(width / 50),
        minSpeed: 10,
        maxSpeed: 100,
        colors: [
            "#fbb",
            "#bfb",
            "#bbf",
            "#ffb",
            "#fbf",
            "#bff"
        ],
        // gravity: Math.round(height / 750)
        gravity: 0
    }

    for (let i = 0; i < numBalls; i++) {
        ball = new Particle(0, 0, 0);
        ball.radius = ballProperties.minRadius + Math.random() * (ballProperties.maxRadius - ballProperties.minRadius);
        ball.x = ball.radius + Math.random() * (width - ball.radius * 2);
        ball.y = ball.radius + Math.random() * (height - ball.radius * 2);
        ball.velocity = {
            x: ballProperties.minSpeed - Math.random() * ballProperties.maxSpeed,
            y: ballProperties.minSpeed - Math.random() * ballProperties.maxSpeed,
        };
        ball.color = ballProperties.colors[Math.floor(Math.random() * ballProperties.colors.length)];
        ball.gravity = ballProperties.gravity;
        balls.push(ball);
    }
    frameCounter = requestAnimationFrame(animate);
}

function animate(time) {
    time = (time / 100).toFixed(3);
    frameCounter = requestAnimationFrame(animate);
    context.clearRect(0, 0, width, height);
    // context.fillStyle = backgroundColor;
    // context.fillRect(0, 0, width, height);
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            if (balls[i].distTo(balls[j]) < balls[i].radius + balls[j].radius) {
                // collision alert!!!
                console.log("Collision detected!");
                balls[i].collide(balls[j]);
            }
        }
    }

    for (ball of balls) {
        ball.update();
        ball.draw(context, "#000000", 3, "lightBlue");
    }
}