// Globals
let canvas, context, radius, width, height, centerX, centerY, clock = {},
    clockSettings;
const TWO_PI = Math.PI * 2;

class Hand {
    constructor(angle = 0, width = 0, length = 0, color = "red") {
        this.angle = angle;
        this.width = width;
        this.length = length;
        this.color = color;
    }
    draw(type = "pointy") {
        this.angle -= Math.PI * .5;
        if (type == "pointy") {
            let backPoint = {
                x: centerX - Math.cos(this.angle) * this.length * .2,
                y: centerY - Math.sin(this.angle) * this.length * .2
            }, frontPoint = {
                x: centerX + Math.cos(this.angle) * (this.length - this.width),
                y: centerY + Math.sin(this.angle) * (this.length - this.width)
            };
            context.save();
            context.fillStyle = this.color;
            context.beginPath();
            let newAngle = this.angle - Math.PI * .5;

            // Back top point
            let newX = backPoint.x + Math.cos(newAngle) * this.width * 1.8,
                newY = backPoint.y + Math.sin(newAngle) * this.width * 1.8;
            context.moveTo(newX, newY);

            // Front top point
            newX = frontPoint.x + Math.cos(newAngle) * this.width,
                newY = frontPoint.y + Math.sin(newAngle) * this.width;
            context.lineTo(newX, newY);

            // Front center point
            context.lineTo(centerX + (Math.cos(this.angle) * this.length), centerY + (Math.sin(this.angle) * this.length));

            // Front bottom point
            newX = frontPoint.x - Math.cos(newAngle) * this.width,
                newY = frontPoint.y - Math.sin(newAngle) * this.width;
            context.lineTo(newX, newY);

            // Back bottom point
            newX = backPoint.x - Math.cos(newAngle) * this.width * 1.8,
                newY = backPoint.y - Math.sin(newAngle) * this.width * 1.8;
            context.lineTo(newX, newY);

            // Back center point
            newX = backPoint.x + Math.cos(this.angle) * (this.width),
                newY = backPoint.y + Math.sin(this.angle) * (this.width);
            context.lineTo(newX, newY);


            context.closePath();

            context.fill();

            context.beginPath();
            context.arc(centerX, centerY, this.width, 0, TWO_PI);
            context.fillStyle = "silver";
            context.fill();

            // context.stroke();
            context.restore();
        }
        if (type == "sword") {
            let backPoint = {
                x: centerX - Math.cos(this.angle) * this.length * .2,
                y: centerY - Math.sin(this.angle) * this.length * .2
            }, frontPoint = {
                x: centerX + Math.cos(this.angle) * (this.length * .67),
                y: centerY + Math.sin(this.angle) * (this.length * .67)
            };
            context.save();
            context.fillStyle = this.color;
            context.beginPath();
            let newAngle = this.angle - Math.PI * .5;

            // Back top point
            let newX = backPoint.x + Math.cos(newAngle) * (this.width * 1.5),
                newY = backPoint.y + Math.sin(newAngle) * (this.width * 1.5);
            context.moveTo(newX, newY);

            // Center top point(waist)
            newX = centerX + Math.cos(newAngle) * this.width * .75,
                newY = centerY + Math.sin(newAngle) * this.width * .75;
            context.lineTo(newX, newY);

            // Front top point
            newX = frontPoint.x + Math.cos(newAngle) * this.width * 2.5,
                newY = frontPoint.y + Math.sin(newAngle) * this.width * 2.5;
            context.lineTo(newX, newY);

            // Front center point
            context.lineTo(centerX + (Math.cos(this.angle) * this.length), centerY + (Math.sin(this.angle) * this.length));

            // Front bottom point
            newX = frontPoint.x - Math.cos(newAngle) * this.width * 2.5,
                newY = frontPoint.y - Math.sin(newAngle) * this.width * 2.5;
            context.lineTo(newX, newY);

            // Center bottom point
            newX = centerX - Math.cos(newAngle) * this.width * .75,
                newY = centerY - Math.sin(newAngle) * this.width * .75;
            context.lineTo(newX, newY);

            // Back bottom point
            newX = backPoint.x - Math.cos(newAngle) * (this.width * 1.5),
                newY = backPoint.y - Math.sin(newAngle) * (this.width * 1.5);
            context.lineTo(newX, newY);

            // Back center point
            newX = backPoint.x - Math.cos(this.angle) * (this.width * .5),
                newY = backPoint.y - Math.sin(this.angle) * (this.width * .5);
            context.lineTo(newX, newY);


            context.closePath();

            context.fill();

            context.beginPath();
            context.arc(centerX, centerY, this.width, 0, TWO_PI);
            context.fillStyle = "silver";
            context.fill();

            // context.stroke();
            context.restore();

        }
    }
}

let minuteHand = new Hand(), hourHand = new Hand(), secondHand = new Hand();


