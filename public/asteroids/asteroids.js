class Asteroid extends Particle {
    constructor(
        x = 0,
        y = 0,
        size = 0,
        rndPos = false
    ) {
        super(x, y);
        let sizes = [  // 0 = small, 1 = medium, 2 = large
            { scale: 0.4, points: 100 },
            { scale: 0.8, points: 50 },
            { scale: 1.6, points: 20 }
        ];
        this.sizeIndex = size;
        // Neat trick that makes a copy of the shape object :))
        let randomShape = Math.floor(Math.random() * shapes.asteroids.length);
        this.shape = JSON.parse(JSON.stringify(shapes.asteroids[randomShape]));
        this.rotation = Math.random() * 0.04 - 0.02;
        this.setSpeed((2 + Math.random() * 2.5 * (3 - this.sizeIndex)) * game.scale);
        this.setHeading(Math.random() * Math.PI * 2);
        this.index = asteroids.length;
        this.scale = sizes[this.sizeIndex].scale * shapes.asteroids[randomShape].scale;
        this.points = sizes[this.sizeIndex].points;
        if (rndPos) {
            let x = 0, y = 0;
            if (Math.floor(Math.random() * 2) == 0) {
                y = Math.random() * height;
            }
            else {
                x = Math.random() * width;
            }
            this.x = x, this.y = y;
        }
        let sounds = [
            new Audio('./sounds/bangSmall.wav'),
            new Audio('./sounds/bangMedium.wav'),
            new Audio('./sounds/bangLarge.wav')
        ];
        this.sound = sounds[this.sizeIndex];
    }
    hit() {
        let centerX = width / 2;
        if (this.sizeIndex == 0) {
            panNode[3].pan.value = (this.x - centerX) / centerX;
            // TODO: Animate an explosion for the small ones
        }
        if (this.sizeIndex == 1) {
            panNode[2].pan.value = (this.x - centerX) / centerX;
        }
        if (this.sizeIndex == 2) {
            panNode[1].pan.value = (this.x - centerX) / centerX;
        }

        this.sound.pause();
        this.sound.currentTime = 0;
        this.sound.play();
        if (this.sizeIndex >= 1) {
            asteroids.push(new Asteroid(this.x, this.y, this.sizeIndex - 1));
            asteroids.push(new Asteroid(this.x, this.y, this.sizeIndex - 1));
        }
        asteroids.splice(this.index, 1);
    }
}