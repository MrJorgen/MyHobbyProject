document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.querySelector("#canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    let arrowX = width / 2,
        arrowY = height / 2,
        dx, dy,
        angle = 0;
    context.fillStyle = "rgba(0, 0, 0, 1)";
    render();

    function render() {
        //context.clearRect(0, 0, width, height);
        context.fillStyle = "rgba(0, 0, 0, .07)";
        context.fillRect(0, 0, width, height);
        context.save();
        context.translate(arrowX, arrowY);
        context.rotate(angle);
        context.strokeStyle = "rgb(180, 180, 255)";
        context.fillStyle = "rgb(180, 180, 255)";
        context.lineWidth = 1;

        // Asteroids Spaceship :)
        context.beginPath();
        context.moveTo(-40, -30);
        context.lineTo(40, 0);
        context.lineTo(-40, 30);
        context.lineTo(-20, 0);
        context.closePath();
        context.stroke();
        //context.fill();

        context.restore();

        //requestAnimationFrame(render);
    }

    canvas.addEventListener("mousemove", function (event) {
        console.log(event);
        dx = event.clientX - arrowX;
        dy = event.clientY - arrowY;
        angle = Math.atan2(dy, dx);
        render();
    });

}, false);