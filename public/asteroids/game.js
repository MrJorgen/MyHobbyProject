// This is my attempt to make a clone of the classic game Asteroids using
// resources from various places on the web.
// http://www.classicgaming.cc/classics/asteroids/
// https://www.giantbomb.com/asteroids/3030-1034/
// https://youtu.be/UqghsUAzBsQ?t=51s
// http://thedoteaters.com/tde/wp-content/uploads/2013/03/asteroids_snap_bezel.png
// https://vignette2.wikia.nocookie.net/uncyclopedia/images/e/eb/Asteroids_.png/revision/latest?cb=20080916193635
// http://www.cburch.com/cs/490/links/asteroids.jpg
// http://www.rawbw.com/~delman/pdf/making_of_Asteroids.pdf
// https://en.wikipedia.org/wiki/Asteroids_(video_game)


// TODO: Make an array of object to draw on screen and loop through that in the draw function!!!
// TODO: Reduce the number of loops to make the game more fluid.
// Example: Loop only asteroids to hit detect agains ship.bullets and ship(s).

let game = {}, width, height, canvas, context,
    mousePointer = vector.create(0, 0), fps = 0, lastFrameDrawTime = 0, developerMode = true,
    audioContext = new AudioContext(), panNode = [], utils = new Utils(), newGame = true, saucerTimeout = null,
    gameOver = false;

