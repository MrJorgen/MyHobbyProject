import { ChessBoard } from "./Board.js";
import { GuideLayer } from "./GuideLayer.js";
import { loadImage, themes } from "./utilities.js";

const infoDiv = document.querySelector("#info"),
  messageEle = document.querySelector("#message"),
  canvas = document.querySelector("#bgCanvas"),
  bgCtx = canvas.getContext("2d"),
  canvas2 = document.querySelector("#layerCanvas"),
  guideCtx = canvas2.getContext("2d"),
  canvas3 = document.querySelector("#piecesCanvas"),
  piecesCtx = canvas3.getContext("2d"),
  animCanvas = document.querySelector("#animCanvas"),
  animCtx = animCanvas.getContext("2d");

let mouse = { x: 0, y: 0, dragging: false },
  size = Math.floor(Math.min(window.innerWidth, window.innerHeight) * (1 / 11)),
  theme = "brown";

const squareSize = size - (size % 2),
  startPos = size / 2;

size = squareSize * 9;

// For displaying captured pieces
let root = document.documentElement,
  blackStatus = document.querySelector("#blackStatus"),
  whiteStatus = document.querySelector("#whiteStatus");
root.style.setProperty("--size", size + "px");
root.style.setProperty("--square-size", squareSize + "px");
//   margin-left: calc(var(--square-size) * -0.4);

canvas.width = canvas2.width = canvas3.width = animCanvas.width = size;
canvas.height = canvas2.height = canvas3.height = animCanvas.height = size;
let settings = {
  theme: themes.pieces[2],
  ai: {
    white: false,
    black: true,
  },
  squareSize,
};

// Make the board
const board = new ChessBoard(piecesCtx, settings);
// Load pieces etc
await board.setup(themes.pieces[2]);

const guides = new GuideLayer(guideCtx, squareSize);
drawBackground(false);

// let stop = performance.now();
// let start = performance.now();
// console.log("It took " + (stop - start) + " ms for the AI to make it's move");
if (!settings.ai.black || !settings.ai.white) {
  setupEventListeners();
}

function setupEventListeners() {
  animCanvas.addEventListener("mousedown", grabPiece);
  animCanvas.addEventListener("mousemove", handleMouseMove);
  animCanvas.addEventListener("mouseup", dropPiece);
}

animCanvas.addEventListener("contextmenu", (event) => event.preventDefault());

if (settings.ai.white) {
  makeAiMove(board.players.white);
}

function grabPiece(evt) {
  if (evt.which === 3) {
    evt.preventDefault();
    board.unMakeMove();
    guides.clearAll();
    board.redraw();
    board.turn = board.turn === "black" ? "white" : "black";
    if (board.players[board.turn].ai) {
      setTimeout(() => {
        grabPiece(evt);
      }, 250);
      // makeAiMove(board.players[board.turn]);
    } else {
      setupEventListeners();
    }
    return;
  }
  let coords = {
    x: Math.floor((mouse.x - startPos) / squareSize),
    y: Math.floor((mouse.y - startPos) / squareSize),
  };

  // Grabbing a piece
  if (board.pieces[coords.x][coords.y]?.color === board.turn) {
    mouse.dragging = true;
    mouse.piece = {
      x: coords.x,
      y: coords.y,
      img: board.pieces[coords.x][coords.y].img,
    };

    board.clearSquare(coords);
    animCtx.drawImage(mouse.piece.img, mouse.x - startPos, mouse.y - startPos, squareSize, squareSize);

    // Draw guides showing the possible moves
    for (let move of board.pieces[coords.x][coords.y].legalMoves) {
      if (move.capture) {
        guides.moveToCapture(move.to);
      } else {
        guides.moveToEmpty(move.to);
      }
    }
  }
}

