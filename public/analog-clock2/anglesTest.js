let canvas, context, radius, width, height, centerX, centerY, size = 0, lineLength;
const TWO_PI = Math.PI * 2, step = 60;
let angle = 0;

window.addEventListener("load", function () {
    let viewport = document.querySelector("#viewport");
    viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;
    canvas = document.querySelector("#canvas"), context = canvas.getContext("2d");

    canvas.width = width = window.innerWidth;
    canvas.height = height = window.innerHeight;
    centerX = width / 2, centerY = height / 2;
    size = Math.min(width, height) * .9;

    let bgCanvas = document.createElement("canvas"), bgContext = bgCanvas.getContext("2d");
    bgCanvas.id = "bgCanvas";
    bgCanvas.width = width;
    bgCanvas.height = height;
    bgCanvas.style.zIndex = "-1";
    document.body.appendChild(bgCanvas);


    rectangle = {
        w: size,
        h: size,
        x: centerX - size / 2,
        y: centerY - size / 2,
    };

    document.fonts.ready.then(function () {
        // console.log('All fonts in use by visible text have loaded.');
        // console.log('Sarpanch loaded? ' + document.fonts.check('1em Sarpanch'));  // true
        drawFace(bgContext);
    });
});

function drawFace(bgContext) {

    bgContext.save();
    bgContext.lineCap = "round";
    bgContext.lineWidth = 5;
    bgContext.font = "bold " + (width / 25) + "px Sarpanch";
    bgContext.textAlign = "center";
    bgContext.textBaseline = "middle";
    bgContext.shadowBlur = rectangle.w / 150 / 2;
    bgContext.shadowOffsetX = rectangle.w / 600 / 2;
    bgContext.shadowOffsetY = rectangle.w / 600 / 2;
    bgContext.shadowColor = "rgba(0, 0, 0, 0.75)";

    bgContext.beginPath();
    // bgContext.strokeRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
    roundRect(bgContext, rectangle.x, rectangle.y, rectangle.w, rectangle.h, width / 50, true, true, width / 400, "rgba(140, 180, 255, 1)", "black");

    for (i = 1; i <= step; i++) {
        lineLength = rectangle.w / 2 - (width / 150);
        let sideLength = step / 4;

        angle = (1.5 * Math.PI) + TWO_PI * (i / step);
        if (i % 5 == 0) {
            bgContext.lineWidth = 7;
        }
        else {
            bgContext.lineWidth = 2;
        }

        bgContext.strokeStyle = "rgba(0, 0, 0, 1)";
        bgContext.beginPath();
        if (i > sideLength * 0.5 && i < sideLength * 1.5) { // Right side
            bgContext.moveTo(centerX + lineLength, centerY + Math.sin(angle) * (lineLength * (1 / Math.cos(angle))));
            lineLength -= width / 50;
            if (i % 5 === 0) {
                bgContext.lineTo(centerX + lineLength, centerY + Math.sin(angle) * (lineLength * (1 / Math.cos(angle))));
                lineLength -= width / 40;
                bgContext.fillText(Math.floor(i / 5), centerX + lineLength, centerY + Math.sin(angle) * (lineLength * (1 / Math.cos(angle))))
            }
            else {
                lineLength += width / 150;
                bgContext.lineTo(centerX + lineLength, centerY + Math.sin(angle) * (lineLength * (1 / Math.cos(angle))));
            }
        }
        if (i > sideLength * 1.5 && i < sideLength * 2.5) { // Bottom side
            bgContext.moveTo(centerX + Math.cos(angle) * (lineLength * (1 / Math.sin(angle))), centerY + lineLength);
            lineLength -= width / 50;
            if (i % 5 == 0) {
                bgContext.lineTo(centerX + Math.cos(angle) * (lineLength * (1 / Math.sin(angle))), centerY + lineLength);
                lineLength -= width / 40;
                bgContext.fillText(Math.floor(i / 5), centerX + Math.cos(angle) * (lineLength * (1 / Math.sin(angle))), centerY + lineLength);
            }
            else {
                lineLength += width / 150;
                bgContext.lineTo(centerX + Math.cos(angle) * (lineLength * (1 / Math.sin(angle))), centerY + lineLength);
            }
        }
        if (i > sideLength * 2.5 && i < sideLength * 3.5) { // Left side
            bgContext.moveTo(centerX - lineLength, centerY + Math.sin(angle) * (lineLength * (1 / -Math.cos(angle))));
            lineLength -= width / 50;
            if (i % 5 == 0) {
                bgContext.lineTo(centerX - lineLength, centerY + Math.sin(angle) * (lineLength * (1 / -Math.cos(angle))));
                lineLength -= width / 40;
                bgContext.fillText(Math.floor(i / 5), centerX - lineLength, centerY + Math.sin(angle) * (lineLength * (1 / -Math.cos(angle))));
            }
            else {
                lineLength += width / 150;
                bgContext.lineTo(centerX - lineLength, centerY + Math.sin(angle) * (lineLength * (1 / -Math.cos(angle))));
            }
        }
        if (i > sideLength * 3.5 || i < sideLength * 0.5) { // Top side
            bgContext.moveTo(centerX + Math.cos(angle) * (lineLength * (1 / -Math.sin(angle))), centerY - lineLength);
            lineLength -= width / 50;
            if (i % 5 == 0) {
                bgContext.lineTo(centerX + Math.cos(angle) * (lineLength * (1 / -Math.sin(angle))), centerY - lineLength);
                lineLength -= width / 40;
                bgContext.fillText(Math.floor(i / 5), centerX + Math.cos(angle) * (lineLength * (1 / -Math.sin(angle))), centerY - lineLength);
            }
            else {
                lineLength += width / 150;
                bgContext.lineTo(centerX + Math.cos(angle) * (lineLength * (1 / -Math.sin(angle))), centerY - lineLength);
            }
        }
        bgContext.stroke();
    }
    bgContext.restore();
    drawTime();
}

