import { Card } from "./Card.js";

export class Deck {
  constructor(dim) {
    this.x = dim.x;
    this.y = dim.y;
    this.width = dim.width;
    this.height = dim.height;
    this.cards = [];
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.cards[i].revealed = false;
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  sort() {
    let Hearts = this.cards.filter(a => a.suit == "Hearts");
    Hearts.sort((a, b) => a.value - b.value);

    let Spades = this.cards.filter(a => a.suit == "Spades");
    Spades.sort((a, b) => a.value - b.value);

    let Diamonds = this.cards.filter(a => a.suit == "Diamonds");
    Diamonds.sort((a, b) => a.value - b.value);

    let Clubs = this.cards.filter(a => a.suit == "Clubs");
    Clubs.sort((a, b) => a.value - b.value);

    this.cards = Hearts.concat(Spades, Diamonds, Clubs);
  }

  deal(revealed = true) {
    let tmpCard = this.cards.splice(0, 1)[0];
    tmpCard.revealed = revealed;
    return tmpCard;
  }

  reset(player, dealer) {
    this.cards = this.cards.concat(player.cards.splice(0, player.cards.length), dealer.cards.splice(0, dealer.cards.length));
    this.shuffle();
  }

  async createDeck(count = 1, backColor = "red") {
    for (let i = 0; i < count; i++) {
      for (let color of cards.suits) {
        for (let rank in cards.ranks) {
          let tmpImage = await loadImage(`./img/deck/${color}/${rank}.svg`);
          let backImage = await loadImage(`./img/deck/back/${backColor}.svg`);
          let currentCard = new Card(color, rank, tmpImage, cards.ranks[rank].value, backImage);
          currentCard.width = this.width;
          currentCard.height = this.height;
          currentCard.x = this.x;
          currentCard.y = this.y;
          this.cards.push(currentCard);
        }
      }
    }
    this.shuffle();
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  })
}

const cards = {
  suits: ["Clubs", "Hearts", "Diamonds", "Spades"],
  ranks: {
    "Ace": { value: 11 },
    "2": { value: 2 },
    "3": { value: 3 },
    "4": { value: 4 },
    "5": { value: 5 },
    "6": { value: 6 },
    "7": { value: 7 },
    "8": { value: 8 },
    "9": { value: 9 },
    "10": { value: 10 },
    "Jack": { value: 10 },
    "Queen": { value: 10 },
    "King": { value: 10 }
  }
}
