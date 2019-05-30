class Ship extends Particle {
    constructor(
        x = 0,
        y = 0,
        speed = 0,
        heading = 0,
        gravity = 0
    ) {
        super(x, y, speed, heading, gravity)
        // Neat trick that makes a copy of the shape object :))
        this.shape = JSON.parse(JSON.stringify(shapes.ship.body));
        this.rotate(Math.PI * 1.5);
        this.angle = Math.PI * 1.5;
        this.scale = shapes.ship.body.scale;
        this.thrusting = false;
        this.firing = false;
        this.type = "ship";
        this.friction = 0.999;
        this.thrust = vector.create(0, 0);
        this.x = width / 2;
        this.y = height / 2;
        this.vx = 0;
        this.vy = 0;
    }
}