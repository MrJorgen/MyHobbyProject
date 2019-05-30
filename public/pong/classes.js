class Paddle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.moveUp = false;
        this.moveDown = false;
        this.AI = false;
        this.predicted = false;
        this.moveTo = {};
        this.calc = true;
        this.ballClose = false;
    }

    update() {
        if (this.moveUp && this.y > 0) {
            this.y -= paddleSpeed;
            if (this.y < 0) {
                this.y = 0;
            }
        }
        if (this.moveDown && this.y + this.h < height) {
            this.y += paddleSpeed;
            if (this.y + this.h > height) {
                this.y = height - this.h;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }
}

class Ball {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius * 2;
        this.speed = speed;
        this.maxAngle = Math.atan2(height / 2, width / 2);
        let angle = -this.maxAngle + Math.random() * (this.maxAngle * 2);

        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.edges();
    }

    reset(scored) {
        let angle = -this.maxAngle + Math.random() * (this.maxAngle * 2);
        this.y = height / 2;
        this.speed = ballSpeed;
        leftPaddle.ballClose = false;
        rightPaddle.ballClose = false;
        leftPaddle.calc = true;
        rightPaddle.calc = true;


        // Player 1 scored
        if (scored === 1) {
            this.x = paddleMargin;
            player1.score++;
        }

        // Player 2 scored
        else if (scored === 2) {
            angle += Math.PI;
            this.x = width - paddleMargin;
            player2.score++;
        }

        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
    }

    edges() {
        let bounced = false;

        // Left edge passed - Player2 scores
        if (this.x <= 0) {
            this.reset(2);
            return;
        }
        // Right edge passed - Player1 scores
        else if (this.x + this.radius > width) {
            this.reset(1);
            return;
        }

        // Top edge
        if (this.y <= 0) {
            this.y = 0 + Math.abs(this.y);
            this.vy *= -1;
            bounced = true;
        }

        // Bottom edge
        if (this.y + this.radius >= height) {
            let outSideDist = this.y + this.radius - height;
            this.y = height - this.radius - outSideDist;
            this.vy *= -1;
            bounced = true;
        }


        // Right paddle bounce
        if (this.vx > 0) {
            if (this.x + this.radius > rightPaddle.x && this.x < rightPaddle.x + this.radius) {
                // Ball is in paddles top/bottom range
                if (this.y + this.radius >= rightPaddle.y && this.y <= rightPaddle.y + rightPaddle.h) {
                    // let distancePassed = rightPaddle.x - this.x + this.radius; // Needs to be negative since the ball moves backwards
                    this.paddleBounce(rightPaddle);
                    // Reversing
                    // this.x = rightPaddle.x - this.radius - (this.x + this.radius - rightPaddle.x);
                    this.vx *= -1;
                    bounced = true;
                }
            }
        }
        // Left paddle bounce
        else if (this.vx < 0) {
            if (this.x < leftPaddle.x + leftPaddle.w && this.x > leftPaddle.x + leftPaddle.w - this.radius) {
                if (this.y + this.radius >= leftPaddle.y && this.y <= leftPaddle.y + leftPaddle.h) {
                    // let distancePassed = leftPaddle.x + leftPaddle.w - this.x;
                    this.paddleBounce(leftPaddle);
                    // TODO: Something is not right with the "after bounce" placement of the ball...
                    // this.x = leftPaddle.x + leftPaddle.w + (leftPaddle.x + leftPaddle.w - this.x);
                    bounced = true;
                }
            }
        }
        if (bounced) {
            leftPaddle.calc = true;
            rightPaddle.calc = true;
        }
    }

    paddleBounce(paddle) {
        let distanceFromTop = this.y - paddle.y;
        this.speed += ballSpeed * .025;
        let returnAngle = -this.maxAngle + (distanceFromTop / paddle.h) * (this.maxAngle * 2);

        this.vx = Math.cos(returnAngle) * this.speed;
        this.vy = Math.sin(returnAngle) * this.speed;

        // Reset movement if paddle is AI
        if (leftPaddle.AI) {
            leftPaddle.moveDown = false;
            leftPaddle.moveUp = false;
            rightPaddle.ballClose = false;
        }

        if (rightPaddle.AI) {
            rightPaddle.moveDown = false;
            rightPaddle.moveUp = false;
            leftPaddle.ballClose = false;
        }
    }

    draw(ctx) {
        ctx.save();

        // Draw ball rectangular
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.radius, this.radius);

        ctx.restore();
    }
}

class Player {
    constructor() {
        this.score = 0;
        this.wins = false;
    }
}