function drawTime() {
    let currentTime = new Date(), secondsAngle, minutesAngle, hoursAngle,
        clock = {
            hours: currentTime.getHours() % 12,
            minutes: currentTime.getMinutes(),
            seconds: currentTime.getSeconds(),
            fractions: currentTime.getMilliseconds()
        };

    context.clearRect(0, 0, width, height);

    lineLength = rectangle.w / 2 - (width / 150);
    // secondsAngle = (1.5 * Math.PI) + ((clock.seconds * 1000 + clock.fractions) / 60000) * TWO_PI;
    secondsAngle = (1.5 * Math.PI) + (clock.seconds / 60) * TWO_PI;
    minutesAngle = (1.5 * Math.PI) + ((clock.minutes * 60 * 1000 + clock.seconds * 1000 + clock.fractions) / (60 * 60 * 1000)) * TWO_PI;
    hoursAngle = (1.5 * Math.PI) + (((clock.hours % 12) * 60 * 60 * 1000 + clock.minutes * 60000 + clock.seconds * 1000 + clock.fractions) / (12 * 60 * 60 * 1000)) * TWO_PI;

    context.save();
    context.lineCap = "round";
    context.shadowBlur = rectangle.w / 150 / 2;
    context.shadowOffsetX = rectangle.w / 600 / 2;
    context.shadowOffsetY = rectangle.w / 600 / 2;
    context.shadowColor = "rgba(0, 0, 0, 0.75)";

    // Draw hours hand
    lineLength -= width / 9;
    context.lineWidth = 20;
    context.strokeStyle = "black";
    context.beginPath();
    context.moveTo(centerX - Math.cos(hoursAngle) * lineLength * .1, centerY - Math.sin(hoursAngle) * lineLength * .1);
    context.lineTo(centerX + Math.cos(hoursAngle) * lineLength, centerY + Math.sin(hoursAngle) * lineLength);
    context.stroke();

    // Draw minutes hand
    lineLength += width / 20;
    context.lineWidth = 10;
    context.strokeStyle = "darkgrey";
    context.beginPath();
    context.moveTo(centerX - Math.cos(minutesAngle) * lineLength * .1, centerY - Math.sin(minutesAngle) * lineLength * .1);
    context.lineTo(centerX + Math.cos(minutesAngle) * lineLength, centerY + Math.sin(minutesAngle) * lineLength);
    context.stroke();

    // Draw seconds hand
    lineLength += width / 20;
    context.lineWidth = 3;
    context.strokeStyle = "red";
    context.beginPath();
    context.moveTo(centerX - Math.cos(secondsAngle) * lineLength * .1, centerY - Math.sin(secondsAngle) * lineLength * .1);
    context.lineTo(centerX + Math.cos(secondsAngle) * lineLength, centerY + Math.sin(secondsAngle) * lineLength);
    context.stroke();

    context.restore();
    requestAnimationFrame(drawTime);
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke, lineWidth, fillColor, strokeColor) {
    ctx.save();
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        let defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (let side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.lineWidth = lineWidth || 5;
    ctx.fillStyle = fillColor || "black";
    ctx.strokeStyle = strokeColor || "black";
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
    ctx.restore();
}