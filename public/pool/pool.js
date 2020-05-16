document.addEventListener("DOMContentLoaded", setup);
const canvas = document.querySelector("#canvas"),
    context = canvas.getContext("2d"),
    height = canvas.height = window.innerHeight,
    width = canvas.width = window.innerWidth;

let tableArea = {
    x: width * (232 / 3840),
    y: height * (237 / 2160),
    w: width - width * (448 / 3840),
    h: height - height * (456 / 2160)
}

let bgCanvas = document.querySelector("#bg_canvas"),
    bgContext = bgCanvas.getContext("2d"), radius = width / 60,
    balls = [], numBalls = 10, wallSize = (radius) * 1.5, lastFrameDrawTime = 0, frameCounter = 0,
    pockets = [{ x: wallSize, y: wallSize }, { x: width - wallSize, y: wallSize }, { x: width - wallSize, y: height - wallSize }, { x: wallSize, y: height - wallSize }],
    billiardColors = ["yellow", "blue", "red", "purple", "orange", "green", "maroon", "black"],
    mouseParticle = new Particle(), mousePressed = false, mouse = { x: 0, y: 0, pressed: false };
mouseParticle.prev = { x: 0, y: 0 };

bgCanvas.width = width;
bgCanvas.height = height;
numBalls = billiardColors.length;

function placeBalls() {
    let radiusPlus = radius + 2; //radius + 2
    let ball = new PoolBall(width / 5, height / 2);
    ball.index = 0;
    ball.radius = radius;
    ball.color = "white";
    balls.push(ball);
    for (let row = 0; row < 5; row++) {
        let startY = (height / 2) - row * radiusPlus; // Each row starts radiusPlus further up
        let startX = (width / 3 * 2) + (row * (Math.sqrt(3) * radiusPlus));
        for (let i = 0; i < row + 1; i++) {
            let ball = new PoolBall(startX, startY + i * (2 * radiusPlus));
            ball.radius = radius;
            ball.index = balls.length;
            ball.color = billiardColors[(ball.index - 1) % 8];
            ball.bounced = false;
            balls.push(ball);
        }
    }
}

function setup() {
    document.querySelector("#table").style.width = width + "px";
    document.querySelector("#table").style.height = height + "px";
    drawTable();
    placeBalls();
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 50;
    context.shadowColor = "rgba(0, 0, 0, 0.5";

    update();
}

function update(timeElapsed) {
    let deltaTime = timeElapsed - lastFrameDrawTime;

    // Average fps since start
    // fps = frameCounter / (timeElapsed / 1000);
    // Current fps
    fps = 1000 / deltaTime;
    lastFrameDrawTime = timeElapsed;

    context.save();
    context.clearRect(0, 0, width, height);
    context.restore();

    for (let i = balls.length - 1; i >= 0; i--) {
        balls[i].update();
        // balls[i].edges(width, height, wallSize);
        balls[i].edges(tableArea.x + tableArea.w, tableArea.y + tableArea.h, 0, tableArea);
        balls[i].draw(context);
        if (balls[i].velocity.getSpeed() < 0.05) {
            balls[i].velocity.setSpeed(0);
        }
        // Trying to make balls collide...
        for (let j = i - 1; j >= 0; j--) {
            let distance = (balls[i].distanceTo(balls[j]));
            if (distance < balls[i].radius + balls[j].radius && i != j) {
                // Bounce balls
                bounce(balls[i], balls[j]);
                // resolveCollision(balls[i], balls[j]);
            }
        }
        for (k = 0; k < pockets.length; k++) {
            let pocketDist = balls[i].distanceTo(pockets[k]);
            if (pocketDist <= wallSize) {
                if (balls[i].index == 0) {
                    setTimeout(function () {
                        let ball = new PoolBall(width / 5, height / 2);
                        ball.index = 0;
                        ball.radius = radius;
                        ball.color = "white";
                        balls.unshift(ball);
                    }, 1000);
                }
                balls.splice(i, 1);
                break;
            }
        }
        if (balls[0].velocity.getSpeed() <= 0) {
            context.save();
            context.shadowColor = "transparent";
            context.beginPath();
            context.moveTo(balls[0].x, balls[0].y);
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
            context.restore();
        }
    }

    context.save();
    context.strokeStyle = "black";
    context.lineWidth = "1";
    context.fillStyle = "rgba(0, 255, 0 , 0.8)";
    context.textAling = "left";
    context.textBaseline = "top";
    context.font = radius + "px Verdana";
    context.fillText("FPS: " + fps.toFixed(1), 10, 10);
    // context.strokeText("FPS: " + fps.toFixed(1), 10, 10);
    context.restore();

    frameCounter = requestAnimationFrame(update);
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}


// Vnew = -2 * (V dot N) * N + V

