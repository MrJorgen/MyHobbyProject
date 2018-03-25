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

    rotate(theta) {
        // simplifying computition of 2x2 matrix
        // for more information see slides in part 1
        theta = theta || this.angle;
        let c = Math.cos(theta),
            s = Math.sin(theta);

        // iterate thru each vertex and change position
        for (let i = 0, len = this.shape.points.length; i < len; i++) {
            let x = this.shape.points[i].x,
                y = this.shape.points[i].y;

            this.shape.points[i].x = c * x - s * y;
            this.shape.points[i].y = s * x + c * y;
        }
        if (this.shape.lines) {
            for (let i = 0; i < this.shape.lines.length; i++) {
                let x = this.shape.lines[i][0].x,
                    y = this.shape.lines[i][0].y;

                this.shape.lines[i][0].x = c * x - s * y;
                this.shape.lines[i][0].y = s * x + c * y;

                x = this.shape.lines[i][1].x,
                    y = this.shape.lines[i][1].y;
                this.shape.lines[i][1].x = c * x - s * y;
                this.shape.lines[i][1].y = s * x + c * y;

            }
        }
    }

    hasPoint(ox, oy, x, y, scale) {
        let c = false, p = this.shape.points, len = p.length;

        for (let i = 0, j = len - 1; i < len; i += 1) {
            let px1 = p[i].x * scale + ox,
                px2 = p[j].x * scale + ox;

            let py1 = p[i].y * scale + oy,
                py2 = p[j].y * scale + oy;

            if ((py1 > y != py2 > y) &&
                (x < (px2 - px1) * (y - py1) / (py2 - py1) + px1)
            ) {
                c = !c;
            }
            j = i;
        }
        return c;
    }
}