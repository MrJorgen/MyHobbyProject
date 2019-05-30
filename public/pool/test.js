// document.addEventListener("DOMContentLoaded", setup);
const canvas = document.querySelector("#canvas"),
    context = canvas.getContext("2d"),
    height = canvas.height = window.innerHeight,
    width = canvas.width = window.innerWidth;

let ball1 = new Particle(width * .75, height * .25, 5);
let ball2 = new Particle(width / 2, height / 2);
let p2 = new Particle(width / 2, 0);
let outLine = new Particle(width / 2, height / 2);
let lineSize = 2;
setup();

function setup() {
    ball1.setHeading(ball1.angleTo(ball2));
    ball1.setSpeed(ball1.distanceTo(ball2));
    context.lineWidth = lineSize;
    draw();
}

function draw() {
    outLine.x = width / 2, outLine.y = height / 2;
    context.clearRect(0, 0, width, height);
    bounce(ball1);
    ball1.setHeading(ball1.angleTo(ball2));
    ball1.setSpeed(ball1.distanceTo(ball2));

    // Line across the screen
    context.beginPath();
    context.fillStyle = "#666";
    context.fillRect(0, height / 2, width, height);
    context.strokeRect(0, height / 2, width, height);
    // context.moveTo(0, height / 2);
    // context.lineTo(width, height / 2);
    // context.stroke();

    context.beginPath();
    context.moveTo(ball1.x, ball1.y);
    context.lineTo(ball2.x, ball2.y);
    context.stroke();

    context.beginPath();
    context.moveTo(width / 2, height / 2);
    context.lineTo(outLine.x, outLine.y);
    context.stroke();


    context.beginPath();
    context.arc(ball1.x, ball1.y, 10, 0, Math.PI * 2);
    context.stroke();
}

function bounce(obj1) {
    let V = obj1.getHeading(), N = 1 * Math.PI;
    let Diff = N - V;

    let Vnew = V + (2 * Diff);

    console.log(ball1.getHeading());
    console.log(Math.round(Vnew * 180 / Math.PI));
    drawToScreen("Incoming angle: " + (ball1.getHeading() / Math.PI).toFixed(2), 0);
    drawToScreen("Outgoing angle: " + (Vnew / Math.PI).toFixed(2), 1);
    drawToScreen("Difference: " + (Diff / Math.PI).toFixed(2), 2);
    outLine.setHeading(Vnew);
    outLine.setSpeed(obj1.getSpeed());
    outLine.update();
}

function drawToScreen(string, lineNumber) {
    let lineHeight = 20;
    context.save();
    context.fillStyle = "#000";
    context.font = lineHeight + "px Verdana";
    context.fillText(string, 100, 100 + lineNumber * lineHeight);
    context.restore();
}


function drawPoint(p) {
    context.beginPath();
    context.arc(p.x, p.y, 10, 0, Math.PI * 2);
    context.stroke();
}

canvas.addEventListener("mousedown", onMouseDown);
let dragPoint;

function onMouseDown(event) {
    dragPoint = findDragPoint(event.clientX, event.clientY);
    if (dragPoint) {
        dragPoint.x = event.clientX;
        dragPoint.y = event.clientY;
        draw();
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
}

function onMouseMove(event) {
    dragPoint.x = event.clientX;
    dragPoint.y = event.clientY;
    draw();
}

function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}

function hitTest(p, x, y) {
    var dx = p.x - x,
        dy = p.y - y;
    return Math.sqrt(dx * dx + dy * dy) <= 10;
}

function findDragPoint(x, y) {
    if (hitTest(ball1, x, y)) return ball1;
    return null;
}