import { Player } from "./Player.js";

export class Entity{
  constructor() {
    this.x = 0;
    this.y = 0;
    this.animating = false;
    this.duration = 750;
    this.animatingStartTime = null;
    this.start = null;
    this.change = null;
    this.target = null;
  }
  
  animate(start, end) {
    if (!this.animating) {
      this.startAnimation(start, end);
    }
    let time = new Date() - this.animatingStartTime;
    if (time < this.duration) {
      this.x = easeInOutQuad(time, this.start.x, this.change.x, this.duration);
      this.y = easeInOutQuad(time, this.start.y, this.change.y, this.duration);
      return true;
    }
    else {
      this.animating = false;
      this.animatingStartTime = null;
      ({ x: this.x, y: this.y } = this.target);
      this.target = null;
      this.change = null;
    }
    return false;
  }

  startAnimation(start, end) {
    this.animating = true;
    this.animatingStartTime = new Date();
    this.start = {
      x: start.x,
      y: start.y
    }
    if (end instanceof Player) {
      this.target = {
        x: end.x + ((this.img.width * 1.15) * end.cards.length),
        y: end.y
      }
    }
    else {
      this.target = { x: end.x, y: end.y };
    }
    this.change = { x: this.target.x - this.start.x, y: this.target.y - this.start.y };
  }

}

// quadratic easing in - accelerating from zero velocity
// t: current time, b: beginning value, c: change in value, d: duration
// t and d can be in frames or seconds/milliseconds
function easeInQuad(t, b, c, d) {
  return c * (t /= d) * t + b;
};

// quadratic easing out - decelerating to zero velocity
function easeOutQuad(t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
};

// quadratic easing in/out - acceleration until halfway, then deceleration
function easeInOutQuad(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
};
