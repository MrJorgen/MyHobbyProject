import { Entity } from "./Entity.js";

export class Chips extends Entity {
  constructor(value, size = 84) {
    super();
    this.scale = 1;
    this.selected = false;
    this.hover = false;
    this.value = value;
    this.color = colors[this.value];
    this.size = size;
    this.img = this.createImg();
  }

  createImg() {
    let cnv = document.createElement("canvas"),
      ctx = cnv.getContext("2d");
    cnv.width = this.size;
    cnv.height = this.size;
    ctx.font = "bold " + cnv.height / 3 + "px DIN Condensed";
    let img = document.querySelector("#imgPreload");
    ctx.drawImage(img, this.color.img * 84, 0, 84, 84, 0, 0, this.size, this.size);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.value.toString(), cnv.width / 2, (cnv.height / 2) + 1);
    return cnv;
  }

  draw(ctx) {
    if (this.selected) { this.scale = 1.3 }
    else if (this.hover) { this.scale = 1.15 }
    else { this.scale = 1 };
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);
    let offSet = (this.scale - 1) * 0.7;
    ctx.drawImage(this.img, -(this.img.width / 2), -((this.img.height / 2) * (1 + offSet)), this.img.width, this.img.height);
    ctx.restore();
  }
  
  static update(chips, index) {
    chips.forEach((chip, i) => {
      if (i === index) {
        chip.selected = true;
      }
      else {
        chip.selected = false;
      }
    });
  }

  static addToPot(game, chip) {
    let currentPot = 0 + game.bet;
    game.pot = [];
    [500, 100, 25, 5, 1].forEach((val) => {
      while (currentPot >= val) {
        game.pot.push(new Chips(val, chip.img.width));
        currentPot -= val;
      }
    });
    game.pot.forEach((chip, i) => {
      chip.x = game.chipOffsets[i];
      chip.y = game.HEIGHT / 2 - chip.img.height * 0.2 - (i * chip.img.height * 0.1);
    });
  }
}

const colors = {
  1: {
    color: "rgb(30, 95, 140)",
    img: 0
  },
  5: {
    color: "rgb(48, 136, 31)",
    img: 1
  },
  25: {
    color: "rgb(165, 35, 0)",
    img: 2
  },
  100: {
    color: "rgb(40, 40, 40)",
    img: 3
  },
  500: {
    color: "rgb(133, 31, 137)",
    img: 4
  },
};
