function addEventListeners() {
    window.addEventListener("mousedown", function (event) {
        if (event.button == 0) {
            if (developerMode) {
                // console.log(bullets, asteroids, ship);
                console.log("Bullets array: " + bullets);
                console.log("Asteroids array: " + asteroids);
                console.log("Ship: " + ship);
            }
            ship.firing = true;
        }
        if (event.button == 1) {
            if (developerMode) {
                initShip();
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
                    initShip();
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
}