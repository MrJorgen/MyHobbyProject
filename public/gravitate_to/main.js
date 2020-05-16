window.addEventListener("DOMContentLoaded", function () {
    const canvas = document.querySelector("#canvas"), context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth, height = canvas.height = window.innerHeight;
    let sun = null, earth = null, moon = null, frameCounter = 0, slider = document.querySelector("#slider"), speed = slider.value;
    setup();
    draw();

    function setup() {
        sun = new Particle(width / 2, height / 2);
        sun.radius = Math.min(width, height) / 10;
        sun.img = new Image();
        sun.img.src = "sun.jpg";

        earth = new Particle();
        earth.radius = sun.radius / 3;
        earth.img = new Image(earth.radius * 2, earth.radius * 2);
        earth.img.src = "earth.png";

        moon = new Particle();
        moon.radius = earth.radius / 4;

        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);
    }

    function draw(time = 0) {
        let year = 365 * speed;
        let month = 30 * speed;
        let moonAngle = (2 * ((frameCounter % month) + 1) / month) * Math.PI;
        let earthAngle = (2 * ((frameCounter % year) + 1) / year) * Math.PI;
        speed = slider.value;
        time = Math.floor(time / 1000);

        // Clear screen
        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);

        // Update earth position
        earth.x = width / 2 + Math.sin(earthAngle) * ((height / 2) - (earth.radius / 2));
        earth.y = height / 2 + Math.cos(earthAngle) * ((height / 2) - (earth.radius / 2));

        // Update moon position
        moon.x = earth.x + Math.sin(moonAngle) * (moon.radius * 4);
        moon.y = earth.y + Math.cos(moonAngle) * (moon.radius * 4);

        // Draw sun
        context.drawImage(sun.img, sun.x - (sun.radius / 2), sun.y - (sun.radius / 2), sun.radius, sun.radius);

        // Draw earth
        context.save();
        context.translate(earth.x, earth.y);
        context.drawImage(earth.img, 0 - (earth.radius / 2), 0 - (earth.radius / 2), earth.radius, earth.radius);
        context.restore();

        // Draw moon
        context.beginPath();
        context.arc(moon.x, moon.y, moon.radius / 2, 0, Math.PI * 2);
        // context.fillStyle = "rgba(255, 255, 0, 1)";
        context.fillStyle = "#ebd49f";
        context.fill();

        let fontSize = height / 50;
        context.font = fontSize + "px Verdana";
        context.fillStyle = "white";
        context.fillText(time, 100, height - 100);
        context.fillText("This is an animation of how the earth and moon moves around", 100, 100);
        context.fillText("the sun. Only show movement and is not properly scaled.", 100, 100 + fontSize);
        context.fillText("Speed: (1 year = " + Math.round(speed * Math.PI * 2) + " seconds)", 100, 100 + fontSize * 3);

        frameCounter = requestAnimationFrame(draw);
    }
})