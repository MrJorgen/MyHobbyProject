export class Game {
  constructor(ctx) {
    this.animating = false;
    this.animatingCards = [];
    this.balance = 5000;
    this.bet = 0;
    this.betting = true;
    this.chipOffsets = [];
    this.debug = false;
    this.dealerBlackJack = "Dealer has BlackJack!";
    this.dealerWin = "Dealer win";
    this.draw = "Push ";
    this.duration = 500;
    this.HEIGHT = ctx.canvas.height;
    this.maxBet = 3000;
    this.minBet = 1;
    this.WIDTH = ctx.canvas.width;
    this.over = false;
    this.playerBlackJack = "BlackJack! ";
    this.playerWin = "Win ";
    this.pot = [];
    this.result = "";
    this.settingUp = true;
    this.turn = null;
    this.winner = null;
    this.winAmount = 0;
  }

  reset(player, dealer, deck, chips) {
    // Give delt cards back to the deck
    player.sum = 0;
    dealer.sum = 0;
    player.blackJack = false;
    dealer.blackJack = false;
    deck.reset(player, dealer);
    this.result = "";
    this.settingUp = true;
    this.betting = true;
    this.bet = 0;
    this.pot = [];
    this.winner = null;
    this.winAmount = 0;
    for (let i = 0; i < 20; i++){
      this.chipOffsets[i] = this.WIDTH / 2 - chips[0].img.width * 0.6 + (Math.random() * (chips[0].img.width * 0.2));
    }
  }

  setup(chips) {
    let i = 4;
    for (let chip of chips) {
      if (chip.value == "25") {
        chip.selected = true;
      }
      chip.x = this.WIDTH - chip.img.height * 0.7 - chip.img.height * i * 1.3;
      chip.y = this.HEIGHT - chip.img.height * 0.7;
      i--;
    }
    if (this.debug) { window.game = this };
    for (let i = 0; i < 20; i++){
      this.chipOffsets[i] = this.WIDTH / 2 - chips[0].img.width * 0.6 + (Math.random() * (chips[0].img.width * 0.2));
    }
  }

  displayResult(ctx, deck) {
    let x = this.WIDTH / 2 - deck.height * 1, y = this.HEIGHT / 2 - deck.width * 0.6, w = deck.height * 2, h = deck.width * 1.2, r = 10;
    ctx.save();
    ctx.beginPath();
    // Text background
    ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
    ctx.strokeStyle = `rgba(0, 0, 0, 1)`;
    ctx.lineWidth = 1;
    
    // No rounded corners
    ctx.fillRect(x, y, w, h);

    // With rounded corners
    // ctx.beginPath();
    // ctx.moveTo(x + r, y);
    // ctx.arcTo(x + w, y, x + w, y + h, r);
    // ctx.arcTo(x + w, y + h, x, y + h, r);
    // ctx.arcTo(x, y + h, x, y, r);
    // ctx.arcTo(x, y, x + w, y, r);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();

    // Text
    ctx.strokeStyle = `black`;
    ctx.lineWidth = 1;
    ctx.fillStyle = `white`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = deck.height * 0.4 + "px DIN Condensed";
    if (this.winAmount > 0) {
      ctx.strokeText(this.result + this.winAmount, Math.floor(this.WIDTH / 2), Math.floor(this.HEIGHT / 2));
      ctx.fillText(this.result + this.winAmount, Math.floor(this.WIDTH / 2), Math.floor(this.HEIGHT / 2));
    }
    else {
      ctx.strokeText(this.result, Math.floor(this.WIDTH / 2), Math.floor(this.HEIGHT / 2));
      ctx.fillText(this.result, Math.floor(this.WIDTH / 2), Math.floor(this.HEIGHT / 2));
    }
    ctx.restore();
  }

  drawBetArea(ctx, deck) {
    let radius = 10;
    let betArea = {
      x: this.WIDTH / 2 - deck.height / 2,
      y: this.HEIGHT / 2 - deck.height / 2,
      width: deck.height,
      height: deck.height
    }

    ctx.save();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arcTo(betArea.x + betArea.width / 2, betArea.y, betArea.x + betArea.width, betArea.y, radius);
    ctx.arcTo(betArea.x + betArea.width, betArea.y, betArea.x + betArea.width, betArea.y + betArea.height, radius);
    ctx.arcTo(betArea.x + betArea.width, betArea.y + betArea.height, betArea.x, betArea.y + betArea.height, radius);
    ctx.arcTo(betArea.x, betArea.y + betArea.height, betArea.x, betArea.y, radius);
    ctx.arcTo(betArea.x, betArea.y, betArea.x + betArea.width, betArea.y, radius);
    ctx.closePath();
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.font = "bold " + betArea.height * 0.17 + "px DIN Condensed";
    if (this.betting) {
      ctx.textBaseline = "top";
      ctx.fillText("Place your bet", this.WIDTH / 2, betArea.y + ctx.lineWidth);
    }
    if (this.bet > 0) {
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(this.bet.toString(), this.WIDTH / 2, betArea.y + betArea.height);
    }

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("Balance: " + this.balance.toString(), this.WIDTH * 0.25, this.HEIGHT * 0.98);

    this.pot.forEach((chip, i) => {
      ctx.drawImage(chip.img, chip.x, chip.y);
    });
    ctx.restore();
  }

}