function bounce(obj1, obj2) {
    // This is the formula:
    // https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
    // r = d − (2 * (d ⋅ n)) * n
    // https://imgur.com/9BHM2.png
    // or 
    // http://www.3dkingdoms.com/weekly/weekly.php?a=2
    // Vnew = -2 * (V dot N) * N + V
    // http://www.3dkingdoms.com/weekly/vectors1.gif

    // https://sinepost.wordpress.com/2012/07/31/pooled-knowledge/

    let step = 1 / (obj1.radius + obj2.radius);
    if (obj1.velocity.getSpeed() > 0 || obj2.velocity.getSpeed() > 0) {
        while (obj1.distanceTo(obj2) < obj1.radius + obj2.radius) {
            // This is where the backtrack happens..
            obj1.x += -obj1.velocity.x * step;
            obj1.y += -obj1.velocity.y * step;
            obj2.x += -obj2.velocity.x * step;
            obj2.y += -obj2.velocity.y * step;
        }
    }

    function distAlong(x, y, xAlong, yAlong) {
        return (x * xAlong + y * yAlong) / Math.hypot(xAlong, yAlong);

    }

    let distX = obj2.x - obj1.x;
    let distY = obj2.y - obj1.y;
    let dist = Math.sqrt(distX * distX + distY * distY);

    distX = distX / dist;
    distY = distY / dist;

    let towardsMe = distAlong(obj2.velocity.x, obj2.velocity.y, distX, distY);
    let towardsThem = distAlong(obj1.velocity.x, obj1.velocity.y, distX, distY);

    let myOrtho = distAlong(obj1.velocity.x, obj1.velocity.y, distY, -distX);
    let theirOrtho = distAlong(obj2.velocity.x, obj2.velocity.y, distY, -distX);

    obj1.velocity.x = towardsMe * distX + myOrtho * distY;
    obj1.velocity.y = towardsMe * distY + myOrtho * -distX;
    obj2.velocity.x = towardsThem * distX + theirOrtho * distY;
    obj2.velocity.y = towardsThem * distY + theirOrtho * -distX;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
    let r = randomNumber(128, 255);
    let g = randomNumber(128, 255);
    let b = randomNumber(128, 255);
    return "rgb(" + r + ", " + g + " ," + b + ")";
}

function randomBaseColor() {
    let colors = [{
        name: "red",
        r: 255,
        g: 0,
        b: 0
    }, {
        name: "green",
        r: 0,
        g: 255,
        b: 0
    }, {
        name: "blue",
        r: 0,
        g: 0,
        b: 255
    }, {
        name: "yellow",
        r: 255,
        g: 255,
        b: 0
    }, {
        name: "magenta",
        r: 255,
        g: 0,
        b: 255
    }, {
        name: "cyan",
        r: 0,
        g: 255,
        b: 255
    }];
    let currentColor = colors[randomNumber(0, colors.length)];
    return "rgb(" + currentColor.r + ", " + currentColor.g + ", " + currentColor.b + ")";
}


function drawTable() {
    bgContext.lineWidth = "3";
    let pocketRadius = tableArea.h / 10,
        pocketDist = 4 / 6;

    console.log(pockets);
    console.log(tableArea);

    // Top left
    bgContext.beginPath();
    bgContext.arc(tableArea.x * pocketDist, tableArea.y * pocketDist, pocketRadius, 0, 2 * Math.PI);
    bgContext.stroke();

    // Top right
    bgContext.beginPath();
    bgContext.arc(tableArea.x + tableArea.w + (tableArea.x * pocketDist), tableArea.y * pocketDist, pocketRadius, 0, 2 * Math.PI);
    bgContext.stroke();

    // Bottom left
    bgContext.beginPath();
    bgContext.arc(tableArea.x * pocketDist, tableArea.y + tableArea.h + (tableArea.y * pocketDist), pocketRadius, 0, 2 * Math.PI);
    bgContext.stroke();

    // Bottom right
    bgContext.beginPath();
    bgContext.arc(tableArea.x + tableArea.w + (tableArea.x * pocketDist), tableArea.y + tableArea.h + (tableArea.y * pocketDist), pocketRadius, 0, 2 * Math.PI);
    bgContext.stroke();

    // bgContext.strokeRect(232, 237, width - 448, height - 456);
    bgContext.strokeRect(tableArea.x, tableArea.y, tableArea.w, tableArea.h);
    // bgContext.beginPath();
    // bgContext.moveTo((width - 448) / 2 + 232, 237);
    // bgContext.lineTo((width - 448) / 2 + 232, 237 + height - 456);
    // bgContext.stroke();
    // let poolTable = new Image(width, height);
    // poolTable.src = "pool_table_new.png";
    // poolTable.width = width;
    // poolTable.height = height;
    // bgContext.drawImage(poolTable, 0, 0, width, height);
}

