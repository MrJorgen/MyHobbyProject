document.addEventListener("DOMContentLoaded", function () {
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.startFrame = 0;
            this.size = (Math.random() * 2 + 1);
            this.color = "hsla(" +
                Math.round(Math.random() * 255) + // hue
                " , 100%, " + // saturation
                (Math.random() * 10 + 90) + "%, " + // lightness
                (Math.random() * 0.5 + 0.5) + // alpha
                ")";

            this.blur = Math.round(Math.random() * this.size * 7);
        }
        draw() {
            context.fillStyle = this.color;
            context.beginPath();
            context.shadowBlur = this.blur;
            context.shadowColor = this.color;
            context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            context.fill();
        }
    }

    let viewport = document.querySelector("#viewport");
    viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;


    const canvas = document.querySelector("#canvas"), context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth, height = canvas.height = window.innerHeight;

    let particles = [], frameCounter = 0, maxParticles = Math.round(height * width / 5000);
    console.log(maxParticles);
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    for (let i = 0; i < maxParticles; i++) {
        addParticle();
    }

    draw();

    function draw(timer = 0) {
        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            if (Math.random() * (maxParticles / 8) > 1) {
                let p = particles[i];
                p.draw(context, 1);
            }
            if (Math.random() * 100000 < 1) {
                particles.splice(i, 1);
                addParticle();
            }
        }
        frameCounter = requestAnimationFrame(draw);
    }

    function addParticle() {
        let p = new Particle(Math.random() * width, Math.random() * height);
        p.startFrame = frameCounter;
        particles.push(p);
    }
});