let developerMode = false,
    canvas;
let viewport = document.querySelector("#viewport");
// viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;
document.addEventListener('DOMContentLoaded', function () {
    canvas = document.querySelector("#canvas");
    const context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    let particles = [],
        particleSpeed = Math.floor(height / 200),
        rockets = [],
        radius = height > 2000 ? 2 : 1,
        rocketSpeed = Math.floor(height / 85) * 1.5,
        gravity = rocketSpeed / 90,
        maxParticles = 0,
        totalParticles = 0,
        frameCounter = 0,
        deltaTime = 0,
        lastTime;

        radius *= 2;

    launchRocket();
    update();

    function launchRocket() {
        let rocket = new Particle(
            randomNumber(width * 0.3, width * 0.7), // x
            randomNumber(height, height * 1.5),
            Math.random() * (rocketSpeed / 7) + rocketSpeed, // speed
            Math.PI * (Math.random() * 0.16 + 1.42), // heading 1.42 - 1.58
            gravity // gravity...
        );
        rocket.radius = radius;
        rocket.color = randomColor();
        rockets.push(rocket);
        setTimeout(function () {
            launchRocket();
        }, Math.random() * 250 + 750);
    }

    function explode(rocket) {
        let numParticles = randomNumber(200, 250),
            rnd = Math.floor(Math.random() * 2),
            burstSpeed = Math.random() * 0.5 + 0.75;
            burstSpeed *= 3;
        for (let i = 0; i < numParticles; i++) {
            let p = new Particle(rocket.x, rocket.y, burstSpeed * Math.random() * particleSpeed, Math.random() * Math.PI * 2, gravity);
            p.vx += rocket.vx * 0.6; // Inheit some initial speed from the rocket
            p.radius = Math.random() * 1 * radius; // Random radius
            p.mass = 0.15 * p.radius; // Set mass depending on radius
            p.friction = 0.98; // Friction...
            // p.friction = .975 * (1 + (p.mass / 60)); // Friction...
            p.color = rnd == 1 ? JSON.parse(JSON.stringify(rocket.color)) : randomColor(); // 50% chance to be multicolored else same color as rocket
            // p.color = rocket.color.name === "white" ? randomColor() : JSON.parse(JSON.stringify(rocket.color));
            particles.push(p);
        }
    }


    function update(timer = 0) {
        if(lastTime) {
            deltaTime = timer - lastTime;
        }
        else {
            deltaTime = 1 / 60;
        }

        let currentParticles = rockets.length + particles.length,
            averageParticles = totalParticles / frameCounter,
            textHeight = Math.floor(height / 50);
        totalParticles += currentParticles;
        if (currentParticles > maxParticles) {
            maxParticles = currentParticles;
        }
        if (developerMode) {
            context.save();
            context.fillStyle = "rgba(255, 255, 255, 1)";
            context.font = (height / 50) + "px Verdana";
            context.textBaseline = "middle";
            context.textAlign = "left";
            context.fillText("Current: " + (currentParticles), width / 50, textHeight);
            context.fillText("Peak: " + (maxParticles), width / 50, textHeight * 2.5);
            context.fillText("Average: " + (Math.round(averageParticles)), width / 50, textHeight * 4);
            context.fillText("Timer: " + (Math.floor(timer / 1000)) + " seconds", width / 50, textHeight * 5.5);
            context.restore();
        }
        context.save();
        // context.globalCompositeOperation = 'hard-light';
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        // context.fillStyle = "rgba(0, 0, 0, 1)";

        context.fillRect(0, 0, width, height);
        if (rockets.length > 0) {
            for (let i = rockets.length - 1; i >= 0; i--) {
                rocket = rockets[i];
                context.fillStyle = "rgba(" + rocket.color.r + " ," + rocket.color.g + " ," + rocket.color.b + " ," + rocket.color.a + ")";
                context.beginPath();
                context.arc(rocket.x, rocket.y, rocket.radius, 0, Math.PI * 2);
                context.fill();
                rocket.update(deltaTime);
                if (rocket.vy > 0) {
                    explode(rocket);
                    rockets.splice(i, 1);
                }
            }
        }
        if (particles.length > 0) {
            for (let i = particles.length - 1; i >= 0; i--) {
                let p = particles[i];
                context.fillStyle = "rgba(" + p.color.r + " ," + p.color.g + " ," + p.color.b + " ," + p.color.a + ")";
                context.beginPath();
                context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                context.fill();

                p.update(deltaTime);
                p.color.a -= Math.random() * 0.012;
                if (p.y > height ||
                    p.x > width && p.vx > 0 ||
                    p.x < 0 && p.vx < 0 ||
                    p.color.a <= 0) {
                    particles.splice(i, 1);
                }
            }
        }
        context.restore();
        lastTime = timer;
        frameCounter = requestAnimationFrame(update);
    }
}, false);


function randomColor() {
    let pureColors = [{
            r: 255,
            g: 64,
            b: 64,
            a: 1,
            name: "red"
        },
        {
            r: 64,
            g: 255,
            b: 64,
            a: 1,
            name: "green"
        },
        {
            r: 64,
            g: 64,
            b: 255,
            a: 1,
            name: "blue"
        },
        {
            r: 255,
            g: 255,
            b: 0,
            a: 1,
            name: "yellow"
        },
        {
            r: 255,
            g: 0,
            b: 255,
            a: 1,
            name: "magenta"
        },
        {
            r: 0,
            g: 255,
            b: 255,
            a: 1,
            name: "cyan"
        },
        {
            r: 255,
            g: 255,
            b: 255,
            a: 1,
            name: "white"
        },
    ];
    return pureColors[Math.floor(Math.random() * pureColors.length)];
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

document.addEventListener("touchend", function (e) {
    fullScreen(canvas);
    e.preventDefault();
    return false;
});

function fullScreen(element) {
    if (element.requestFullScreen) {
        element.requestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
}