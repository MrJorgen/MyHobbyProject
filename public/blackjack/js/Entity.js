import { Player } from "./Player.js";

export class Entity {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.animating = false;
    this.duration = 750;
    this.animationStartTime = null;
    this.start = null;
    this.change = null;
    this.target = null;
  }

  animate(start, end) {
    if (!this.animating) {
      this.startAnimation(start, end);
    }
    let time = new Date() - this.animationStartTime;
    if (time < this.duration) {
      this.x = easeInOutQuad(time, this.start.x, this.change.x, this.duration);
      this.y = easeInOutQuad(time, this.start.y, this.change.y, this.duration);
    }
    else {
      this.x = this.target.x;
      this.y = this.target.y;
      if (this.player) {
        this.player.dealCard(this.deck);
        this.player.animating = false;
        this.player.revealNextCard = true;
      }
      this.player = null;
      this.animating = false;
      this.animationStartTime = null;
      this.target = null;
      this.change = null;
      this.deck = null;
    }
  }

  startAnimation(start, end) {
    try {
      this.animating = true;
      this.animationStartTime = new Date();
      this.start = {
        x: start.x,
        y: start.y
      }
      if (end instanceof Player) {
        let x = end.x + ((this.width * 1.15) * end.cards.length), y = end.y;
        this.target = { x, y };

        this.player = end;
        this.deck = start;
      }
      else {
        this.target = { x: end.x, y: end.y };
      }
      this.change = { x: this.target.x - this.start.x, y: this.target.y - this.start.y };
    }
    catch (e) {
      console.log(e);
      console.log(start, end);
      
    }
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
