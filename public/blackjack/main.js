"use strict";
import { Button } from "./js/Button.js";
import { Chips } from "./js/Chips.js";
import { Deck } from "./js/Deck.js";
import { Game } from "./js/Game.js";
import { Player } from "./js/Player.js";

document.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.querySelector("#main_canvas"),
    ctx = canvas.getContext("2d"),
    WIDTH = canvas.width = window.innerWidth,
    HEIGHT = canvas.height = window.innerHeight,
    deckProperties = {
      height: Math.floor(HEIGHT / 5),
      width: Math.floor(HEIGHT / 5 / 88 * 63),
      x: WIDTH * 0.85,
      y: HEIGHT * 0.5
    },
    dealer = new Player(WIDTH * 0.4575, HEIGHT * 0.2),
    player = new Player(WIDTH * 0.4575, HEIGHT * 0.8),
    buttons = {
      hit: new Button(WIDTH / 2 - deckProperties.height, HEIGHT - deckProperties.height * 0.4, deckProperties.height * 0.75, deckProperties.height * 0.25, "Hit", "rgb(0, 200, 0)", ctx),
      stand: new Button(WIDTH / 2 + deckProperties.height * 0.25, HEIGHT - deckProperties.height * 0.4, deckProperties.height * 0.75, deckProperties.height * 0.25, "Stand", "rgb(200, 0, 0)", ctx),
      bet: new Button(WIDTH / 2 - deckProperties.height, HEIGHT - deckProperties.height * 0.4, deckProperties.height * 0.75, deckProperties.height * 0.25, "Bet", "rgb(0, 200, 0)", ctx),
      deal: new Button(WIDTH / 2 + deckProperties.height * 0.25, HEIGHT - deckProperties.height * 0.4, deckProperties.height * 0.75, deckProperties.height * 0.25, "Deal", "rgb(200, 0, 0)", ctx)
    },
    game = new Game(ctx),
    deck = new Deck(deckProperties),
    chipSize = deck.width / 2,
    chips = [
      new Chips(1, chipSize),
      new Chips(5, chipSize),
      new Chips(25, chipSize),
      new Chips(100, chipSize),
      new Chips(500, chipSize)
    ];

  let target = null,
    change = null,
    startTime = 0,
    duration = 750;

  ctx.imageSmoothingQuality = "high";
  await deck.createDeck(2, "blue");
  canvas.addEventListener("mousedown", clickListener);
  canvas.addEventListener("mousemove", moveListener);

  game.setup(chips);
  update();

  function update(timer = 0) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    deck.cards[0].draw(ctx, deck.x, deck.y);

    if (!game.betting) {
      if (player.cards.length < 2 && player.cards.length <= dealer.cards.length && !game.animating) {
        game.turn = player;
        startAnimation(player);
      }
      if (dealer.cards.length < 2 && dealer.cards.length < player.cards.length && !game.animating) {
        game.turn = dealer;
        startAnimation(dealer);
      }
      if (game.animating) {
        let { x, y } = animateCard();
        deck.cards[0].draw(ctx, x, y);
      }
      dealer.displayHandValue(ctx, deck);
      player.displayHandValue(ctx, deck);
      dealer.drawCards(ctx, deck);
      player.drawCards(ctx, deck);
    }
    else {
      buttons.bet.draw(ctx);
      buttons.deal.draw(ctx);
      for (let chip of chips) {
        chip.draw(ctx);
      }
    }

    for (let i = game.animatingCards.length - 1; i >= 0; i--) {
      game.animatingCards[i].animate();
      game.animatingCards[i].draw(ctx);
      if (!game.animatingCards[i].animating) {
        if (game.animatingCards[i].callback) {
          game.animatingCards[i].callback();
        }
        game.animatingCards.splice(i, 1);
      }
    }

    game.drawBetArea(ctx, deck);

    if (game.turn == player && !game.settingUp && !game.animating) {
      buttons.hit.draw(ctx);
      buttons.stand.draw(ctx);
      playerPlay();
    }

    if (game.result !== "") {
      game.displayResult(ctx, deck);
    }

    if (game.over) {
      game.over = false;
      clearTable();
      setTimeout(() => {
        game.reset(player, dealer, deck, chips);
      }, duration * 3);
    }
    if (game.debug) {
      drawCenterLines();
    }
    requestAnimationFrame(update);
  }

  function clearTable() {
    setTimeout(() => {
      game.betting = true;
      let dump = { x: -deck.width, y: HEIGHT / 2 };
      for (let i = 0; i < player.cards.length; i++) {
        player.cards[i].animate(player.cards[i], dump);
        game.animatingCards.push(player.cards[i]);
      }
      for (let i = 0; i < dealer.cards.length; i++) {
        dealer.cards[i].animate(dealer.cards[i], dump);
        game.animatingCards.push(dealer.cards[i]);
      }
      for (let i = 0; i < game.pot.length; i++) {
        game.pot[i].animate(game.pot[i], game.winner);
        game.animatingCards.push(game.pot[i]);
      }
    }, duration);
  }

  function dealerPlay() {
    if (dealer.sum < 17) {
      if (!dealer.cards[1].revealed) {
        setTimeout(() => {
          dealer.cards[1].revealed = true;
          dealer.calcSum();
          setTimeout(dealerPlay, duration);
        }, duration);
      }
      else {
        startAnimation(dealer, dealerPlay);
      }

    }
    else {
      if ((dealer.sum === 21) && dealer.cards.length === 2) {
        game.winner = dealer;
        game.result = game.dealerBlackJack;
      }
      if ((player.sum > dealer.sum && player.sum <= 21) || (dealer.sum > 21 && player.sum <= 21)) {
        game.winner = player;
        game.result = game.playerWin;
        game.winAmount = game.bet * 2;
        game.balance += game.bet * 2;
      }
      if (player.sum == dealer.sum || (player.sum > 21 && dealer.sum > 21)) {
        game.result = game.draw;
        game.balance += game.bet;
        game.winAmount = game.bet;
        game.winner = null;
      }
      if ((player.sum < dealer.sum && dealer.sum <= 21) || (player.sum > 21 && dealer.sum <= 21)) {
        game.winAmount = 0;
        game.winner = dealer;
        game.result = game.dealerWin;
      }
      game.over = true;
    }
  }

  function playerPlay() {
    if (player.sum == 21 && player.cards.length == 2 && !game.animating) {
      player.blackJack = true;
      game.winner = player;
      game.result = game.playerWin;
      game.balance += game.bet * 2.5;
      game.winAmount = game.bet * 2.5;
      game.turn = dealer;
      game.over = true;
    }
    if (player.sum > 21) {
      game.winner = dealer;
      game.result = game.dealerWin;
      game.turn = dealer;
      game.over = true;
    }
  }

  function animateCard() {
    let time = new Date() - startTime, x, y;
    if (time < duration) {
      x = easeInOutQuad(time, deck.x, change.x, duration);
      y = easeInOutQuad(time, deck.y, change.y, duration);
    }
    else {
      x = target.x;
      y = target.y;
      game.animating = false;

      // Dealers second card is not revealed
      if (game.turn == dealer && dealer.cards.length == 1) {
        dealer.dealCard(deck, false);
        game.turn = player;
        game.settingUp = false;
      }
      else {
        game.turn.dealCard(deck);
      }

      if (game.callback) {
        setTimeout(game.callback, duration);
      }
    }
    return { x, y };
  }

  function startAnimation(who, callback = null) {
    game.animating = true;
    game.callback = callback;
    startTime = new Date();
    target = {
      x: who.x + ((deck.width * 1.15) * who.cards.length),
      y: who.y
    }
    change = { x: target.x - deck.x, y: target.y - deck.y };
  }

  function moveListener(e) {
    const pos = {
      x: e.clientX,
      y: e.clientY
    };
    let hover = false;

    // Check if hovering hit or stay button
    if (game.turn == player && !game.settingUp) {
      [buttons.hit, buttons.stand].forEach((button) => {
        button.hover = false;
        if (pos.x >= button.x && pos.x <= button.x + button.width && pos.y >= button.y && pos.y <= button.y + button.height) {
          hover = true;
          button.hover = true;
        }
      });
    }

    // Check if hovering bet or deal button
    if (game.betting) {
      [buttons.bet, buttons.deal].forEach((button) => {
        button.hover = false;
        if (pos.x >= button.x && pos.x <= button.x + button.width && pos.y >= button.y && pos.y <= button.y + button.height) {
          hover = true;
          button.hover = true;
        }
      });
    }

    for (let chip of chips) {
      if (pos.x >= chip.x - chip.img.width / 2 && pos.x <= chip.x + chip.img.width / 2 &&
        pos.y >= chip.y - chip.img.height / 2 && pos.y <= chip.y + chip.img.height / 2) {
        hover = true;
        chip.hover = true;
      }
      else {
        chip.hover = false;
      }
    }
    if (hover) {
      canvas.style.cursor = "pointer";
    }
    else {
      canvas.style.cursor = "default";
    }
  }

  function clickListener(e) {
    const pos = {
      x: e.clientX,
      y: e.clientY
    };
    let grabStart = new Date(), cursor = "pointer";
    if (game.turn == player && !game.settingUp) {
      // Check if "Hit" button is clicked
      if (pos.x >= buttons.hit.x && pos.x <= buttons.hit.x + buttons.hit.width && pos.y >= buttons.hit.y && pos.y <= buttons.hit.y + buttons.hit.height) {
        buttons.hit.hover = false;
        startAnimation(player, playerPlay);
      }
      // Check if "Stay" button is clicked
      if (pos.x >= buttons.stand.x && pos.x <= buttons.stand.x + buttons.stand.width && pos.y >= buttons.stand.y && pos.y <= buttons.stand.y + buttons.stand.height) {
        buttons.stand.hover = false;
        game.turn = dealer;
        dealerPlay();
      }
    }
    // Start of round. Place bets and deal cards
    if (game.betting) {
      // Check if "Bet" button is clicked
      if (pos.x >= buttons.bet.x && pos.x <= buttons.bet.x + buttons.bet.width && pos.y >= buttons.bet.y && pos.y <= buttons.bet.y + buttons.bet.height) {
        for (let chip of chips) {
          if (chip.selected && game.balance - chip.value >= 0 && game.bet + chip.value <= game.maxBet) {
            let animChip = new Chips(chip.value, chip.size);
            animChip.animate(chip, { x: WIDTH / 2, y: HEIGHT / 2 }, 500);
            game.animatingCards.push(animChip);
            game.bet += chip.value;
            game.balance -= chip.value;
            Chips.addToPot(game, chip);
          };
        }

      }
      // Check if "Deal" button is clicked
      if (pos.x >= buttons.deal.x && pos.x <= buttons.deal.x + buttons.deal.width && pos.y >= buttons.deal.y && pos.y <= buttons.deal.y + buttons.deal.height) {
        if (game.bet > 0) {
          buttons.deal.hover = false;
          game.betting = false;
        }
      }
    }
    chips.forEach((chip, index) => {
      if (pos.x >= chip.x - chip.img.width / 2 && pos.x <= chip.x + chip.img.width / 2 &&
          pos.y >= chip.y - chip.img.height / 2 && pos.y <= chip.y + chip.img.height / 2) {
            Chips.update(chips, index);
      }
    })
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

  function drawCenterLines() {
    ctx.save();
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.moveTo(0, HEIGHT / 2);
    ctx.lineTo(WIDTH, HEIGHT / 2);
    ctx.stroke();
    ctx.restore();
  }
})