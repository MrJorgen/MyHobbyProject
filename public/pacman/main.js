let pacMan = null;
window.addEventListener("DOMContentLoaded", function () {
    class PacMan {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.vx = 0;
            this.vy = 0;
            this.moving = false;
            this.mouth = {

            };
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
        }

    }

    let width = 0, height = 0;
    const canvas = document.querySelector("#canvas"), context = canvas.getContext("2d");
    width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    let centerX = width / 2, centerY = height / 2,
        mouthOpening = 0.6, radius = Math.min(height / 2, width / 2) * .75,
        mouthMove = -0.25, angle = 0, speed = 5;

    pacMan = new PacMan(centerX, centerY, 50);
    draw();

    function draw() {
        let mouthTop = (mouthOpening / 2) * Math.PI,
            mouthBottom = (2 - mouthOpening / 2) * Math.PI;

        // Clear screen
        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);

        // Draw Pac Man
        context.save();
        context.translate(pacMan.x, pacMan.y);
        context.rotate(angle);
        context.beginPath();
        context.arc(0, 0, pacMan.radius, mouthTop, mouthBottom);
        context.lineTo(-pacMan.radius / 2, 0);
        context.closePath();
        context.fillStyle = "yellow";
        context.fill();
        context.restore();

        // Update position and mouth
        pacMan.update();
        if (pacMan.moving) {
            if (mouthOpening < 0 || mouthOpening > 0.6) {
                mouthMove = -mouthMove;
            }
            mouthOpening += mouthMove;
        }

        // Start over :)
        requestAnimationFrame(draw);
    }

    document.addEventListener("keydown", function (e) {
        switch (e.keyCode) { // Left arrow
            case 37:
                angle = 1 * Math.PI;
                pacMan.vx = -speed;
                pacMan.vy = 0;
                pacMan.moving = true;
                break;
            case 38: // Up arrow
                angle = 1.5 * Math.PI;
                pacMan.vx = 0;
                pacMan.vy = -speed;
                pacMan.moving = true;
                break;
            case 39: // Right arrow
                angle = 0;
                pacMan.vx = speed;
                pacMan.vy = 0;
                pacMan.moving = true;
                break;
            case 40: // Down arrow
                angle = 0.5 * Math.PI;
                pacMan.vx = 0;
                pacMan.vy = speed;
                pacMan.moving = true;
                break;
        }
    });

    document.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 37:
            case 38:
            case 39:
            case 40:
                pacMan.vx = 0;
                pacMan.vy = 0;
                pacMan.moving = false;
        }
    });

});
    /*
    Some facts:
    SIZE
        food width: 26
        food height: 29

    SCORE
        Pac-Dot - 10 points.
        Power Pellet - 50 points.
        Vulnerable Ghosts:
        #1 in succession - 200 points.
        #2 in succession - 400 points.
        #3 in succession - 800 points.
        #4 in succession - 1600 points.
        Fruit:
        Cherry: 100 points.
        Strawberry: 300 points
        Orange: 500 points
        Apple: 700 points
        Melon: 1000 points
        Galaxian Boss: 2000 points
        Bell: 3000 points
        Key: 5000 points
    
    GHOSTS
        The red ghost, Blinky, doggedly pursues Pac-Man.
        The pink ghost, Pinky, tries to ambush Pac-Man by moving parallel to him.
        The cyan ghost, Inky, tends not to chase Pac-Man directly unless Blinky is near.
        The orange ghost, Clyde, pursues Pac-Man when far from him, but usually wanders away when he gets close.
    LEVELS
        1
        https://vignette.wikia.nocookie.net/pacman/images/e/e7/PacMaze.png
    */