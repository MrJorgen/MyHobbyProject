class Particle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = { x: 0, y: 0 };
        this.accel = { x: 0, y: 0 };
        this.gravity = 1;
        this.restitution = 0.9;
        this.friction = 0.996;
        this.mass = 1;
    }

    getSpeed() {
        return Math.hypot(this.velocity.x, this.velocity.y);
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y += this.gravity;
        this.velocity.x += this.accel.x;
        this.velocity.y += this.accel.y;
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.bounce();
    }

    distTo(other) {
        let diffX = other.x - this.x,
            diffY = other.y - this.y;
        return Math.sqrt(diffX * diffX + diffY * diffY);

    }

    bounce() {
        // Bounce of right wall
        if (this.x + this.radius >= width) {
            let outSideDist = this.x + this.radius - width;
            this.x = width - this.radius - outSideDist;
            this.velocity.x *= -this.restitution;
        }

        // Bounce of left wall
        if (this.x - this.radius <= 0) {
            let outSideDist = this.x - this.radius;
            this.x = this.radius + Math.abs(outSideDist);
            this.velocity.x *= -this.restitution;
        }

        // Bounce of ground
        if (this.y + this.radius >= height) {
            let outSideDist = this.y + this.radius - height;
            this.y = height - this.radius - outSideDist;
            this.velocity.y *= -this.restitution;
            if (Math.abs(this.velocity.y) < 8) {
                this.y = height - this.radius;
            }

        }

        // Bounce of ceiling
        if (this.y - this.radius <= 0) {
            let outSideDist = this.y - this.radius;
            this.y = this.radius + Math.abs(outSideDist);
            this.velocity.y *= -this.restitution;
        }

    }

    // Collision with another ball
    collide(other) {
        // Backtrack to find point of impact
        let step = 1 / (this.radius + other.radius);
        if (this.getSpeed() > 0 || other.getSpeed() > 0) {
            while (this.distTo(other) < this.radius + other.radius) {
                this.x += -this.velocity.x * step;
                this.y += -this.velocity.y * step;
                other.x += -other.velocity.x * step;
                other.y += -other.velocity.y * step;
            }
        }

        let dist = {
            x: other.x - this.x,
            y: other.y - this.y
        };
        dist = normalize(dist);

        let towardsMe = distAlong(other.velocity.x, other.velocity.y, dist.x, dist.y);
        let towardsThem = distAlong(this.velocity.x, this.velocity.y, dist.x, dist.y);

        let myOrtho = distAlong(this.velocity.x, this.velocity.y, dist.y, -dist.x);
        let theirOrtho = distAlong(other.velocity.x, other.velocity.y, dist.y, -dist.x);

        this.velocity.x = (towardsMe * dist.x + myOrtho * dist.y) * this.restitution;
        this.velocity.y = (towardsMe * dist.y + myOrtho * -dist.x) * this.restitution;
        other.velocity.x = (towardsThem * dist.x + theirOrtho * dist.y) * other.restitution;
        other.velocity.y = (towardsThem * dist.y + theirOrtho * -dist.x) * other.restitution;
    }

    draw(ctx, strokeColor = "black", lineWidth = 2, fillColor = "transparent") {
        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = this.color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
}

function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function normalize(vec) {
    let m = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    return {
        x: vec.x / m,
        y: vec.y / m
    };
}

function distAlong(x, y, xAlong, yAlong) {
    // Normalized dot product
    return (x * xAlong + y * yAlong) / Math.hypot(xAlong, yAlong);
}
