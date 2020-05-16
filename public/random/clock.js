export class Clock {
  constructor(x = 0, y = 0, radius = 0, bgColor = "rgb(128, 128, 128)", markerColor = "rgb(0, 0, 0)") {
    this.center = { x: x, y: y };
    this.radius = radius;
    this.bgColor = bgColor;
    this.markerColor = markerColor;
    this.hands = new Set();
  }

  addHand(typeIndex, length, width, color) {
    let hand = new Hand(typeIndex, length, width, color);
    this.hands.add(hand);
  }

  update() {

  }
}

export class Hand {
  constructor(typeIndex, length = 0, width = 0, color = "rgb(0, 0, 0)") {
    this.length = length;
    this.width = width;
    this.color = color;
    let types = ["Hour", "Minute", "Second"];
    this.type = types[typeIndex];
  }
}