window.addEventListener("load", function () {
    let viewport = document.querySelector("#viewport");
    viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;
    // console.log("window.devicePixelRatio: " + window.devicePixelRatio)
    canvas = document.querySelector("#canvas"), context = canvas.getContext("2d");

    canvas.width = width = window.innerWidth;
    canvas.height = height = window.innerHeight;

    let bgCanvas = document.createElement("canvas"), bgContext = bgCanvas.getContext("2d");
    bgCanvas.id = "bgCanvas";
    bgCanvas.width = width;
    bgCanvas.height = height;
    bgCanvas.style.zIndex = "-1";
    document.body.appendChild(bgCanvas);

    centerX = width / 2, centerY = height / 2;

    radius = Math.min(width, height) / 2 * .99;

    clockSettings = {
        showNumbers: true,
        drawSecondLines: true,
        secondsHand: {
            width: radius / 250,
            length: radius * .98,
            moveMode: "spring",
            color: "red",
            springAction: 30,
            springSpeed: 28
        },
        minutesHand: {
            width: radius / 80,
            length: radius * .85,
            // color: "rgba(25, 25, 25, 1)",
            color: "rgba(190, 190, 190, 1)",
        },
        hoursHand: {
            width: radius / 50,
            length: radius * .65,
            color: "rgba(50, 50, 50, 1)",
        },
    };
    context.shadowBlur = radius / 75;
    context.shadowOffsetX = radius / 300;
    context.shadowOffsetY = radius / 300;
    context.shadowColor = "black";

    document.fonts.ready.then(function () {
        // console.log('All fonts in use by visible text have loaded.');
        // console.log('Sarpanch loaded? ' + document.fonts.check('1em Sarpanch'));  // true
        drawFace(bgContext);
    });
    hourHand.length = clockSettings.hoursHand.length;
    hourHand.width = clockSettings.hoursHand.width;
    hourHand.color = clockSettings.hoursHand.color;
    minuteHand.length = clockSettings.minutesHand.length;
    minuteHand.width = clockSettings.minutesHand.width;
    minuteHand.color = clockSettings.minutesHand.color;
    secondHand.length = clockSettings.secondsHand.length;
    secondHand.width = clockSettings.secondsHand.width;
    secondHand.color = clockSettings.secondsHand.color;

    draw();
});

function draw() {
    context.clearRect(0, 0, width, height);

    // Get time and set to clock object
    let currentTime = new Date(), secondsAngle, minutesAngle, hoursAngle;
    clock = {
        hours: currentTime.getHours() % 12,
        minutes: currentTime.getMinutes(),
        seconds: currentTime.getSeconds(),
        fractions: currentTime.getMilliseconds()
    };

    // Calc angle of hands

    // Continious movement, "floating"
    if (clockSettings.secondsHand.moveMode == "floating") {
        secondsAngle = ((clock.seconds * 1000 + clock.fractions) / 60000) * TWO_PI;
    }

    // Simulate spring movement
    // Speed = how long it takes to settle
    // springAction = how far it moves
    else if (clockSettings.secondsHand.moveMode == "spring") {
        let speed = clockSettings.secondsHand.springSpeed, springAction = clockSettings.secondsHand.springAction;
        if (clock.fractions < (speed)) {
            secondsAngle = ((clock.seconds * 1000 + (springAction * 4)) / 60000) * TWO_PI;
        }
        else if (clock.fractions < (speed * 3)) {
            secondsAngle = ((clock.seconds * 1000 - (springAction * 2)) / 60000) * TWO_PI;
        }
        else if (clock.fractions < (speed * 6)) {
            secondsAngle = ((clock.seconds * 1000 + (springAction)) / 60000) * TWO_PI;
        }
        else {
            secondsAngle = (clock.seconds / 60) * TWO_PI;
        }
    }
    else {
        secondsAngle = (clock.seconds / 60) * TWO_PI;
    }
    minutesAngle = ((clock.minutes * 60 * 1000 + clock.seconds * 1000 + clock.fractions) / (60 * 60 * 1000)) * TWO_PI;
    hoursAngle = (((clock.hours % 12) * 60 * 60 * 1000 + clock.minutes * 60000 + clock.seconds * 1000 + clock.fractions) / (12 * 60 * 60 * 1000)) * TWO_PI;

    // Draw face and hands
    // drawHand(hoursAngle, clockSettings.hoursHand.length, clockSettings.hoursHand.width, clockSettings.hoursHand.color);
    // drawHand(minutesAngle, clockSettings.minutesHand.length, clockSettings.minutesHand.width, clockSettings.minutesHand.color);
    // drawHand(secondsAngle, clockSettings.secondsHand.length, clockSettings.secondsHand.width, clockSettings.secondsHand.color);

    hourHand.angle = hoursAngle;
    minuteHand.angle = minutesAngle;
    secondHand.angle = secondsAngle;
    hourHand.draw("pointy");
    minuteHand.draw("pointy");
    secondHand.draw("pointy");

    frameCounter = requestAnimationFrame(draw);

    // for (let key in clockSettings) {
    //     console.log(key);
    //     for (let prop in clockSettings[key]) {
    //         console.log(prop);
    //     }
    // }

}