function drawTable_old() {
    // Cousins and pockets
    bgContext.save();

    bgContext.fillStyle = "rgba(50, 50, 150, 1)";
    bgContext.fillRect(0, 0, width, height);

    bgContext.lineWidth = "1";
    bgContext.strokeStyle = "black";
    bgContext.fillStyle = "darkgreen";

    bgContext.beginPath();
    // Top left pocket
    bgContext.arc(wallSize, wallSize, wallSize, 0.75 * Math.PI, 1.75 * Math.PI);
    bgContext.lineTo(wallSize + wallSize * (Math.PI / 2), wallSize);

    // Top middle pocket
    bgContext.lineTo((width / 2) - (wallSize * (Math.PI / 2)), wallSize);
    bgContext.arc(width / 2, 0, wallSize, 1 * Math.PI, 2 * Math.PI);
    bgContext.lineTo((width / 2) + (wallSize * (Math.PI / 2)), wallSize);
    bgContext.lineTo(width - (wallSize + wallSize * (Math.PI / 2)), wallSize);

    // Top right pocket
    bgContext.arc(width - wallSize, wallSize, wallSize, 1.25 * Math.PI, .25 * Math.PI);
    bgContext.lineTo(width - wallSize, wallSize + wallSize * (Math.PI / 2));

    // Bottom right pocket
    bgContext.lineTo(width - wallSize, height - (wallSize + wallSize * (Math.PI / 2)));
    bgContext.arc(width - wallSize, height - wallSize, wallSize, 1.75 * Math.PI, 0.75 * Math.PI);

    // Bottom middle pocket
    bgContext.lineTo(width - (wallSize + wallSize * (Math.PI / 2)), height - wallSize);
    bgContext.lineTo((width / 2) + (wallSize * (Math.PI / 2)), height - wallSize);
    bgContext.arc(width / 2, height, wallSize, 2 * Math.PI, 1 * Math.PI);
    bgContext.lineTo((width / 2) - (wallSize * (Math.PI / 2)), height - wallSize);


    // Bottom left pocket
    bgContext.lineTo(wallSize + wallSize * (Math.PI / 2), height - wallSize);
    bgContext.arc(wallSize, height - wallSize, wallSize, 0.25 * Math.PI, 1.25 * Math.PI);

    bgContext.lineTo(wallSize, height - (wallSize + (wallSize * Math.PI / 2)));
    bgContext.lineTo(wallSize, wallSize + (wallSize * Math.PI / 2));
    bgContext.closePath();
    bgContext.stroke();
    bgContext.fill();

    // Pocket dark areas(holes)
    // Top left
    bgContext.beginPath();
    bgContext.fillStyle = "rgba(0, 0, 0, 0.5)";
    bgContext.arc(width - wallSize, wallSize, wallSize, 0, 2 * Math.PI);
    bgContext.fill();
    // Top middle
    bgContext.beginPath();
    bgContext.fillStyle = "rgba(0, 0, 0, 0.5)";
    bgContext.arc(width / 2, 0, wallSize, 0, 2 * Math.PI);
    bgContext.fill();
    // Top right
    bgContext.beginPath();
    bgContext.fillStyle = "rgba(0, 0, 0, 0.5)";
    bgContext.arc(wallSize, wallSize, wallSize, 0, 2 * Math.PI);
    bgContext.fill();
    // Bottom right
    bgContext.beginPath();
    bgContext.fillStyle = "rgba(0, 0, 0, 0.5)";
    bgContext.arc(width - wallSize, height - wallSize, wallSize, 0, 2 * Math.PI);
    bgContext.fill();
    // Bottom middle
    bgContext.beginPath();
    bgContext.fillStyle = "rgba(0, 0, 0, 0.5)";
    bgContext.arc(width / 2, height, wallSize, 0, 2 * Math.PI);
    bgContext.fill();
    // Bottom left
    bgContext.beginPath();
    bgContext.fillStyle = "rgba(0, 0, 0, 0.5)";
    bgContext.arc(wallSize, height - wallSize, wallSize, 0, 2 * Math.PI);
    bgContext.fill();
    //White dot
    bgContext.beginPath();
    bgContext.fillStyle = "rgba(255, 255, 255, .5)";
    bgContext.arc(width * .2, height * .5, width / 300, 0, 2 * Math.PI);
    bgContext.fill();

    bgContext.restore();
}

document.addEventListener("mousedown", function (e) {
    e.preventDefault();
    mouse.pressed = true;
    mouseDrag(e);
});

document.addEventListener("mouseup", function (e) {
    mouse.pressed = false;
    mouseDrag(e);
});

document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX, mouse.y = e.clientY;
    mouseDrag(e);
});

function mouseDrag(e) {
    if (mouse.pressed) {
        let ball = balls[0];
        if (ball.index == 0) {
            let vx = e.clientX - ball.x;
            let vy = e.clientY - ball.y;
            ball.velocity.x = vx / 10;
            ball.velocity.y = vy / 10;
            if (ball.velocity.getSpeed() > ball.radius * 2) {
                ball.velocity.setSpeed(ball.radius * 2);
            }
        }
    }
}