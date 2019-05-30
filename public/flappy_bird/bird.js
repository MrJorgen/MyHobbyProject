class Bird {
    constructor(x, y, colorIndex) {
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.offset = 0;
        this.images = sprites.bird[colorIndex]; // 0 = yellow, 1 = blue, 2 = red
        this.image = this.images[0];
        this.tick = 0;
        this.images.push(this.images[1]);
        this.active = false;
        this.angle = 0;
        this.crashed = false;
        this.dead = false;
        this.blink = 0;
        let self = this;
        window.addEventListener("keydown", function (event) {
            if (event.keyCode == 32 && !event.repeat) {
                self.jump();
            }
        });
        window.addEventListener("touchstart", function () {
            self.jump();
        });
    }

    update(pipes) {
        if (this.active) {
            this.offset = 0; // Stop the hover movement
            this.vy += .33; // Gravity
        }
        // Hover animation
        if (!this.active && !this.dead) {
            this.offset = Math.round(Math.sin(this.tick / 8) * 4);
        }
        this.y += this.vy; // Add velocity to position
        this.tick++; // For animating the bird wings
        this.image = this.images[Math.floor(this.tick / 6) % 4]; // Set flap animation images
        // Angle up at jump
        if (this.vy < 0 && this.angle > -0.05 * Math.PI) {
            this.angle += this.vy / 100;
        }
        // Angle down at dive
        if (this.vy > 0 && this.angle < 0.5 * Math.PI) {
            this.angle += this.vy / 200;
            if (this.angle > 0.5) { this.angle = 0.5 };
        }
        // Check for collision
        this.collide(pipes);
        // Check if bird hit the ground
        if (this.y > (height - sprites.foreGround.height - this.image.height / 2)) {
            this.dead = true;
            this.active = false;
            // Set correct position of the bird
            this.y = height - sprites.foreGround.height - this.image.height / 2;
            if (!this.crashed) {
                sfx.hit.currentTime = 0;
                sfx.hit.play();
            }
            this.crashed = true;
        }
    }

    // Draw bird to canvas
    draw(ctx, x, y) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI * this.angle);
        ctx.drawImage(spriteSheet, this.image.x, this.image.y, this.image.width, this.image.height, 0 - (this.image.width / 2), 0 - (this.image.height / 2) + this.offset, this.image.width, this.image.height);
        ctx.restore();
    }

    // Jump and starts the game(exit intro)
    jump() {
        this.active = true;
        if (!this.crashed) {
            this.vy = -6.3;
            sfx.wing.currentTime = 0;
            sfx.wing.play();
        }
    }

    // Chack for collision with pipe
    collide(pipes) {
        // Set borders of the bird
        let bird = {
            left: this.x - (this.image.width / 2), right: this.x + (this.image.width / 2),
            top: this.y - (this.image.height / 2), bottom: this.y + (this.image.height / 2)
        };
        for (let i = 0; i < pipes.length; i++) {
            // Set borders of the current pipe
            let currentPipe = {
                left: pipes[i].x, right: pipes[i].x + sprites.pipe.green.top.width,
                top: pipes[i].y - 50, bottom: pipes[i].y + 50
            };
            // Check for collision
            if (!this.crashed) {
                if (bird.right > currentPipe.left && bird.left < currentPipe.right) {
                    if (bird.top < currentPipe.top || bird.bottom > currentPipe.bottom) {
                        console.log("Crashed!", pipes[i], this);
                        this.blink = 6;
                        this.crashed = true;
                        sfx.hit.currentTime = 0;
                        sfx.hit.play();
                        setTimeout(() => {
                            sfx.die.currentTime = 0;
                            sfx.die.play();
                        }, 250);
                    }
                }
            }
        }
    }
}