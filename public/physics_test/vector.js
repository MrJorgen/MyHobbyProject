class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
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