async function dropPiece(evt) {
  // Dropping a piece on the board
  if (mouse.dragging) {
    let opponent = board.turn === "black" ? "white" : "black";
    let moveIsLegal = false;
    let coords = {
      x: Math.floor((mouse.x - startPos) / squareSize),
      y: Math.floor((mouse.y - startPos) / squareSize),
    };

    // Check if the square is in the array of legal moves
    let currentMove = undefined;
    for (let i = 0; i < board.pieces[mouse.piece.x][mouse.piece.y].legalMoves.length; i++) {
      if (board.pieces[mouse.piece.x][mouse.piece.y].legalMoves[i].to.x === coords.x && board.pieces[mouse.piece.x][mouse.piece.y].legalMoves[i].to.y === coords.y) {
        moveIsLegal = true;
        currentMove = board.pieces[mouse.piece.x][mouse.piece.y].legalMoves[i];
        currentMove.from = { x: mouse.piece.x, y: mouse.piece.y };

        break;
      }
    }

    if (moveIsLegal) {
      // It's a legal move

      board.makeMove(currentMove);
      endTurn(currentMove);
    } else {
      // Move is not legal, so set piece back where it was
      guides.clearAll();
      board.drawPiece(mouse.piece, mouse.piece);
      delete mouse.piece;
    }
    animCtx.clearRect(0, 0, size, size);
    delete mouse.piece;
    mouse.dragging = false;
    // if (animCanvas.style.cursor == "wait") {
    //   animCanvas.style.cursor = "default";
    // }
  }
}

function handleMouseMove(evt) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = evt.clientX - rect.left - 5;
  mouse.y = evt.clientY - rect.top - 5;

  let coords = {
    x: Math.floor((mouse.x - startPos) / squareSize),
    y: Math.floor((mouse.y - startPos) / squareSize),
  };

  // If mouse is hovering the board
  if (coords.x >= 0 && coords.x <= 7 && coords.y >= 0 && coords.y <= 7) {
    if (!mouse.dragging) {
      if (board.pieces[coords.x][coords.y]?.color === board.turn) {
        animCanvas.style.cursor = "grab";
      } else {
        animCanvas.style.cursor = "default";
      }
    }

    if (mouse.dragging) {
      animCtx.clearRect(0, 0, size, size);
      animCtx.drawImage(mouse.piece.img, mouse.x - startPos, mouse.y - startPos, squareSize, squareSize);
    }
  }
}

async function makeAiMove(player) {
  // Find a random move
  let moveIndex = Math.floor(Math.random() * player.possibleMoves.length);
  let currentMove = player.possibleMoves[moveIndex];

  player.possibleMoves.sort((a, b) => {
    return b.weight - a.weight;
  });

  if (player.possibleMoves[0].weight > 0) {
    currentMove = player.possibleMoves[0];
  }
  board.makeMove(currentMove);
  endTurn(currentMove);
}

async function endTurn(currentMove, draw = true) {
  board.sounds.move.play();
  let currentPiece = board.pieces[currentMove.to.x][currentMove.to.y],
    currentPlayer = board.players[currentMove.piece.color];
  // Pawn promotion
  if (currentPiece.promoted) {
    currentPiece.promoted = false;
    let imgName = currentPiece.color.substr(0, 1);
    let src = `./img/pieces/${board.theme}/${imgName}q.png`;
    if (draw) {
      currentPiece.img = await loadImage(src);
    }
  }

  if (draw) {
    board.redraw();
    blackStatus.innerHTML = "";
    whiteStatus.innerHTML = "";
    for (let color in board.players) {
      board.players[color].score = 0;
      board.players[color].captures.sort((a, b) => {
        return a.value - b.value;
      });
      //  margin-left: calc(var(--square-size) * -0.4);
      for (let piece of board.players[color].captures) {
        board.players[color].score += Math.floor(piece.value / 100);
        if (color === "white") {
          if (whiteStatus.lastChild?.src === piece.img.src) {
            whiteStatus.lastChild.style.marginRight = "calc(var(--square-size) * -0.15)";
          }
          whiteStatus.appendChild(piece.img);
        }
        if (color === "black") {
          if (blackStatus.lastChild?.src === piece.img.src) {
            blackStatus.lastChild.style.marginRight = "calc(var(--square-size) * -0.15)";
          }
          blackStatus.appendChild(piece.img);
        }
      }
    }
    let blackScore = document.createElement("p"),
      whiteScore = document.createElement("p");

    blackScore.textContent =
      board.players.black.score - board.players.white.score >= 0 ? "+" + (board.players.black.score - board.players.white.score) : board.players.black.score - board.players.white.score;
    whiteScore.textContent =
      board.players.white.score - board.players.black.score >= 0 ? "+" + (board.players.white.score - board.players.black.score) : board.players.white.score - board.players.black.score;

    blackStatus.appendChild(blackScore);
    whiteStatus.appendChild(whiteScore);

    // Player has moved, clear legal moves mark and mark the move
    guides.clearAll();
    guides.markMove(currentMove);
  }

  let opponentColor = currentPlayer.opponent;
  let opponent = board.players[opponentColor];
  let totalNumberOfPieces = currentPlayer.pieces.length + opponent.pieces.length;

  if (board.players[opponentColor].possibleMoves.length > 0 && totalNumberOfPieces > 2) {
    // If opponent has possible moves
    board.turn = opponentColor;
    // Check if it's AIs turn
    if (board.players[board.turn].ai) {
      // let delay = 250 + Math.floor(Math.random() * 250);
      // let delay = 25;
      // setTimeout(() => {
      makeAiMove(board.players[board.turn]);
      // }, delay);
    }
  } else {
    console.log(board);
    if (totalNumberOfPieces <= 2) {
      // Only 2 pieces left(shpuld be the kings)
      messageEle.innerHTML = "Insufficient material!<br>It's a draw!<br>The game lasted for  " + board.moveIndex + " ply.";
    } else {
      // Opponent has no moves. Check if opponent is in check
      board.updatePieces(currentPlayer.color);
      if (opponent.isChecked) {
        messageEle.innerHTML = "Checkmate!<br> " + board.turn.charAt(0).toUpperCase() + board.turn.slice(1) + " wins! <br>The game lasted for  " + board.moveIndex + " ply.";
      } else {
        messageEle.innerHTML = "Stalemate!<br>It's a draw!<br>The game lasted for  " + board.moveIndex + " ply.";
      }
    }

    messageEle.style.transition = "opacity 0.5s ease-in-out";
    messageEle.style.opacity = "1";
  }
}

