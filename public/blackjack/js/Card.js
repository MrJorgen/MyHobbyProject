import { Entity } from "./Entity.js";

export class Card extends Entity {
  constructor(suit, rank, img, value, backImg) {
    super();
    this.suit = suit;
    this.rank = rank;
    this.value = value;
    this.revealed = false;
    if (this.suit == "Clubs" || this.suit == "Spades") {
      this.color = "black";
    }
    else {
      this.color = "red";
    }
    this.img = img;
    this.backImg = backImg;
  }

  reveal() {
    this.revealed = true;
  }

  draw(ctx, x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
    if (this.revealed) {
      ctx.drawImage(this.img, Math.floor(this.x - (this.width / 2)), Math.floor(this.y - (this.height / 2)), this.width, this.height);
    }
    else {
      ctx.drawImage(this.backImg, Math.floor(this.x - (this.width / 2)), Math.floor(this.y - (this.height / 2)), this.width, this.height);
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