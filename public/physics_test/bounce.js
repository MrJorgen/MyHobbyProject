document.addEventListener("DOMContentLoaded", setup);
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const height = window.innerHeight;
const width = window.innerWidth;

let balls = [], numBalls = 10;

let billiardColors = ["white", "yellow", "blue", "red", "purple", "orange", "green", "maroon", "black"];
numBalls = billiardColors.length;

class Ball extends Particle {
    constructor(x, y, speed, direction, gravity) {
        super(x, y, speed, direction, gravity);
        //this.color = randomColor();
        //this.color = randomBaseColor();
        this.radius = randomNumber(50, 100);
        this.friction = 0.995;
    }
    edges() {
        if (this.x + this.radius > width) { // right wall
            this.vx = -this.vx;
            this.x -= this.x + this.radius - width;
        }
        if (this.x - this.radius < 0) { // left wall
            this.vx = -this.vx;
            this.x -= this.x - this.radius;
        }
        if (this.y + this.radius > height) { // bottom
            this.vy = -this.vy;
            this.y -= this.y + this.radius - height;
        }
        if (this.y - this.radius < 0) { // left wall
            this.vy = -this.vy;
            this.y -= this.y - this.radius;
        }
    }
    draw() {
        context.save();
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
        let grd = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        //grd.addColorStop(0, this.color);
        grd.addColorStop(0, "rgba(255, 255, 255, 0.3");
        grd.addColorStop(1, "rgba(0, 0, 0, 0.7");
        context.fillStyle = grd;
        context.strokeStyle = "#000";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
        context.stroke();
        context.beginPath();
        context.fillStyle = "rgba(255, 255, 255, 0.8";
        context.arc(this.x, this.y, this.radius / 3, 0, Math.PI * 2);
        context.closePath();
        context.fill();
        context.fillStyle = "black";
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.font = "bolder " + Math.floor(this.radius / 2) + "px Verdana";
        context.fillText(this.index, this.x, this.y);
        //context.shadowColor = "rgba(0, 0, 0, 0.5";
        context.restore();
    }
}

function placeBalls() {
    let radiusPlus = width / 50 + 2; //radius + 2
    for (let row = 0; row < 5; row++) {
        let startY = 300 - row * radiusPlus; // Each row starts radiusPlus further up
        let x = 500 + (row * (Math.sqrt(3) * radiusPlus));
        for (let ball = 0; ball < row + 1; ball++) {
            addObject(new PoolBall(Color.RED), x, startY + ball * (2 * radiusPlus));
            // Each ball in a row is 2*radiusPlus further down ^^

        }
    }
}

function setup() {
    canvas.width = width;
    canvas.height = height;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 50;
    context.shadowColor = "rgba(0, 0, 0, 0.5";
    for (let i = 0; i < numBalls; i++) {
        balls[i] = new Ball();
        balls[i].setSpeed(randomNumber(10, 75));
        balls[i].setHeading(randomNumber(0, 2) * Math.PI);
        balls[i].gravity = 0;
        balls[i].x = randomNumber(balls[i].radius, width - balls[i].radius);
        balls[i].y = randomNumber(balls[i].radius, height / 2);
        balls[i].mass = balls[i].radius * balls[i].radius * Math.PI;
        balls[i].color = billiardColors[i];
        // balls[i].radius = 100;
        balls[i].radius = canvas.width / 50;
        balls[i].index = i;
        console.log(balls[i].mass);
    }
    update();
}

function update() {
    context.save();
    // context.clearRect(0, 0, width, height);
    context.fillStyle = "darkgreen";
    context.fillRect(0, 0, width, height);
    context.restore();
    for (let i = 0; i < balls.length; i++) {
        balls[i].update();
        balls[i].edges();
        balls[i].draw();
        // Trying to make balls collide...
        for (let j = i + 1; j < balls.length; j++) {
            // Also move balls outside their edges
            // Tip: context.moveTo(centerX + Math.cos(angle) * radius * .95, centerY + Math.sin(angle) * radius * .95);
            let distance = (balls[i].distanceTo(balls[j]));
            if (distance < balls[i].radius + balls[j].radius && i != j) {
                // Bounce balls
                balls[i].setHeading(bounce(balls[i], balls[j]));
                balls[j].setHeading(bounce(balls[j], balls[i]));
                // And then swap speeds
                let tempSpeed = balls[i].getSpeed();
                balls[i].setSpeed(balls[j].getSpeed());
                balls[j].setSpeed(tempSpeed);
            }
        }
    }
    requestAnimationFrame(update);
}


// Vnew = -2 * (V dot N) * N + V

function bounce(obj1, obj2) {
    // Starting over... It's all messed up :(

    // First find the point of impact. That is not the same as their centers

    // let impact1 = {
    //     x: obj1.x + Math.cos(normal) * obj1.radius,
    //     y: obj1.y + Math.sin(normal) * obj1.radius,
    // };

    // This is the formula:
    // https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
    // r = d − (2 * (d ⋅ n)) * n
    // https://imgur.com/9BHM2.png
    // eller 
    // http://www.3dkingdoms.com/weekly/weekly.php?a=2
    // Vnew = -2 * (V dot N) * N + V
    // http://www.3dkingdoms.com/weekly/vectors1.gif

    let dp = obj1.x * obj2.x + obj1.y * obj2.y;
    let dx = obj1.x - obj2.x,
        dy = obj1.y - obj2.y,
        dist = Math.sqrt(dx * dx + dy * dy),
        //angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x),
        normal = obj1.angleTo(obj2),
        current = obj1.getHeading();

    //let newHeading = -2 * current + (current - normal);

    let newHeading = 2 * (dp) * normal + current;

    obj1.x += Math.cos(normal) * (dist - obj1.radius - obj2.radius);
    obj1.y += Math.sin(normal) * (dist - obj1.radius - obj2.radius);

    // obj1.setHeading(newHeading);
    return newHeading;
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