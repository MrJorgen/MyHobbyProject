let canvas, context, radius, width, height, centerX, centerY, size = 0,
    angle = Math.PI * 1.5, lineLength;
const TWO_PI = Math.PI * 2;

window.addEventListener("load", function () {
    let viewport = document.querySelector("#viewport");
    viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;
    canvas = document.querySelector("#canvas"), context = canvas.getContext("2d");

    canvas.width = width = window.innerWidth;
    canvas.height = height = window.innerHeight;
    centerX = width / 2, centerY = height / 2;
    size = Math.min(width, height) * .9;

    rectangle = {
        w: size,
        h: size,
        x: centerX - size / 2,
        y: centerY - size / 2,
    };

    draw();
});

function drawFace() {

    let drawAngle = 1.5 * Math.PI;
    let hourText = new Date().getHours() % 12;
    let lineEnd = {};

    context.save();
    context.lineWidth = 3;
    context.beginPath();
    context.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
    context.stroke();
    for (let i = 1; i <= 60; i++) {

        lineLength = Math.sqrt(rectangle.w * rectangle.w + rectangle.h * rectangle.h) / 2;

        drawAngle = TWO_PI * (i / 60);

        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(centerX, centerY);

        // lineLength = 0;
        // while (lineLength > 0 || Math.abs(Math.cos(drawAngle) * lineLength) < rectangle.w / 2 || Math.abs(Math.sin(drawAngle) * lineLength) < rectangle.h / 2) {
        //     console.log(lineLength);
        //     console.log(Math.cos(drawAngle) * lineLength);
        //     console.log(Math.sin(drawAngle) * lineLength);
        //     lineLength++;
        // }

        context.lineTo(centerX + Math.cos(drawAngle) * lineLength, centerY + Math.sin(drawAngle) * lineLength);
        context.stroke();

    }
    context.restore();
}

function draw() {
    let clock = {};
    clock.seconds = new Date().getSeconds();
    clock.fractions = new Date().getMilliseconds();
    angle = ((clock.seconds * 1000 + clock.fractions) / 60000) * TWO_PI;
    angle -= Math.PI * 0.5;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "black";

    drawFace();

    context.lineWidth = 5;

    let lineLength = Math.sqrt(rectangle.w * rectangle.w + rectangle.h * rectangle.h) / 2;
    let lineEnd = {
        x: centerX + Math.cos(angle) * lineLength,
        y: centerY + Math.sin(angle) * lineLength
    };


    // keepSquare(lineEnd);
    context.beginPath();
    context.moveTo(centerX, centerY);

    context.lineTo(lineEnd.x, lineEnd.y);
    context.stroke();

    context.beginPath();
    context.arc(lineEnd.x, lineEnd.y, 10, 0, TWO_PI);
    context.fill();

    // requestAnimationFrame(draw);
}

function keepSquare(lineEnd, angle) {

    if (lineEnd.x > rectangle.x + rectangle.w) {
        // lineEnd.x = rectangle.x + rectangle.w;
        return (Math.sin(angle) / (lineEnd.x - rectangle.x + rectangle.w));
    }
    if (lineEnd.x < rectangle.x) {
        // lineEnd.x += lineEnd.x * Math.tan(rectangle.x);
        return (Math.sin(angle) / (lineEnd.x - rectangle.x));
    }
    if (lineEnd.y > rectangle.y + rectangle.h) {
        lineEnd.y = rectangle.y + rectangle.h;
    }
    if (lineEnd.y < rectangle.y) {
        lineEnd.y = rectangle.y;
    }
    return false;

}