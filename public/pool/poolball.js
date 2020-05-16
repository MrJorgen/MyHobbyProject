class PoolBall extends Particle {
    constructor(x, y) {
        super(x, y);
        //this.color = randomColor();
        //this.color = randomBaseColor();
        this.velocity = new Vector(0, 0);
        this.radius = randomNumber(50, 100);
        this.friction = 0.993;
    }
    edges(width, height, wallSize, tableArea) {
        let tableX = tableArea.x || 0, tableY = tableArea.y || 0;
        if (this.x + this.radius > width - wallSize &&
            this.y + (this.radius / 2) > wallSize + wallSize * (Math.PI / 2) &&
            this.y - (this.radius / 2) < height - (wallSize + wallSize * (Math.PI / 2))) { // right wall
            this.vx = -this.vx * .9;
            this.velocity.x = -this.velocity.x * .9;
            this.x -= this.x + this.radius - (width - wallSize);

        }
        if (this.x - this.radius < tableX + wallSize) { // left wall
            this.vx = -this.vx * .9;
            this.velocity.x = -this.velocity.x * .9;
            this.x -= this.x - this.radius - wallSize - tableX;
        }
        if (this.y + this.radius > height - wallSize) { // bottom
            this.vy = -this.vy * .9;
            this.velocity.y = -this.velocity.y * .9;
            this.y -= this.y + this.radius - (height - wallSize);
        }
        if (this.y - this.radius < tableY + wallSize) { // left wall
            this.vy = -this.vy * .9;
            this.velocity.y = -this.velocity.y * .9;
            this.y -= this.y - this.radius - wallSize - tableY;
        }
    }
    draw(context) {
        let img = new Image(this.radius, this.radius);
        img.src = "img/ball" + this.index + ".png";
        img.width = this.radius * 2;
        img.height = this.radius * 2;
        this.img = img;
        context.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        /*
                if (this.index < 9) {
                    context.save();
                    context.lineWidth = 1;
                    context.fillStyle = this.color;
                    context.beginPath();
                    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    context.closePath();
                    context.fill();
                    let grd = context.createRadialGradient(this.x - 25, this.y - 25, 0, this.x, this.y, this.radius);
                    // grd.addColorStop(0, this.color);
                    grd.addColorStop(0, "rgba(255, 255, 255, 0.8");
                    grd.addColorStop(1, "rgba(0, 0, 0, 0.3");
                    context.fillStyle = grd;
                    context.strokeStyle = "#000";
                    context.beginPath();
                    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    context.closePath();
                    context.fill();
                }
                else {
                    context.save();
                    context.lineWidth = 1;
                    let grd = context.createRadialGradient(this.x - 25, this.y - 25, 0, this.x - 10, this.y - 10, this.radius);
                    grd.addColorStop(0, "rgba(255, 255, 255, 0.7");
                    grd.addColorStop(1, "rgba(0, 0, 0, 0.4");
                    context.fillStyle = "white";
                    context.beginPath();
                    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    context.closePath();
                    context.fill();
        
                    context.save();
                    context.fillStyle = this.color;
                    context.beginPath();
                    context.arc(this.x, this.y, this.radius, 1.8 * Math.PI, Math.PI * 1.2);
                    context.closePath();
                    context.fill();
        
                    context.save();
                    context.fillStyle = "white";
                    context.beginPath();
                    context.arc(this.x, this.y, this.radius, 0.2 * Math.PI, Math.PI * 0.8);
                    context.closePath();
                    context.fill();
        
                    context.fillStyle = grd;
                    context.strokeStyle = "#000";
                    context.beginPath();
                    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    context.closePath();
                    context.fill();
        
                }
                context.stroke();
                if (this.index > 0) {
                    context.beginPath();
                    context.fillStyle = "rgba(255, 255, 255, .8";
                    context.arc(this.x, this.y, this.radius / 2.5, 0, Math.PI * 2);
                    context.closePath();
                    context.fill();
                    context.fillStyle = "black";
                    context.textBaseline = "middle";
                    context.textAlign = "center";
                    context.font = "bolder " + Math.floor(this.radius / 2) + "px Verdana";
                    context.fillText(this.index, this.x, this.y);
                }
                //context.shadowColor = "rgba(0, 0, 0, 0.5";
                context.restore();
                */
    }
}