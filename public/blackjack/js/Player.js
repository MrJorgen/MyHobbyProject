export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.cards = [];
    this.sum = 0;
    this.aces = 0;
    this.blackJack = false;
  }

  calcSum() {
    this.sum = 0, this.aces = 0;
    this.cards.forEach(card => {
      if (card.revealed) {
        this.sum += card.value;
        if (card.value == 11) {
          this.aces++;
        }
      }
    });
    while (this.sum > 21 && this.aces > 0) {
      this.sum -= 10;
      this.aces--;
    }
  }

  dealCard(deck, revealed) {
    this.cards.push(deck.deal(revealed));
    this.calcSum();
  }

  drawCards(ctx, deck) {
    for (let i = 0; i < this.cards.length; i++) {
      if (!this.cards[i].animating) {
        this.cards[i].draw(ctx, this.x + ((this.cards[i].width * 1.15) * i), this.y);
      }
    }
  }

  displayHandValue(ctx, deck) {
    let WIDTH = ctx.canvas.width, HEIGHT = ctx.canvas.height;
    let x = WIDTH / 2, y = (HEIGHT / 2) - (Math.sign(HEIGHT / 2 - this.y)) * HEIGHT / 6;
    ctx.save();
    ctx.fillStyle = `white`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = deck.height / 6 + "px DIN Condensed";
    ctx.fillText(this.sum, x, y);
    ctx.restore();
  }

  animate(game, deck) {
    game.animatingCards.push(deck.cards[0]);
    deck.cards[0].animate(deck, this);
  }
}