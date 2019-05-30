const TWO_PI = Math.PI * 2;
let canvas, context, width, height, centerX, centerY, radius = 0, frameCounter = 0, theta = 0, animSpeed = .025,
    steps = 300, angle = Math.PI * 1.5, lineLength, circlePoints = [], trianglePoints = [], morphMode, stepModifier = -3;
// Step MUST be multiple of 3 for it to work!!!

window.addEventListener("load", function () {
    let viewport = document.querySelector("#viewport");
    viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;
    canvas = document.querySelector("#canvas"), context = canvas.getContext("2d");

    canvas.width = width = window.innerWidth;
    canvas.height = height = window.innerHeight;
    centerX = width / 2, centerY = height / 2;
    radius = Math.min(width, height) * .49;
    setup();
    let utils = new Utils();
    console.log(utils.random(2, 10));
});



function setup() {
    cancelAnimationFrame(frameCounter);
    circlePoints = [], trianglePoints = [];
    morphMode = document.querySelector("#morphMode").value;
    steps = 120;
    for (let i = 0; i < steps; i++) {
        let trianglePrevPoint = { x: 0, y: 0 };
        // Circle points goes here...
        angle = (i / steps) * TWO_PI - (TWO_PI * .25);
        circlePoints.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        });
        // Triangle points goes here...
        if (i % (steps / 3) === 0) {
            trianglePoints.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                active: true
            });
            if (trianglePoints.length > 1) {
                calculateBetweenPoints(trianglePoints[trianglePoints.length - 2], trianglePoints[trianglePoints.length - 1]);
            }
        }
    }
    trianglePoints.push(trianglePoints[trianglePoints.length - 1]);
    calculateBetweenPoints(trianglePoints[trianglePoints.length - 1], trianglePoints[0]);
    trianglePoints.pop();
    draw();
}

function calculateBetweenPoints(prevPoint, currentPoint) {
    trianglePoints.pop();
    // console.log(prevPoint);
    for (let i = 1; i < (steps / 3); i++) {
        let tempPoint = { x: 0, y: 0 };
        tempPoint.x = prevPoint.x + (currentPoint.x - prevPoint.x) / (steps / 3) * i;
        tempPoint.y = prevPoint.y + (currentPoint.y - prevPoint.y) / (steps / 3) * i;
        tempPoint.draw = false;
        trianglePoints.push(tempPoint);
    }
    trianglePoints.push(currentPoint);
}

function draw() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.strokeStyle = "rgba(0, 0, 0, 1)";
    context.lineWidth = 4;

    // This part is for debugging only

    // Drawing circle
    if (morphMode == "Additive") {
        circlePoints = [];
        for (let i = 0; i < steps; i++) {
            angle = (i / steps) * TWO_PI - (TWO_PI * .25);
            circlePoints.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        context.beginPath();
        for (let i = 0; i < circlePoints.length; i++) {
            if (i == 0) {
                context.moveTo(centerX + circlePoints[i].x, centerY + circlePoints[i].y);
            }
            else {
                context.lineTo(centerX + circlePoints[i].x, centerY + circlePoints[i].y);
            }
        }
        context.closePath();
        context.stroke();

        let tempSteps = (Math.sin(theta / 4) + 1) / 2 * 50 + 3;
        steps = Math.floor(tempSteps);
        console.log(steps);
    }

    /*
    // Drawing triangle
    context.beginPath();
    for (let i = 0; i < trianglePoints.length; i++) {
        if (i == 0) {
            context.moveTo(centerX + trianglePoints[i].x, centerY + trianglePoints[i].y);
        }
        else {
            context.lineTo(centerX + trianglePoints[i].x, centerY + trianglePoints[i].y);
        }
    }
    context.closePath();
    context.stroke();

    // Draw circles, for debugging
    context.fillStyle = "rgba(255, 0, 0, 0.5)";
    for (let i = 0; i < trianglePoints.length; i++) {
        context.beginPath();
        context.arc(centerX + trianglePoints[i].x, centerY + trianglePoints[i].y, 10, 0, TWO_PI);
        context.fill();
    }
    
    // Draw line where it should morph
    for (let i = 0; i < trianglePoints.length; i++) {
        context.beginPath();
        context.moveTo(centerX + trianglePoints[i].x, centerY + trianglePoints[i].y);
        context.lineTo(centerX + circlePoints[i].x, centerY + circlePoints[i].y);
        context.stroke();
    }
    */

    // Actual morph
    if (morphMode == "Straight") {
        // console.log((Math.sin(theta) + 1) / 2);
        context.beginPath();
        for (let i = 0; i < circlePoints.length; i++) {
            let diffX = (circlePoints[i].x - trianglePoints[i].x) * (Math.sin(theta) + 1) / 2,
                diffY = (circlePoints[i].y - trianglePoints[i].y) * (Math.sin(theta) + 1) / 2;

            if (i == 0) {
                context.moveTo(
                    centerX + circlePoints[i].x - diffX,
                    centerY + circlePoints[i].y - diffY
                );
            }
            else {
                context.lineTo(
                    centerX + circlePoints[i].x - diffX,
                    centerY + circlePoints[i].y - diffY
                );
            }
        }
        context.closePath();
        context.stroke();
    }

    if (morphMode == "Remove") {
        let remove = true,
            done = trianglePoints[trianglePoints.length - 1].draw;
        // if (steps > 300 || frameCounter % Math.floor(300 / steps) == 0) {
        //     remove = true;
        // }
        context.strokeStyle = "rgba(0, 0, 0, 1)";
        context.lineWidth = 4;
        context.beginPath();
        for (let i = 0; i < circlePoints.length; i++) {
            if (i == 0) {
                context.moveTo(
                    centerX + circlePoints[i].x,
                    centerY + circlePoints[i].y
                );
            }
            else {
                if (remove && trianglePoints[i].draw == done) {
                    trianglePoints[i].draw = !done;
                    remove = false;
                }
                if (trianglePoints[i].draw) {
                    context.lineTo(
                        centerX + trianglePoints[i].x,
                        centerY + trianglePoints[i].y
                    );
                }
                else {
                    context.lineTo(
                        centerX + circlePoints[i].x,
                        centerY + circlePoints[i].y
                    );
                }
            }
        }
        context.closePath();
        context.stroke();
    }


    context.restore();
    theta += animSpeed;
    frameCounter = requestAnimationFrame(draw);
}