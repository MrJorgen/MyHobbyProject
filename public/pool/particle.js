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
        this.velocity = new Vector();
    }

    dotProduct(v1) {
        return this.x * v1.x + this.y * v1.y;
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
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.vy += this.gravity * this.mass;
        this.x += this.vx;
        this.y += this.vy;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    angleTo(p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    }

    distanceTo(p2) {
        let dx = p2.x - this.x,
            dy = p2.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
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
            distance = Math.sqrt(dx * dx + dy * dy),
            springForce = (distance - offset || 0) * stiffness;

        this.vx += dx / distance * springForce;
        this.vy += dy / distance * springForce;
    }
}

class Utils {
    norm(value, min, max) {
        return (value - min) / (max - min);
    }

    lerp(norm, min, max) {
        return (max - min) * norm + min;
    }

    map(value, sourceMin, sourceMax, destMin, destMax) {
        return this.lerp(this.norm(value, sourceMin, sourceMax), destMin, destMax);
    }

    clamp(value, min, max) {
        return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
    }

    distance(p1, p2) {
        let dx = p1.x - p2.x,
            dy = p1.y - p2.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    distanceXY(x1, y1, x2, y2) {
        return this.distance({ x: x1, y: y1 }, { x: x2, y: y2 });
    }

    circleCollision(c1, c2) {
        return this.distance(c1, c2) <= c1.radius + c2.radius;
    }

    circlePointCollision(x, y, circle) {
        return this.distanceXY(x, y, circle.x, circle.y) < circle.radius;
    }

    pointInRect(x, y, rect) {
        return this.inRange(x, rect.x, rect.x + rect.width) && this.inRange(y, rect.y, rect.y + rect.height)
    }

    rectIntersect(r0, r1) {
        return this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    }

    lineIntersect(p0, p1, p2, p3) {
        let A1 = p1.y - p0.y,
            B1 = p0.x - p1.x,
            C1 = A1 * p0.x + B1 * p0.y,
            A2 = p3.y - p2.y,
            B2 = p2.x - p3.x,
            C2 = A2 * p2.x + B2 * p2.y,
            denominator = A1 * B2 - A2 * B1;

        return {
            x: (B2 * C1 - B1 * C2) / denominator,
            y: (A1 * C2 - A2 * C1) / denominator
        }
    }

    inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }

    rangeIntersect(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
    }

    randomRange(min, max) {
        return (Math.random() * (max - min)) + min;
    }

    randomInt(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    }

    degreesToRads(degrees) {
        return degrees / 180 * Math.PI;
    }

    radsToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    roundToPlaces(value, places) {
        let mult = Math.pow(10, places);
        return Math.round(value * mult) / mult;
    }

    roundToNearest(value, nearest) {
        return Math.round(value / nearest) * nearest;
    }

    randomDist(min, max, iterations) {
        let total = 0;
        for (let i = 0; i < iterations; i++) {
            total += this.randomRange(min, max);
        }
        return total / iterations;
    }
}

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    dotProduct(v1) {
        return this.x * v1.x + this.y * v1.y;
    }

    normalize() {
        var m = Math.sqrt(this.x * this.x + this.y * this.y);
        return {
            x: this.x / m,
            y: this.y / m
        };
    }

    setHeading(angle) {
        let length = this.getSpeed();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    setDegree(degree) {
        let angle = Math.PI * degree / 180;
        let length = this.getSpeed();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getHeading() {
        return Math.atan2(this.y, this.x);
    }

    setSpeed(length) {
        let angle = this.getHeading();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getSpeed() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    add(v2) {
        return new Vector(this.x + v2.x, this.y + v2.y);
    }

    subtract(v2) {
        return new Vector(this.x - v2.x(), this.y - v2.y());
    }

    multiply(value) {
        return new Vector(this.x * value, this.y * value);
    }

    divide(value) {
        return new Vector(this.x / value, this.y / value);
    }

    addTo(v2) {
        this.x += v2.x;
        this.y += v2.y;
    }

    subtractFrom(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
    }

    multiplyBy(value) {
        this.x *= value;
        this.y *= value;
    }

    divideBy(value) {
        this.x /= value;
        this.y /= value;
    }

}