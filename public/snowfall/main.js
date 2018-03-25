let width = 0, height = 0;
class SnowFlake {
    constructor(x, y, r, a) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.alpha = a;
        this.mass = Math.random() * 0.4 + 0.8;
    }
    update() {
        this.y += this.radius * this.mass;
        this.x += Math.sin(this.angle);
    }
}

window.addEventListener("DOMContentLoaded", function () {
    let viewport = document.querySelector("#viewport");
    viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;
    let canvas = document.querySelector("#canvas"), context = canvas.getContext("2d");
    width = canvas.width = window.innerWidth, height = canvas.height = window.innerHeight;

    let flakes = [], maxRadius = height / 432 < 2 ? 2 : height / 432, minRadius = 0.5,
        minAlpha = 0.2, maxAlpha = 1, maxFlakes = maxRadius * 100;

    let img = new Image();
    img.src = "img1.jpg";
    let utils = new Utils();

    for (let i = 0; i < maxFlakes; i++) {
        let flake = new SnowFlake(Math.random() * width, Math.random() * -height);
        flake.radius = utils.randomRange(minRadius, maxRadius);
        flake.angle = Math.random() * 2;
        flakes.push(flake);
    }
    draw();

    function draw() {
        // context.fillStyle = "rgb(0, 0, 35)";
        // context.fillRect(0, 0, width, height);
        // context.drawImage(img, 0, 0, width, height);
        context.clearRect(0, 0, width, height);

        for (let i = 0; i < flakes.length; i++) {
            let flake = flakes[i];
            flake.alpha = 1;
            if (flake.x >= width / 2) {
                flake.alpha = utils.map(flake.x, width / 2, width, maxAlpha, minAlpha);
            }
            else {
                flake.alpha = utils.map(flake.x, 0, width / 2, minAlpha, maxAlpha);
            }

            context.beginPath();
            context.fillStyle = "rgba(255, 255, 255, " + flake.alpha + ")";
            context.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            context.fill();

            flake.angle += .01 * ((maxRadius - minRadius) - (utils.norm(flake.radius, minRadius, maxRadius))) * flake.mass;
            // flake.angle += Math.random() * .1;
            flake.update();

            // Stop large flake at bottom but the smaller the flake, the higher it stops
            let landingHeight = utils.map(flake.radius, minRadius, maxRadius, (2 / 3 * height), height);
            if (flake.y > landingHeight) {
                flake.y = 0;
                flake.x = Math.random() * width;
            }
        }

        requestAnimationFrame(draw);
    }
})