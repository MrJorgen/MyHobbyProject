class vector {
    constructor(
        x = 0,
        y = 0,
    ) {
        this.x = x;
        this.y = y;
    }

    setAngle(angle) {
        let length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    setDegree(degree) {
        let angle = Math.PI * degree / 180,
            length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    setLength(length) {
        let angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    add(v2) {
        return vector.create(this.x + v2.getX(), this.y + v2.getY());
    }

    subtract(v2) {
        return vector.create(this.x - v2.getX(), this.y - v2.getY());
    }

    multiply(value) {
        return vector.create(this.x * value, this.y * value);
    }

    divide(value) {
        return vector.create(this.x / value, this.y / value);
    }

    addTo(v2) {
        this.x += v2.getX();
        this.y += v2.getY();
    }

    subtractFrom(v2) {
        this.x -= v2.getX();
        this.y -= v2.getY();
    }

    multiplyBy(value) {
        this.x *= value;
        this.y *= value;
    }

    divideBy(value) {
        this.x /= value;
        this.y /= value;
    }
};