document.addEventListener("DOMContentLoaded", function () {
    let viewport = document.querySelector("#viewport");

    viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio,
        canvas = document.querySelector("#canvas"), context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;

    setCanvasSize();

    const baseColor = "rgba(180, 230, 255, 1)";

    let ship = null, remainingShips = new Ship(), sounds = {
        fire: new Audio('./sounds/fire.wav'),
        bangLarge: new Audio('./sounds/bangLarge.wav'),
        bangMedium: new Audio('./sounds/bangMedium.wav'),
        bangSmall: new Audio('./sounds/bangSmall.wav'),
        thrust: new Audio('./sounds/thrust.wav'),
        extraShip: new Audio('./sounds/extraShip.wav'),
        saucerSmall: new Audio('./sounds/saucerSmall.wav'),
        saucerBig: new Audio('./sounds/saucerBig.wav'),
        beat1: new Audio('./sounds/beat1.wav'),
        beat2: new Audio('./sounds/beat2.wav'),
    }, saucerFireInterval;

    sounds.beat1.loop = true;
    sounds.beat2.loop = true;
    sounds.saucerBig.loop = true;
    sounds.saucerSmall.loop = true;
    sounds.thrust.loop = true;
    // sounds.beat1.play();
    initSound();

    frameCounter = 0,
        timeElapsed = 0,
        asteroids = [],
        saucer = null,
        game = {
            level: 1,
            score: 0,
            alive: false,
            lives: 0,
            scale: height / 2160,
        },
        turningLeft = false,
        turningRight = false,
        bulletDuration = height * .9,
        explosions = [];

    // Startup animation only

    for (let i = 0; i < 15; i++) {
        asteroids.push(new Asteroid(0, 0, Math.floor(Math.random() * 3), true));
    }
    saucerTimeout = setTimeout(function () {
        initSaucer();
    }, (Math.random() * 10 + 20) * 1000); // Init saucer at 20 - 30 seconds

    update();

    function initSound() {
        let sources = [audioContext.createMediaElementSource(sounds.fire),
        audioContext.createMediaElementSource(sounds.bangLarge),
        audioContext.createMediaElementSource(sounds.bangMedium),
        audioContext.createMediaElementSource(sounds.bangSmall),
        audioContext.createMediaElementSource(sounds.thrust),
        audioContext.createMediaElementSource(sounds.extraShip),
        audioContext.createMediaElementSource(sounds.saucerSmall),
        audioContext.createMediaElementSource(sounds.saucerBig),
        audioContext.createMediaElementSource(sounds.beat1),
        audioContext.createMediaElementSource(sounds.beat2)];

        for (let i = 0; i < sources.length; i++) {
            panNode[i] = audioContext.createStereoPanner();
            sources[i].connect(panNode[i]);
            panNode[i].connect(audioContext.destination);
        }
    }

    // Resetship. Remove all bullets, set to midscreen, facing "north", no movement
    // This has turned out to be a "game reset", it's fine but should propably rename it...
    function resetGame() {
        if (asteroids.length <= 0) {
            initLevel();
        }
        ship = new Ship();
        bullets = [];
        game.alive = true;
        if (newGame || gameOver) {
            asteroids = [];
            game.score = 0;
            game.level = 1;
            game.lives = 3;
            for (let i = 0; i < 4; i++) {
                asteroids.push(new Asteroid(0, 0, 2, true));
            }
            destroySaucer();
            newGame = false, gameOver = false;
        }
    }

    // Fire bullet. Play sound, make new bulllet and animate it.
    function fireBullet(obj = ship) {
        if (!game.alive) { return };
        let fireAllowed = false, bulletsFromShip = 0, latestBulletFromShip = 10000;
        if (obj.type == "saucer") {
            fireAllowed = true;
        }
        else {
            for (let i = 0; i < bullets.length; i++) {
                if (bullets[i].firedFrom == "ship") {
                    bulletsFromShip++;
                    latestBulletFromShip = Math.min(latestBulletFromShip, Date.now() - bullets[i].timeCreated);
                }
            }
            if (bulletsFromShip < 4 && latestBulletFromShip > 500 && game.alive) {
                fireAllowed = true;
            }
        }
        if (fireAllowed) {
            let centerX = width / 2, bullet = new Particle();
            panNode[0].pan.value = (obj.x - centerX) / centerX;
            sounds.fire.play();
            bullet.firedFrom = obj.type;
            bullet.timeCreated = Date.now();
            bullet.shape = shapes.ship.bullet;
            bullet.scale = shapes.ship.bullet.scale;
            bullet.frameCreated = frameCounter;
            if (obj.type == "ship") {
                bullet.setSpeed(35 * game.scale);
                bullet.setHeading(ship.angle);
            }
            else if (obj.type == "saucer") {
                bullet.setSpeed(saucer.getSpeed() * 2);
                console.log(bullet.getSpeed());
                // Trying to get the saucer to be more accurate the more points you get.
                // Up to 40,000 where it's 100% accurate
                // A bit messy but working :)

                // Get the correct heading
                let headingToShip = obj.angleTo(ship);
                // Get the accuracy depenging on current points. Precision should never be more than 1(100%).
                precision = Math.min(1, utils.map(game.score, 0, 40000, 0, 1));
                // Set a random offset of max 45 degree angle, which get narrower the closer to 40k points you get.
                // Offset should be 0 when over or equal to 40k points
                let offSet = (Math.random() * 1 - 0.5) * (1 - precision);
                // Add offset the the correct heading
                bullet.setHeading(headingToShip + offSet);
            }
            let i = 5;
            bullet.x = obj.x + Math.cos(bullet.getHeading()) * i;
            bullet.y = obj.y + Math.sin(bullet.getHeading()) * i;
            while (obj.hasPoint(obj.x, obj.y, bullet.x, bullet.y, game.scale * obj.scale)) {
                i += 1;
                bullet.x = obj.x + Math.cos(bullet.getHeading()) * i;
                bullet.y = obj.y + Math.sin(bullet.getHeading()) * i;
            }
            bullet.x = obj.x + Math.cos(bullet.getHeading()) * i;
            bullet.y = obj.y + Math.sin(bullet.getHeading()) * i;
            bullet.index = bullets.length;
            bullets.push(bullet);
        }
    }

    // Takes a Particleobject
    function edgeDetect(obj, checkX = true, checkY = true) {
        let x = obj.x,
            y = obj.y,
            shape = obj.shape.points;
        // Move obj
        if (checkX) {
            if (x > width) {
                obj.x = 0;
                x = 0;
            }
            if (x < 0) {
                obj.x = width;
                x = width;
            }
        }
        if (checkY) {
            if (y > height) {
                obj.y = 0;
                y = 0;
            }
            if (y < 0) {
                obj.y = height;
                y = height;
            }
        }

        // Draw temp object cross the screen
        let maxX = 0;
        let maxY = 0;
        for (let i = 0; i < obj.shape.points.length; i++) {
            maxX = Math.abs(obj.shape.points[i].x) > maxX ? Math.abs(obj.shape.points[i].x) : maxX;
            maxY = Math.abs(obj.shape.points[i].y) > maxY ? Math.abs(obj.shape.points[i].y) : maxY;
        }
        maxX *= obj.scale;
        maxY *= obj.scale;
        if (checkX) {
            if (x + maxX > width) {
                draw({ x: x - width, y: y, shape: obj.shape, scale: obj.scale });
            }
            if (x - maxX < 0) {
                draw({ x: width + x, y: y, shape: obj.shape, scale: obj.scale });
            }
        }
        if (checkY) {
            if (y + maxY > height) {
                draw({ x: x, y: y - height, shape: obj.shape, scale: obj.scale });
            }
            if (y - maxY < 0) {
                draw({ x: x, y: height + y, shape: obj.shape, scale: obj.scale });
            }
        }
        return obj;
    }

    function update(timeElapsed = 0) {
        // if (developerMode) {
        let deltaTime = timeElapsed - lastFrameDrawTime;
        fps = 1000 / deltaTime;
        // }

        lastFrameDrawTime = timeElapsed;

        context.save();
        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);
        context.restore();

        if (newGame) {
            let textSize = height / 10;
            vectorText("asteroids", textSize, null, (height / 2) - textSize * 1.5);
            vectorText("press space to play", textSize / 2.12);
        }

        drawFps();

        // Update & draw asteroids
        for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].index = i;
            asteroids[i] = edgeDetect(asteroids[i]);
            asteroids[i].rotate(asteroids[i].rotation);
            asteroids[i].update();
            draw(asteroids[i]);
            if (collide(ship, asteroids[i]) && game.alive) {
                addScore(asteroids[i].points);
                asteroids[i].hit();
                destroyShip();
            }
            if (saucer && collide(saucer, asteroids[i])) {
                asteroids[i].hit();
                destroySaucer();
            }
        }
        if (explosions.length > 0) {
            for (let i = explosions.length - 1; i >= 0; i--) {
                draw(explosions[i]);
                explosions[i].update();
                if (explosions[i].lifespan <= frameCounter) {
                    explosions.splice(i, 1);
                }
            }
        }

        // if alive, draw & update ship and bullets
        if (game.alive) {
            // Update & draw ship.bullets
            if (ship.firing) {
                fireBullet(ship);
            }

            if (bullets.length > 0) {
                for (let i = bullets.length - 1; i >= 0; i--) {
                    let dist = bullets[i].getSpeed() * (frameCounter - bullets[i].frameCreated);
                    bullets[i] = edgeDetect(bullets[i]);
                    bullets[i].update();
                    draw(bullets[i]);
                    if (dist > bulletDuration || asteroidHit(bullets[i])) {
                        bullets.splice(i, 1);
                        continue;
                    }
                    if (ship.hasPoint(ship.x, ship.y, bullets[i].x, bullets[i].y, game.scale * ship.scale)) {
                        destroyShip();
                        bullets.splice(i, 1);
                        continue;
                    }
                    if (saucer && saucer.hasPoint(saucer.x, saucer.y, bullets[i].x, bullets[i].y, game.scale * saucer.scale) &&
                        bullets[i].firedFrom == "ship") {
                        game.score += saucer.points;
                        destroySaucer();
                        bullets.splice(i, 1);
                    }
                }
            }
            // Update & draw ship
            let thrustObj = new Particle();
            thrustObj.x = ship.x;
            thrustObj.y = ship.y;
            thrustObj.shape = JSON.parse(JSON.stringify(shapes.ship.thrust));
            thrustObj.angle = ship.angle;
            thrustObj.scale = shapes.ship.thrust.scale;
            let turnSpeed = .09;
            if (turningLeft) {
                ship.angle -= turnSpeed;
                ship.rotate(-turnSpeed);
            }
            if (turningRight) {
                ship.angle += turnSpeed;
                ship.rotate(turnSpeed);
            }
            ship.thrust.setAngle(ship.angle);
            thrustObj.rotate(ship.angle);
            if (ship.thrusting) {
                ship.thrust.setLength(0.125 * game.scale);
                draw(thrustObj);
            }
            else {
                ship.thrust.setLength(0);
            }

            draw(ship, baseColor);
            ship.accelerate(ship.thrust.getX(), ship.thrust.getY());
            ship.update();
            ship = edgeDetect(ship);

        } // End alive

        if (!game.alive && !gameOver && !newGame) {
            // draw(ship, "rgba(180, 230, 255, .15)");
            if (frameCounter % 20 > 10) {
                draw(ship, baseColor);
            }

        }
        if (saucer) {
            saucer.update();
            if (saucer.x < -50 || saucer.x > width + 50) {
                destroySaucer();
            }
            else {
                edgeDetect(saucer, false, true);
                draw(saucer);
                if (Date.now() - saucer.timeCreated > (Math.random() * .5 + 2) * 1000) {
                    let possibleHeadings = [
                        saucer.originalHeading - (Math.PI * .25),
                        saucer.originalHeading,
                        saucer.originalHeading + (Math.PI * .25)
                    ],
                        rnd = Math.floor(Math.random() * 2),
                        currentHeading = saucer.getHeading();

                    let removeIndex = possibleHeadings.indexOf(saucer.getHeading());
                    possibleHeadings.splice(removeIndex, 1);
                    saucer.setHeading(possibleHeadings[rnd]);
                    saucer.timeCreated = Date.now();
                }
            }
            if (collide(saucer, ship) && game.alive) {
                addScore(saucer.points);
                destroySaucer();
                destroyShip();
            }
        }
        // Draw remaining ships(lives)
        // TODO: Draw one ship and x remaining ships
        for (let i = 0; i < game.lives - 1; i++) {
            remainingShips.x = width - ((45 * game.scale) * .9 * 2 * (i + 1));
            remainingShips.y = height * .01 + (45 * game.scale) * .9;
            remainingShips.rotate(Math.PI * 2);
            remainingShips.scale = shapes.ship.body.scale * .9;
            draw(remainingShips);
        }

        if (gameOver) {
            vectorText("Game Over");
        }
        vectorText(game.score.toString(), height / 30, width * .01, height * .01);
        let levelString = 0 + game.level.toString();
        vectorText(levelString.slice(-2), height / 30, null, height * .01);
        frameCounter = requestAnimationFrame(update);
    }

    function explode(obj) {
        let numParticles = obj.shape.points.length;
        for (let i = 0; i < numParticles; i++) {
            let j = (i + 1) % numParticles;
            let corner = {
                x: (obj.x + obj.shape.points[i].x + obj.x + obj.shape.points[j].x) / 2,
                y: (obj.y + obj.shape.points[i].y + obj.y + obj.shape.points[j].y) / 2,
            };

            let explosion = new Particle(obj.x, obj.y, 2 * game.scale, obj.angleTo(corner));
            explosion.shape = {};
            explosion.shape.points = [];
            explosion.shape.points[0] = {
                x: obj.shape.points[i].x,
                y: obj.shape.points[i].y
            };
            explosion.shape.points[1] = {
                x: obj.shape.points[j].x,
                y: obj.shape.points[j].y
            };
            explosion.lifespan = frameCounter + 15;
            explosion.scale = obj.scale;
            explosions.push(explosion);
        }
    }

    function destroyShip() {
        explode(ship);
        ship = new Ship();
        game.alive = false;
        game.lives--;
        if (game.lives <= 0) {
            gameOver = true;
        }
    }

    function shipCrash() {
        // TODO: Make an awsome crash animation :)
    }

    function initSaucer() {
        // console.log("Saucer incoming");
        let size = "", speed = 7 * game.scale;
        if (game.score < 10000) {
            size = "large";
        }
        else if (game.score > 10000 && game.score < 40000) {
            size = (Math.floor(Math.random() * 2)) == 0 ? "small" : "large";
        }
        else if (game.score > 40000) {
            size = "small"
        }

        saucer = new Particle();
        saucer.type = "saucer";

        // Fire bullet
        saucerFireInterval = setInterval(function () {
            fireBullet(saucer);
        }, Math.random() * 1000 + 2000);

        saucer.timeCreated = Date.now();
        saucer.shape = shapes.saucer;
        if (size == "large") {
            saucer.sound = sounds.saucerBig;
            saucer.scale = 10;
            saucer.points = 200;
        }
        else {
            saucer.sound = sounds.saucerSmall;
            saucer.scale = 6;
            saucer.points = 1000;
        }
        saucer.sound.play();

        saucer.x = Math.floor(Math.random() * 2) == 0 ? -50 : width + 50;
        saucer.y = Math.floor(Math.random() * 2) == 0 ? height * .2 : height * .8;

        saucer.x < 0 ? saucer.setHeading(0) : saucer.setHeading(Math.PI * 1);
        saucer.setSpeed(speed);

        saucer.originalHeading = saucer.getHeading();
    }

    function destroySaucer() {
        if (saucer) {
            explode(saucer);
            saucer.sound.pause();
            saucer = null;
        }
        clearInterval(saucerFireInterval);
        clearTimeout(saucerTimeout);
        saucerTimeout = setTimeout(initSaucer, (Math.random() * 10 + 20) * 1000);
    }

    function addScore(points) {
        // Add extra ship at each 10000 points
        if (game.score % 10000 > (game.score + points) % 10000) {
            sounds.extraShip.play();
            game.lives++;
        }
        game.score += points;
    }

    function initLevel() {
        for (let i = 0; i < Math.min(2 + (game.level * 2), 12); i++) {
            asteroids.push(new Asteroid(0, 0, 2, true));
        }
        game.alive = false;
        ship = new Ship();
        game.level++;
        setTimeout(function () {
            resetGame();
        }, 1000);
    }

    function asteroidHit(bullet) {
        for (let i = 0; i < asteroids.length; i++) {
            let asteroid = asteroids[i], len = bullet.shape.points.length;
            for (j = 0; j < len; j++) {
                let x = bullet.x + bullet.shape.points[j].x, y = bullet.y + bullet.shape.points[j].y;
                if (asteroid.hasPoint(asteroid.x, asteroid.y, x, y, game.scale * asteroid.scale)) {
                    let centerX = width / 2;
                    if (bullet.firedFrom == "ship") {
                        addScore(asteroid.points);
                    }
                    if (asteroid.sizeIndex <= 0) {
                        explode(asteroid);
                    }
                    asteroid.hit();
                    if (asteroids.length <= 0) {
                        initLevel();
                    }
                    return true;
                }
            }
        }
    }

    function vectorText(textString, size, startX, startY) {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.strokeStyle = baseColor;

        if (width > 2000) {
            context.lineWidth = 3;
        }
        else if (width < 2000 && width > 1280) {
            context.lineWidth = 2;
        }
        else {
            context.lineWidth = 1;
        }

        let textWidth = 4, textHeight = 6,
            validChars = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        // Drawing a + centerscreen for debugging
        // context.save();
        // context.strokeStyle = "rgba(255, 0, 0, 1)";
        // context.beginPath();
        // context.moveTo(width / 2, height / 2 - (height * .05));
        // context.lineTo(width / 2, height / 2 + (height * .05));
        // context.stroke();
        // context.beginPath();
        // context.moveTo(width / 2 - (height * .05), height / 2);
        // context.lineTo(width / 2 + (height * .05), height / 2);
        // context.stroke();
        // context.beginPath();
        // context.moveTo(width / 2, 0);
        // context.lineTo(width / 2, height * .05);
        // context.stroke();
        // context.restore();
        // End debugging

        size = size || height / 8;
        size /= textHeight;
        // x = middle screen - half the textwidth + half the space between chars
        startX = startX || Math.round((width / 2) - (textString.length * (textWidth + 1) * size / 2)) + (size * .5);
        startY = startY || Math.round(height / 2 - (size * 3));

        startX += textWidth * size * .5;
        startY += textHeight * size * .5;

        textString = textString.toUpperCase();
        for (let i = 0, len = textString.length; i < len; i++) {
            // Make sure it's a valid char to write to screen
            if (validChars.includes(textString.charAt(i))) {

                let shape = shapes.alphabet[textString.charAt(i)];
                context.beginPath();
                context.moveTo(
                    Math.round(shape.points[0].x * size + startX + i * (textWidth + 1) * size),
                    Math.round(shape.points[0].y * size + startY)
                );
                for (let j = 1, len2 = shape.points.length; j < len2; j++) {
                    context.lineTo(
                        Math.round(shape.points[j].x * size + startX + i * (textWidth + 1) * size),
                        Math.round(shape.points[j].y * size + startY)
                    );
                }
                if (shape.closedPath) {
                    context.closePath();
                }
                context.stroke();
            }
        }

        context.restore();
    }

    function collide(obj1, obj2) {
        if (!obj1 || !obj2) {
            return false;
        }
        let len = Math.max(obj1.shape.points.length, obj2.shape.points.length);
        // Check for asteroid - obj1 collision. Both ways...
        for (let i = 0; i < len; i++) {
            let x = 0, y = 0;
            if (obj1.shape.points[i]) {
                x = obj1.x + obj1.shape.points[i].x * obj1.scale * game.scale,
                    y = obj1.y + obj1.shape.points[i].y * obj1.scale * game.scale;
                if (obj2.hasPoint(obj2.x, obj2.y, x, y, game.scale * obj2.scale)) {
                    return true;
                }
            }
            if (obj2.shape.points[i]) {
                x = obj2.x + obj2.shape.points[i].x * obj2.scale * game.scale,
                    y = obj2.y + obj2.shape.points[i].y * obj2.scale * game.scale;
                if (obj1.hasPoint(obj1.x, obj1.y, x, y, game.scale * obj1.scale)) {
                    return true;
                }
            }
        }
        return false;
    }

    function drawFps() {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.font = height / 50 + "px Verdana";
        context.fillStyle = "rgba(50, 255, 50, 0.25)";
        context.textAling = "left";
        context.textBaseline = "bottom";
        context.fillText("FPS: " + fps.toFixed(1), 20, height - 40);
        context.restore();
    }

    function draw(obj, color) {
        let x = obj.x,
            y = obj.y,
            shape = obj.shape.points,
            angle = obj.angle || 0,
            scale = game.scale * obj.scale;
        // Save context so it can be restored after drawing
        context.save();

        // Move and rotate to the correct position
        context.translate(x, y);
        // context.rotate(angle);
        context.strokeStyle = color || baseColor;
        context.fillStyle = baseColor;

        if (width > 2000) {
            context.lineWidth = 3;
        }
        else if (width < 2000 && width > 1200) {
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
                    shape[corner].x * scale,
                    shape[corner].y * scale,
                );
            }
            else {
                context.lineTo(
                    shape[corner].x * scale,
                    shape[corner].y * scale,
                );
            }
        }
        context.closePath();
        if (obj.shape.fill) {
            context.fill();
        }
        else {
            context.stroke();
        }
        if (obj.shape.lines) {
            for (let i = 0; i < obj.shape.lines.length; i++) {
                context.beginPath();
                context.moveTo(obj.shape.lines[i][0].x * scale, obj.shape.lines[i][0].y * scale);
                context.lineTo(obj.shape.lines[i][1].x * scale, obj.shape.lines[i][1].y * scale);
                context.closePath();
                context.stroke();
            }
        }

        context.restore();
    }

    function setCanvasSize() {
        if (window.innerWidth / 16 < window.innerHeight / 9) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerWidth / 16 * 9;
            canvas.style.border = "none";
            canvas.style.borderBottom = "1px solid white";
            canvas.style.borderTop = "1px solid white";
            canvas.style.marginTop = (window.innerHeight - canvas.height) / 2 + "px";
        }
        if (window.innerWidth / 16 > window.innerHeight / 9) {
            canvas.height = window.innerHeight;
            canvas.width = window.innerHeight / 9 * 16;
            canvas.style.border = "none";
            canvas.style.borderRight = "1px solid white";
            canvas.style.borderLeft = "1px solid white";
            canvas.style.marginLeft = (window.innerWidth - canvas.width) / 2 + "px";
        }
        if (window.innerWidth / 16 == window.innerHeight / 9) {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
        }
        height = canvas.height;
        width = canvas.width;
        game.scale = canvas.height / 2160;
    }

    window.addEventListener("mousedown", function (event) {
        if (event.button == 0) {
            if (developerMode) {
                // console.log(bullets, asteroids, ship);
                console.log("Bullets array: ", bullets);
                console.log("Asteroids array: ", asteroids);
                console.log("Ship: ", ship);
            }
            ship.firing = true;
        }
        if (event.button == 1) {
            if (developerMode) {
                resetGame();
            }
        }
    });
    window.addEventListener("mouseup", function (event) {
        ship.firing = false;
    });

    window.addEventListener("keydown", function (event) {
        //console.log(event.keyCode);
        switch (event.keyCode) {
            case 87: // w
            case 38: // up
                sounds.thrust.play();
                ship.thrusting = true;
                break;
            case 65: // a
            case 37: // left
                turningLeft = true;
                break;
            case 68: // d
            case 39: // right
                turningRight = true;
                break;

            case 32: // spacebar
                if (game.alive) {
                    ship.firing = true;
                }
                if (!game.alive) {
                    resetGame();
                }
                break;
            default:
                break;

        }
    });

    window.addEventListener("keyup", function (event) {
        // console.log(event.keyCode);
        switch (event.keyCode) {
            case 87: // w
            case 38: // up
                sounds.thrust.pause();
                ship.thrusting = false;
                break;

            case 65: // a
            case 37: // left
                turningLeft = false;
                break;

            case 68: // d
            case 39: // right
                turningRight = false;
                break;

            case 32: // spacebar
                ship.firing = false;
            default:
                break;

        }
    });
});
