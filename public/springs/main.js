let test, tilt = "";
document.addEventListener("DOMContentLoaded", function () {
    let canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        springPoint = { x: width / 2, y: height / 2 },
        weight = new Particle(Math.random() * width, Math.random() * height, 50, Math.random() * Math.PI * 2, 0),
        k = 0.2,
        springLength = 50;

    viewport = document.querySelector("#viewport");
    viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;
    test = document.querySelector("#test");

    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', deviceMove);
    }

    weight.radius = 20;
    weight.friction = 0.95;

    window.addEventListener("mousemove", mousemove);

    function mousemove(event) {
        springPoint.x = event.clientX;
        springPoint.y = event.clientY;
    }

    function deviceMove(event) {
        console.log(event);
        // Playing with the mobile accelerometer and gyro. More info here:
        // https://www.audero.it/demo/device-orientation-api-demo.html
        // https://www.html5rocks.com/en/tutorials/device/orientation/
        // springPoint.x -= event.accelerationIncludingGravity.x * .4;
        // springPoint.y += event.accelerationIncludingGravity.y * .4;
        weight.vx += -event.accelerationIncludingGravity.x * .2;
        weight.vy += event.accelerationIncludingGravity.y * .2;
        weight.vx += event.acceleration.x * .75;
        weight.vy += event.acceleration.y * .75;
        // weight.vy += event.rotationRate.beta * .01;
    }


    update();

    function update() {
        context.clearRect(0, 0, width, height);

        weight.springTo(springPoint, k, springLength);

        weight.update();

        context.strokeStyle = "red";
        context.beginPath();
        context.moveTo(weight.x, weight.y);
        context.lineTo(springPoint.x, springPoint.y);
        context.stroke();

        context.beginPath();
        context.arc(weight.x, weight.y, weight.radius, 0, Math.PI * 2, false);
        context.fill();

        context.beginPath();
        context.arc(springPoint.x, springPoint.y, 4, 0, Math.PI * 2, false);
        context.fill();


        requestAnimationFrame(update);
    }
})