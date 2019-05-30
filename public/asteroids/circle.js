document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.querySelector("#canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    let centerX = width / 2,
        centerY = height / 2,
        radius = Math.min(width, height) * .48,
        xRadius = width * .48,
        yRadius = height * .48,
        angle = 0,
        speed = .01,
        numObjects = 60,
        slice = Math.PI * 2 / numObjects,
        x, y;
    let hour = 3;

    for (let i = -3; i < numObjects; i++) {
        angle = slice * i;
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
        if (i % (numObjects / 4) == 0) {
            context.lineWidth = "20";
        }
        else {
            context.lineWidth = "5";

        }

        //console.log(hour);
        context.font = "72px Verdana";
        context.textAlign = "center";
        context.textBaseline = "middle";
        let hour = i + 3;
        if (i % (numObjects / 4) == 0) {
            if (hour == 0) {
                hour = 12;
            }
            context.fillText(hour, x, y);
            //hour += 3;

        }
        else {
            context.beginPath();
            context.moveTo(centerX + Math.cos(angle) * radius * .95, centerY + Math.sin(angle) * radius * .95);
            context.lineTo(x, y);
            context.stroke();
        }

        // context.beginPath();
        // context.arc(x, y, 10, 0, Math.PI * 2, false);
        // context.fill();
    }


    function render() {
        //context.clearRect(0, 0, width, height);
        context.fillStyle = "black";

        x = centerX + Math.cos(angle) * xRadius;
        y = centerY + Math.sin(angle) * yRadius;
        // context.lineWidth = "1";
        // context.beginPath()
        // context.moveTo(centerX, centerY);
        // context.lineTo(x, y);
        // context.stroke();
        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2, false);
        context.fill();

        angle += speed;
        console.log(angle);
        requestAnimationFrame(render);
    }

}, false);
