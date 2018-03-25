/*
https://codepen.io/dissimulate/pen/LzifE

Copyright (c) 2013 dissimulate at codepen

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/

document.getElementById('close').onmousedown = function (e) {
    e.preventDefault();
    document.getElementById('info').style.display = 'none';
    return false;
};

let NUM_BALLS = 5,
    DAMPING = 0.8,
    GRAVITY = 1,
    MOUSE_SIZE = 50,
    SPEED = 1,
    FRICTION = .04;

let canvas, ctx, TWO_PI = Math.PI * 2, balls = [], mouse = { down: false, x: 0, y: 0 },
    width = 0, height = 0, randomRadius = { min: 0, max: 100 };

window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;

        this.px = x;
        this.py = y;

        this.fx = 0;
        this.fy = 0;

        this.radius = radius;
    }
    apply_force(delta) {
        delta *= delta;

        this.fy += GRAVITY;

        // FRICTION
        let vx = this.px - this.x,
            vy = this.py - this.y;
        this.x += vx * FRICTION * delta;
        this.y += vy * FRICTION * delta;
        // --------------------

        this.x += this.fx * delta;
        this.y += this.fy * delta;

        this.fx = this.fy = 0;
    }
    verlet() {
        let nx = (this.x * 2) - this.px;
        let ny = (this.y * 2) - this.py;

        this.px = this.x;
        this.py = this.y;

        this.x = nx;
        this.y = ny;
    }
    draw(ctx) {
        ctx.strokeStyle = "rgba(0, 0, 0, 0.33)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.fill();
        ctx.stroke();
    }
}

let resolve_collisions = function (ip) {

    let i = balls.length;

    while (i--) {

        let ball_1 = balls[i];

        if (mouse.down) {

            let diff_x = ball_1.x - mouse.x;
            let diff_y = ball_1.y - mouse.y;
            let dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
            let real_dist = dist - (ball_1.radius + MOUSE_SIZE);

            if (real_dist < 0) {

                let depth_x = diff_x * (real_dist / dist);
                let depth_y = diff_y * (real_dist / dist);

                ball_1.x -= depth_x * 0.005;
                ball_1.y -= depth_y * 0.005;
            }
        }

        let n = balls.length;

        while (n--) {

            if (n == i) continue;

            let ball_2 = balls[n];

            let diff_x = ball_1.x - ball_2.x;
            let diff_y = ball_1.y - ball_2.y;

            let length = diff_x * diff_x + diff_y * diff_y;
            let dist = Math.sqrt(length);
            let real_dist = dist - (ball_1.radius + ball_2.radius);

            if (real_dist < 0) {

                // Get the last added velocity
                let vel_x1 = ball_1.x - ball_1.px;
                let vel_y1 = ball_1.y - ball_1.py;
                let vel_x2 = ball_2.x - ball_2.px;
                let vel_y2 = ball_2.y - ball_2.py;

                // Split balls if they overlap
                let depth_x = diff_x * (real_dist / dist);
                let depth_y = diff_y * (real_dist / dist);

                ball_1.x -= depth_x * 0.5;
                ball_1.y -= depth_y * 0.5;

                ball_2.x += depth_x * 0.5;
                ball_2.y += depth_y * 0.5;
                // ----------------

                if (ip) {

                    let pr1 = DAMPING * (diff_x * vel_x1 + diff_y * vel_y1) / length,
                        pr2 = DAMPING * (diff_x * vel_x2 + diff_y * vel_y2) / length;

                    vel_x1 += pr2 * diff_x - pr1 * diff_x;
                    vel_y1 += pr2 * diff_y - pr1 * diff_y;

                    vel_x2 += pr1 * diff_x - pr2 * diff_x;
                    vel_y2 += pr1 * diff_y - pr2 * diff_y;

                    ball_1.px = ball_1.x - vel_x1;
                    ball_1.py = ball_1.y - vel_y1;

                    ball_2.px = ball_2.x - vel_x2;
                    ball_2.py = ball_2.y - vel_y2;
                }
            }
        }
    }
};

let check_walls = function () {

    let i = balls.length;

    while (i--) {

        let ball = balls[i],
            vel_x = ball.px - ball.x,
            vel_y = ball.py - ball.y;

        if (ball.x < ball.radius) {

            ball.x = ball.radius;
            ball.px = ball.x - vel_x * DAMPING;

        } else if (ball.x + ball.radius > canvas.width) {

            ball.x = canvas.width - ball.radius;
            ball.px = ball.x - vel_x * DAMPING;
        }

        if (ball.y < ball.radius) {

            ball.y = ball.radius;
            ball.py = ball.y - vel_y * DAMPING;

        } else if (ball.y + ball.radius > canvas.height) {

            ball.y = canvas.height - ball.radius;
            ball.py = ball.y - vel_y * DAMPING;
        }
    }
};

let update = function () {

    let time = new Date().getTime();

    let iter = 6;

    let delta = SPEED / iter;

    while (iter--) {

        let i = balls.length;

        while (i--) {

            balls[i].apply_force(delta);
            balls[i].verlet();
        }

        resolve_collisions();
        check_walls();

        i = balls.length;
        while (i--) balls[i].verlet();

        resolve_collisions(1);
        check_walls();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(27,155,244,0.3)';

    let i = balls.length;
    while (i--) balls[i].draw(ctx);

    if (mouse.down) {

        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_SIZE, 0, TWO_PI);
        ctx.fill();
        ctx.stroke();
    }

    requestAnimFrame(update);

    console.log(new Date().getTime() - time);
};

let add_ball = function (x, y, r) {

    x = x || Math.random() * (canvas.width - 60) + 30,
        y = y || Math.random() * (canvas.height - 60) + 30,
        r = r || randomRadius.min + (Math.random() * (randomRadius.max - randomRadius.min)),
        s = true,
        i = balls.length;

    while (i--) {

        let ball = balls[i];
        let diff_x = ball.x - x;
        let diff_y = ball.y - y;
        let dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

        if (dist < ball.radius + r) {
            s = false;
            break;
        }
    }

    if (s) balls.push(new Ball(x, y, r));
};

window.onload = function () {

    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');

    canvas.width = width = window.innerWidth;
    canvas.height = height = window.innerHeight;

    randomRadius = { min: width / 100, max: width / 50 };

    MOUSE_SIZE = (randomRadius.min + randomRadius.max) / 2;

    while (NUM_BALLS--) add_ball();

    canvas.onmousedown = function (e) {

        if (e.which == 1) {

            add_ball(mouse.x, mouse.y);

        } else if (e.which == 3) {

            mouse.down = true;
            document.body.style.cursor = 'none';
        }

        e.preventDefault();
    };

    canvas.onmouseup = function (e) {

        if (e.which == 3) {

            mouse.down = false;
            document.body.style.cursor = 'default';
        }

        e.preventDefault();
    };

    canvas.onmousemove = function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    canvas.onmouseout = function (e) {

        mouse.down = false;
        document.body.style.cursor = 'default';
    };

    canvas.oncontextmenu = function (e) {

        e.preventDefault();
        return false;
    };

    update();
};