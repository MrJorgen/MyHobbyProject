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

  draw(ctx) {
    if (this.revealed) {
      ctx.drawImage(this.img, Math.floor(this.x - (this.width / 2)), Math.floor(this.y - (this.height / 2)), this.width, this.height);
    }
    else {
      ctx.drawImage(this.backImg, Math.floor(this.x - (this.width / 2)), Math.floor(this.y - (this.height / 2)), this.width, this.height);
    }
  }
}