/**
 * Draws the "background" of the clock based
 * on the settings in the clockSettings object
 *
 */

function drawFace(bgContext) {
    let grd = bgContext.createRadialGradient(centerX - radius * .15, centerY - radius * .15, radius / 4, centerX, centerY, radius);
    grd.addColorStop(0, "rgba(255, 255, 255, .2)");
    grd.addColorStop(1, "rgba(0, 0, 0, .2)");
    bgContext.shadowBlur = radius / 75;
    bgContext.shadowOffsetX = radius / 300;
    bgContext.shadowOffsetY = radius / 300;
    bgContext.shadowColor = "black";
    bgContext.save();

    let fillColor = "rgba(100, 100, 100, 1)";

    // Paint basecolor
    bgContext.beginPath();
    bgContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
    let color = {
        r: Math.round(Math.random() * 255),
        g: Math.round(Math.random() * 255),
        b: Math.round(Math.random() * 255),
    }
    // bgContext.fillStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
    let colors = ["CornflowerBlue", "DeepSkyBlue", "DodgerBlue", "LightSkyBlue", "RoyalBlue", "SteelBlue", "YellowGreen", "SandyBrown", "Salmon", "LightSeaGreen", "LightSalmon", "Khaki", "DarkSeaGreen", "Coral"];
    bgContext.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    bgContext.fill();

    // Paint gradient overlay and outer bavel
    fillColor = "rgba(230, 230, 230, 1)";
    bgContext.lineWidth = radius / 200;
    bgContext.strokeStyle = fillColor;
    bgContext.beginPath();
    bgContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
    bgContext.fillStyle = grd;
    bgContext.fill();
    bgContext.stroke();

    bgContext.lineCap = "round";
    bgContext.textAlign = "center";
    bgContext.textBaseline = "middle";
    bgContext.fillStyle = fillColor;


    let startLine, endLine, angle;
    bgContext.font = (radius / 6) + "px Sarpanch";

    for (let i = 0; i <= 60; i++) {
        bgContext.lineWidth = 1;
        angle = (i / 60 * TWO_PI) - .5 * Math.PI;

        // Display numbers
        if (i % 5 == 0 && clockSettings.showNumbers) {
            if (Math.floor(i / 5) > 0) {
                bgContext.fillText(Math.floor(i / 5), centerX + Math.cos(angle) * (radius * .82), centerY + Math.sin(angle) * (radius * .82));
            }
        }

        // Thick line at hours
        // if (i % 15 == 0 && !clockSettings.showNumbers) {
        if (i % 15 == 0) {
            bgContext.lineWidth = radius / 100;
            startLine = radius * .90 + (bgContext.lineWidth / 2),
                endLine = radius * .98 - (bgContext.lineWidth / 2);
        }

        // Medium line at quarters
        // if (i % 5 == 0 && i % 15 != 0 && !clockSettings.showNumbers) {
        if (i % 5 == 0 && i % 15 != 0) {
            bgContext.lineWidth = radius / 150;
            startLine = radius * .93 + (bgContext.lineWidth / 2),
                endLine = radius * .98 - (bgContext.lineWidth / 2);
        }

        // Thin line at seconds
        if (i % 5 != 0 && i % 15 != 0 && clockSettings.drawSecondLines) {
            bgContext.lineWidth = radius / 200;
            startLine = radius * .95 + (bgContext.lineWidth / 2),
                endLine = radius * .98 - (bgContext.lineWidth / 2);
        }

        // A neat trick to draw only if lineWidth is greater than 1
        if (bgContext.lineWidth > 1) {
            bgContext.beginPath();
            bgContext.moveTo(centerX + Math.cos(angle) * startLine, centerY + Math.sin(angle) * startLine);
            bgContext.lineTo(centerX + Math.cos(angle) * endLine, centerY + Math.sin(angle) * endLine);
            bgContext.stroke();
        }
    }
    bgContext.restore();
}

/**
 * Draw the hands of the clock
 *
 * @param  Float | angle      | A floating number representing the angle of which to draw the hand in
 * @param  Float | lenght | A floating number representing the length of the hand
 * @param  Float | width | A floating number representing the width of the hand
 * @param  Any | color | The color of the hand. Takes any css-style color value(hex, rgb(a), hsl(a) or name)
 * @return Null | Does not return a value
 */
function drawHand(angle, length, width, color) {

    angle -= Math.PI * .5;
    context.save();

    // Set draw styles
    context.fillStyle = color || "black";
    context.strokeStyle = color || "black";
    context.lineWidth = width || "3";
    context.lineCap = "round";

    // Draw hand
    context.shadowColor = "black";
    context.beginPath();
    context.moveTo(centerX - Math.cos(angle) * (length / 10), centerY - Math.sin(angle) * (length / 10));
    context.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length);
    context.stroke();

    // Draw center cap
    // context.shadowColor = "transparent";
    context.beginPath();
    context.arc(centerX, centerY, width * 2, 0, TWO_PI);
    context.fill();

    context.restore();
}