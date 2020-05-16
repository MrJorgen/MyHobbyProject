class Poolball {
    constructor(x, y, radius, velX, velY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vel = {
            x: velX,
            y: velY
        };
    }
    update() {
        this.x += this.vel.x;
        this.y += this.vel.y;
    }
    draw() {

    }
}