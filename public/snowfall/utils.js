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