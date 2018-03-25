let drawObject = null, ship = null, mouseX = 0, mouseY = 0;
window.addEventListener("DOMContentLoaded", function () {
    let canvas = document.querySelector("#canvas"),
        context = canvas.getContext("2d"),
        shapeIndex = 0;
    canvas.width = window.innerWidth, canvas.height = window.innerHeight;

    let game = {};
    game.scale = canvas.height / 2160;
    const baseColor = "rgb(200, 200, 255)",
        width = canvas.width,
        height = canvas.height;

    drawObject = new Particle(width / 2, height / 2);
    // drawObject.shape = shapes.saucer;
    drawObject.shape = shapes.asteroids[shapeIndex];
    drawObject.scale = drawObject.shape.scale * 5;
    drawObject.angle = 0;

    ship = new Particle(width / 2, height / 2);
    ship.shape = shapes.ship.body;
    ship.scale = shapes.ship.body.scale * 10;
    update();

    function update() {
        context.clearRect(0, 0, width, height);
        ship.x = mouseX, ship.y = mouseY;
        let drawColor = baseColor, shipColor = baseColor;
        let len = Math.max(ship.shape.points.length, drawObject.shape.points.length);
        for (let i = 0; i < len; i++) {
            let x = 0, y = 0;
            if (ship.shape.points[i]) {
                x = ship.x + ship.shape.points[i].x * ship.scale * game.scale,
                    y = ship.y + ship.shape.points[i].y * ship.scale * game.scale;
                if (drawObject.hasPoint(drawObject.x, drawObject.y, x, y, game.scale * drawObject.scale)) {
                    shipColor = "red";
                }
            }
            if (drawObject.shape.points[i]) {
                x = drawObject.x + drawObject.shape.points[i].x * drawObject.scale * game.scale,
                    y = drawObject.y + drawObject.shape.points[i].y * drawObject.scale * game.scale;
                if (ship.hasPoint(ship.x, ship.y, x, y, game.scale * ship.scale)) {
                    drawColor = "red";
                }
            }
        }
        draw(ship, shipColor);
        draw(drawObject, drawColor);
    }

    function draw(obj, color) {
        let x = obj.x,
            y = obj.y,
            shape = obj.shape.points,
            scale = game.scale * obj.scale;
        // Save context so it can be restored after drawing
        context.save();

        color = color || baseColor;
        // Move and rotate to the correct position
        // context.translate(x, y);

        context.strokeStyle = color;

        context.shadowBlur = 20;
        context.shadowColor = color;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        if (width > 2000) {
            context.lineWidth = 2;
        }
        else {
            context.lineWidth = 1;
        }

        // Start the actual drawing
        context.beginPath();
        for (let corner = 0; corner < shape.length; corner++) {
            if (corner === 0) {
                context.moveTo(
                    x + shape[corner].x * scale,
                    y + shape[corner].y * scale,
                );
            }
            else {
                context.lineTo(
                    x + shape[corner].x * scale,
                    y + shape[corner].y * scale,
                );
            }
        }
        context.closePath();
        context.stroke();

        if (obj.shape.lines) {
            for (let i = 0; i < obj.shape.lines.length; i++) {
                context.beginPath();
                context.moveTo(x + obj.shape.lines[i][0].x * scale, y + obj.shape.lines[i][0].y * scale);
                context.lineTo(x + obj.shape.lines[i][1].x * scale, y + obj.shape.lines[i][1].y * scale);
                context.closePath();
                context.stroke();
            }
        }

        context.beginPath();
        context.moveTo(x - 10, y);
        context.lineTo(x + 10, y);
        context.stroke();

        context.beginPath();
        context.moveTo(x, y - 10);
        context.lineTo(x, y + 10);
        context.stroke();

        context.restore();
    }
    canvas.addEventListener("wheel", function (e) {
        console.log(e);
        if (!e.shiftKey || e.altKey) {
            drawObject.rotate(Math.PI * (e.deltaY / 4000));
        }
        if (e.shiftKey || e.altKey) {
            ship.rotate(Math.PI * (e.deltaY / 4000));
        }
        update();
    });
    canvas.addEventListener("click", function (e) {
        shapeIndex++;
        if (shapeIndex > shapes.asteroids.length - 1) {
            shapeIndex = 0;
        }
        drawObject.shape = shapes.asteroids[shapeIndex];
        drawObject.shape.scale *= 5;
        update();
    });

    canvas.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        update();
    });
});


