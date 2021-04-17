// Trying out ES6 with let, const, map, set, weakset and so on...
document.addEventListener("DOMContentLoaded", setup);
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const height = window.innerHeight;
const width = window.innerWidth;
canvas.width = width;
canvas.height = height;

const roof = true,
    drag = 0.9975,
    gravity = 1.5,
    friction = 0.90,
    bounce = 0.90,
    radiusRange = [25, 50],
    numBalls = 200;

const utils = new Utils();

let stopAnimation = false,
    frameCounter = null,
    lastFrameDrawTime = 0,
    fps = null,
    balls = [];
const center = { x: width / 2, y: height / 2 };

class Ball {
    constructor(
        index,
        radius = randomNumber(radiusRange[0], radiusRange[1]),
        x = randomNumber(radius, width - radius),
        y = roof ? randomNumber(radius, center.y) : randomNumber(-height, center.y),
        xVel = randomNumber(-50, 50),
        yVel = randomNumber(0, 20),
        // color = randomColor(),
        color = "rgb(200, 200, 10)",
    ) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = new Vector(xVel, yVel);
        this.color = color;
        this.drag = drag - (0.005 - 0.005 * (radiusRange[1] - this.radius) / (radiusRange[1] - radiusRange[0]));
        this.friction = new Vector(0.01, 0);
        this.gravity = new Vector(0, 1);
        // this.mass = utils.map(this.radius, radiusRange[0], radiusRange[1], 1, 100);
        this.mass = 1;
    }
    update() {
        // Add velocity
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Set edges of ball
        this.edges = {
            top: this.y - this.radius,
            right: this.x + this.radius,
            bottom: this.y + this.radius,
            left: this.x - this.radius
        }

        // Bounce off floor
        if (this.edges.bottom > height) {
            this.velocity.y = -this.velocity.y * bounce;
            this.y -= this.edges.bottom - height;
        }

        // Bounce off ceiling if there is one
        if (roof) {
            if (this.edges.top <= 0) {
                this.velocity.y = -this.velocity.y * bounce;
                this.y -= this.edges.top;
            }
        }

        // Bounce off right wall
        if (this.edges.right >= width) {
            this.velocity.x = -this.velocity.x * bounce;
            this.x -= this.edges.right - width;
        }

        // Bounce off left wall
        if (this.edges.left <= 0) {
            this.velocity.x = -this.velocity.x * bounce;
            this.x -= this.edges.left;
        }

        // Add gravity
        this.velocity.y += gravity;
        // this.velocity.addTo(this.gravity);

        // Set friction direction
        this.friction.setHeading(this.velocity.getHeading());

        // Ball is rolling on the ground. Add friction each frame
        if (height - this.edges.bottom < 1) {
            this.velocity.subtractFrom(this.friction);
        }
        else { // or add drag
            this.velocity.x *= this.drag;
            this.velocity.y *= this.drag;
        }

        this.draw();
    }
    draw() {
        context.save();
        context.fillStyle = this.color;
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        // context.stroke();
        context.closePath();
        context.restore();
    }
}

function setup() {
    canvas.addEventListener("mousedown", function () {
        if (event.button == 0) {
            stopAnimation = !stopAnimation;
            if (!stopAnimation) {
                animate();
            }
        }
        if (event.button == 1) {
            balls.push(new Ball(balls.length, randomNumber(radiusRange[0], radiusRange[1]), event.offsetX, event.offsetY, 0, 5));
            console.log(balls[balls.length - 1]);
        }
        if (event.button == 2) {
            console.log(balls);
        }
    });
    for (let i = 0; i < numBalls; i++) {
        balls.push(new Ball(i));
    }
    console.log(balls);
    animate();
}

function animate(timeElapsed) {
    // Average fps since start
    //fps = frameCounter / (timeElapsed / 1000);

    // Current fps
    let deltaTime = timeElapsed - lastFrameDrawTime;
    fps = 1000 / deltaTime;
    lastFrameDrawTime = timeElapsed;

    context.save();
    context.clearRect(0, 0, width, height);
    stopAnimation = true;
    for (let i = 0; i < balls.length; i++) {
        for (let j = 0; j < balls.length; j++) {
            if (balls[i] == balls[j]) continue;
            var diff_x = balls[j].x - balls[i].x;
            var diff_y = balls[j].y - balls[i].y;
            var dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
            if (dist < (balls[i].radius + balls[j].radius)) {
                resolveCollision(balls[i], balls[j]);
            }
        }
        if (!balls[i].stopped) {
            balls[i].update();
        } else {
            balls[i].draw();
        }
    }
    context.fillStyle = "rgba(0, 255, 0 , 0.8)";
    context.textAling = "left";
    context.textBaseline = "top";
    context.font = "20px Verdana";
    context.fillText("FPS: " + fps.toFixed(1), 10, 10);


    context.restore();
    frameCounter = requestAnimationFrame(animate);
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
        particle.velocity.x = vFinal1.x * bounce;
        particle.velocity.y = vFinal1.y * bounce;

        otherParticle.velocity.x = vFinal2.x * bounce;
        otherParticle.velocity.y = vFinal2.y * bounce;
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor(hasAlpha) {
    let r = randomNumber(128, 255);
    let g = randomNumber(128, 255);
    let b = randomNumber(128, 255);
    return "rgb(" + r + ", " + g + " ," + b + ")";
}