function updateScore() {
  let score = {
    white: 0,
    black: 0,
  };
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (board.pieces[x][y].type !== "king") {
        score[board.pieces[x][y].color] += board.pieces[x][y].value;
      }
    }
  }
  infoDiv.innerHTML = `<h3>Score</h3><br>White: ${39 - score.black}<br>Black: ${39 - score.white}`;
}

document.querySelector("#themeSelect").addEventListener("change", (evt) => {
  theme = evt.target.value;
  drawBackground();
});

async function drawBackground(drawLines = false) {
  bgCtx.save();
  bgCtx.clearRect(0, 0, size, size);
  let img = null;
  if (themes[theme].hasOwnProperty("img")) {
    img = themes[theme].img;
    img = await loadImage(img);
    bgCtx.drawImage(img, 0, 0, size, size);
  }
  bgCtx.fillStyle = themes[theme].padding;
  bgCtx.fillRect(0, 0, size, size);
  // bgCtx.globalCompositeOperation = "multiply";
  bgCtx.fillStyle = themes[theme].black;
  bgCtx.translate(startPos, startPos);
  bgCtx.fillRect(0, 0, size - squareSize, size - squareSize);
  // bgCtx.globalCompositeOperation = "screen";
  bgCtx.fillStyle = themes[theme].white;
  for (let i = 0; i < 8; i += 2) {
    for (let j = 0; j < 8; j += 2) {
      bgCtx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
      bgCtx.fillRect((1 + i) * squareSize, (1 + j) * squareSize, squareSize, squareSize);
    }
  }
  // Draw lines
  bgCtx.strokeStyle = themes.line;
  bgCtx.lineWidth = 2.5;
  for (let i = 0; i <= 8; i++) {
    if (drawLines) {
      bgCtx.beginPath();
      bgCtx.moveTo(i * squareSize, 0);
      bgCtx.lineTo(i * squareSize, size - startPos);
      bgCtx.stroke();
      bgCtx.beginPath();
      bgCtx.moveTo(0, i * squareSize);
      bgCtx.lineTo(size - startPos, i * squareSize + startPos);
      bgCtx.stroke();
    }

    bgCtx.fillStyle = "black";
    bgCtx.textAlign = "center";
    bgCtx.textBaseline = "middle";
    bgCtx.font = squareSize / 5 + "px Verdana";
    bgCtx.fillText("abcdefgh".charAt(i), startPos + i * squareSize, size - startPos - startPos / 2);
    bgCtx.fillText("12345678".charAt(i), -startPos / 2, size - startPos - squareSize * (i + 1));
  }
  bgCtx.restore();
}
