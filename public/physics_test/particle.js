class Particle {
    constructor(
        x = 0,
        y = 0,
        speed = 0,
        heading = 0,
        gravity = 0
    ) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
        this.mass = 1;
        this.radius = 0;
        this.bounce = -1;
        this.friction = 1;
        this.gravity = gravity || 0;
        this.springs = [];
    }

    getSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    setSpeed(speed) {
        let heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }

    getHeading() {
        return Math.atan2(this.vy, this.vx);
    }

    setHeading(heading) {
        let speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;

    }

    accelerate(ax, ay) {
        this.vx += ax;
        this.vy += ay;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
    }

    angleTo(p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    }

    mag(v) {
        return Math.hypot(v.x, v.y);
    }

    normalize(v) {
        // var m = Math.sqrt(v.x * v.x + v.y * v.y);
        var m = Math.hypot(v.x, v.y);
        return {
            x: v.x / m,
            y: v.y / m
        };
    }

    vec(p1) {
        return {
            x: p1.x - this.x,
            y: p1.y - this.y
        };
    }

    dotProduct(v1) {
        return this.vx * v1.x + this.vy * v1.y;
    }

    angleBetween(p2) {
        return Math.acos((this.vx * p2.x + this.vy * p2.y) / Math.hypot(this.vx, this.vy) / Math.hypot(p2.x, p2.y));
    }

    distanceTo(p2) {
        let dx = p2.x - this.x,
            dy = p2.y - this.y;
        return Math.hypot(dx, dy);
    }

    gravitateTo(p2) {
        let dx = p2.x - this.x,
            dy = p2.y - this.y,
            distSQ = dx * dx + dy * dy,
            dist = Math.sqrt(distSQ),
            force = p2.mass / distSQ,
            accX = dx / dist * force,
            accY = dy / dist * force;

        this.vx += accX;
        this.vy += accY;
    }

    springTo(point, stiffness, offset) {
        let dx = point.x - this.x,
            dy = point.y - this.y,
            distance = Math.hypot(dx, dy),
            springForce = (distance - offset || 0) * stiffness;

        this.vx += dx / distance * springForce;
        this.vy += dy / distance * springForce;
    }
}