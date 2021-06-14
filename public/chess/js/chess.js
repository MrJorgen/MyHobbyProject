import { ChessBoard } from "./Board.js";
import { Drawing } from "./Drawing.js";
import Bishop from "./pieces/Bishop.js";
import King from "./pieces/King.js";
import Knight from "./pieces/Knight.js";
import { loadImage, themes, ChessImages } from "./utilities.js";

const infoDiv = document.querySelector("#info"),
  messageEle = document.querySelector("#message"),
  canvas = document.querySelector("#bgCanvas"),
  bgCtx = canvas.getContext("2d"),
  canvas2 = document.querySelector("#layerCanvas"),
  guideCtx = canvas2.getContext("2d"),
  canvas3 = document.querySelector("#piecesCanvas"),
  piecesCtx = canvas3.getContext("2d"),
  animCanvas = document.querySelector("#animCanvas"),
  animCtx = animCanvas.getContext("2d"),
  root = document.documentElement,
  blackStatus = document.querySelector("#blackStatus"),
  whiteStatus = document.querySelector("#whiteStatus");

let mouse = { x: 0, y: 0, dragging: false },
  size = Math.floor(Math.min(window.innerWidth, window.innerHeight) * (1 / 11)),
  theme = "green";

const squareSize = size - (size % 2),
  startPos = size / 2 - 0.5;

size = squareSize * 9;

canvas.width = canvas2.width = canvas3.width = animCanvas.width = size;
canvas.height = canvas2.height = canvas3.height = animCanvas.height = size;

root.style.setProperty("--size", size + "px");
root.style.setProperty("--square-size", squareSize + "px");

// Positions from
// https://www.chessprogramming.org/Perft_Results
const fenStrings = [
  "2r3k1/1q1nbppp/r3p3/3pP3/pPpP4/P1Q2N2/2RN1PPP/2R4K b - b3 0 23", // En Passant test
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Pos 1
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -", // Pos 2
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - -", // Pos 3
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", // Pos 4
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", // Pos 5
  "rnbq1k1r/pp1Pbpp1/2p4p/8/1PB5/8/P1P1NnPP/RNBQK2R w KQ - 1 8", // Bug fixing...
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "K7/p7/8/2b5/8/8/8/R2N3k w - - 1 1",
  "r3k3/1p3p2/p2q2p1/bn3P2/1N2PQP1/PB6/3K1R1r/3R4 w - - 0 1",
];

const settings = {
  fen: fenStrings[5],
  theme: themes.pieces[3],
  ai: {
    white: false,
    black: false,
  },
  rotate: false,
  debug: true,
};

let images = new ChessImages(settings);
await images.loadImages();

// Make the board
const board = new ChessBoard(settings);
const drawing = new Drawing(piecesCtx, guideCtx, animCtx, images, squareSize);
window.board = board;

// Draw the initial board
drawBackground();
drawing.redraw(board.pieces);

let sounds = { move: new Audio("./sounds/move-self.webm"), capture: new Audio("./sounds/capture.webm"), illegal: new Audio("./sounds/illegal.webm") };

setupEventListeners();
testWorkers();
// animatePerft(board.turn);

function testWorkers() {
  let startWorker = performance.now();

  // Testing workers

  let workers = [];
  for (let i = 1; i <= 5; i++) {
    let newBoard = Object.assign({}, board);
    let newWorker = new Worker("./js/workers/findLegalMoves.js", { type: "module" });
    newWorker.postMessage({ newBoard, depth: i });
    newWorker.addEventListener("message", result);
    workers.push(newWorker);
  }

  function result(evt) {
    let { numPositions, depth } = evt.data;
    let stopWorker = performance.now();
    console.log(`${depth} ply(${numPositions} positions) calculated in ${parseInt(stopWorker - startWorker)} ms using a worker.`);
  }
}

if (!settings.ai.black || !settings.ai.white) {
  setupEventListeners();
}

if (settings.ai.black && board.turn === "black") {
  makeAiMove(board.players.black);
}

if (settings.ai.white && board.turn === "white") {
  makeAiMove(board.players.white);
}

window.test = function (depth) {
  let pos5 = [0, 44, 1486, 62379, 2103487, 89941194];

  let start = performance.now();
  let numPos = board.perft(depth);
  let stop = performance.now();
  console.log(`Depth: ${depth} ply. Result: ${numPos} positions. Time: ${(stop - start).toFixed(0)} ms.`);
  // return `Depth: ${depth} ply. Result: ${numPos} positions. Time: ${(stop - start).toFixed(0)} ms.`;
};

function setupEventListeners() {
  animCanvas.addEventListener("contextmenu", (event) => event.preventDefault());
  animCanvas.addEventListener("mousedown", grabPiece);
  animCanvas.addEventListener("mousemove", handleMouseMove);
  animCanvas.addEventListener("mouseup", dropPiece);
  document.addEventListener("keyup", navigateHistory);
}

document.querySelector("#themeSelect").addEventListener("change", (evt) => {
  theme = evt.target.value;
  drawBackground();
});

function navigateHistory(evt) {
  evt.preventDefault();
  if (evt.which == 37) {
    if (board.history.length > 0) {
      board.unMakeMove();
      drawing.redraw(board.pieces);
      board.turn = board.turn === "black" ? "white" : "black";
      if (board.players[board.turn].ai) {
        setTimeout(() => {
          grabPiece(evt);
        }, 250);
        // makeAiMove(board.players[board.turn]);
      } else {
        setupEventListeners();
      }
    }
  }
}

function animatePerft(color = board.turn) {
  let i = 0,
    delay = 200,
    movesToAnimate = [...board.players[color].possibleMoves];
  animate(i, color);
  function animate(i, color) {
    console.log(i);
    setTimeout(() => {
      board.makeMove(movesToAnimate[i]);
      drawing.markMove(movesToAnimate[i]);
      drawing.redraw(board.pieces);
      setTimeout(() => {
        board.unMakeMove();
        drawing.clearGuide();
        drawing.redraw(board.pieces);
        i++;
        if (i < movesToAnimate.length) {
          animate(i, color);
        } else {
          animatePerft(board.players[color].opponent);
        }
      }, delay);
    }, delay);
  }
}

function grabPiece(evt) {
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
      img: images[board.pieces[coords.x][coords.y].color][board.pieces[coords.x][coords.y].type],
    };

    drawing.markSquare(coords);
    drawing.clearSquare(coords);
    drawing.animateImage(mouse.piece.img, mouse.x, mouse.y);

    // Draw guides showing the possible moves
    for (let move of board.pieces[coords.x][coords.y].legalMoves) {
      if (move.capture) {
        // drawing.moveToCapture(move.to);
        drawing.moveToCapture(move.capture);
        drawing.moveToEmpty(move.to);
      } else {
        drawing.moveToEmpty(move.to);
      }
    }
  }
}

function dropPiece(evt) {
  // Dropping a piece on the board
  if (mouse.dragging) {
    let moveIsLegal = false,
      coords = {
        x: Math.floor((mouse.x - startPos) / squareSize),
        y: Math.floor((mouse.y - startPos) / squareSize),
      },
      currentMove = undefined;

    // Check if the square is in the array of legal moves
    for (let i = 0; i < board.pieces[mouse.piece.x][mouse.piece.y].legalMoves.length; i++) {
      if (board.pieces[mouse.piece.x][mouse.piece.y].legalMoves[i].to.x === coords.x && board.pieces[mouse.piece.x][mouse.piece.y].legalMoves[i].to.y === coords.y) {
        moveIsLegal = true;
        currentMove = board.pieces[mouse.piece.x][mouse.piece.y].legalMoves[i];
        break;
      }
    }

    if (moveIsLegal) {
      // It's a legal move
      board.makeMove(currentMove);
      endTurn(currentMove);
    } else {
      // Move is not legal, so set piece back where it was
      drawing.clearGuide();
      drawing.drawPiece(mouse.piece.img, mouse.piece);
      delete mouse.piece;
    }
    drawing.clearAnim();
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
      drawing.animateImage(mouse.piece.img, mouse.x, mouse.y);
    }
  }
}

async function makeAiMove(player) {
  if (player.possibleMoves.length > 0) {
    // Find a random move
    let currentMove;

    player.possibleMoves.sort((a, b) => {
      return b.weight - a.weight;
    });

    if (player.possibleMoves[0].weight > 0) {
      let tmpArray = [];
      let bestMove = player.possibleMoves[0];
      for (let move of player.possibleMoves) {
        if (move.weight === bestMove.weight) {
          tmpArray.push(move);
        }
      }
      let moveIndex = Math.floor(Math.random() * tmpArray.length);
      currentMove = tmpArray[moveIndex];
    }
    if (!currentMove) {
      let moveIndex = Math.floor(Math.random() * player.possibleMoves.length);
      currentMove = player.possibleMoves[moveIndex];
    }

    board.makeMove(currentMove);
    endTurn(currentMove);
  } else {
    let currentPlayer = board.players[board.turn];
    board.turn = currentPlayer.opponent;
    endTurn(false, false);
  }
}

async function endTurn(currentMove, draw = true) {
  let currentPlayer, currentPiece;
  if (currentMove) {
    if (currentMove.capture) {
      sounds.capture.play();
    } else {
      sounds.move.play();
    }
    currentPiece = board.pieces[currentMove.to.x][currentMove.to.y];
    currentPlayer = board.players[currentMove.piece.color];
  } else {
    currentPlayer = board.players[board.turn];
  }

  if (draw) {
    drawing.redraw(board.pieces);
    if (currentMove.capture) {
      blackStatus.innerHTML = "";
      whiteStatus.innerHTML = "";
      for (let color in board.players) {
        board.players[color].score = 0;
        board.players[color].captures.sort((a, b) => {
          return a.value - b.value;
        });
        for (let piece of board.players[color].captures) {
          // let tmpImg = await loadImage(images[piece.color][piece.type].src);
          let tmpImg = document.createElement("img");
          tmpImg.src = images[piece.color][piece.type].src;
          tmpImg.dataset.type = piece.type;
          if (color === "white") {
            if (whiteStatus.hasChildNodes() && whiteStatus.lastChild.dataset.type === piece.type) {
              whiteStatus.lastChild.classList.add("stack");
            }
            whiteStatus.appendChild(tmpImg);
          }
          if (color === "black") {
            if (blackStatus.hasChildNodes() && blackStatus.lastChild.dataset.type === piece.type) {
              blackStatus.lastChild.classList.add("stack");
            }
            blackStatus.appendChild(tmpImg);
          }
          board.players[color].score += Math.floor(piece.value / 100);
        }
      }
      if (blackStatus.hasChildNodes() && board.players.black.score > board.players.white.score) {
        let blackScoreEle = document.createElement("p");
        blackScoreEle.textContent = "+" + (board.players.black.score - board.players.white.score);
        blackStatus.appendChild(blackScoreEle);
      }
      if (whiteStatus.hasChildNodes() && board.players.white.score > board.players.black.score) {
        let whiteScoreEle = document.createElement("p");
        whiteScoreEle.textContent =
          board.players.white.score - board.players.black.score >= 0 ? "+" + (board.players.white.score - board.players.black.score) : board.players.white.score - board.players.black.score;
        whiteStatus.appendChild(whiteScoreEle);
      }
    }

    // Player has moved, clear legal moves mark and mark the move
    drawing.clearAnim();
    drawing.clearGuide();
    drawing.markMove(currentMove);
    if (board.settings.debug) {
      board.players[board.turn].attackedSquares.forEach((square) => {
        drawing.attackedSquare(square);
      });
    }
  }
  // Insufficent material
  // ------------------------------------------------------------
  /*
    king against king;
    king against king and bishop;
    king against king and knight;
    king and bishop against king and bishop, with both bishops on squares of the same color
  */
  let opponentColor = currentPlayer.opponent;
  let opponent = board.players[opponentColor];
  let totalNumberOfPieces = 0,
    bishopOrKnight = 0;
  for (let x = 0; x < board.pieces.length; x++) {
    for (let y = 0; y < board.pieces[x].length; y++) {
      if (board.pieces[x][y] !== undefined) {
        totalNumberOfPieces++;
        if (board.pieces[x][y] instanceof Bishop || board.pieces[x][y] instanceof Knight) {
          bishopOrKnight++;
        }
      }
    }
  }
  // ------------------------------------------------------------

  let insufficentMaterial = (totalNumberOfPieces == 3 && bishopOrKnight == 1) || totalNumberOfPieces < 3;

  if (board.players[opponentColor].possibleMoves.length > 0 && !insufficentMaterial && board.fiftyMove < 100) {
    // If opponent has possible moves
    board.turn = opponentColor;
    // Check if it's AIs turn
    if (board.players[board.turn].ai) {
      // let delay = 250 + Math.floor(Math.random() * 250);
      let delay = 25;
      setTimeout(() => {
        makeAiMove(board.players[board.turn]);
      }, delay);
    }
  } else {
    console.log(board);
    if (insufficentMaterial || board.fiftyMove >= 100) {
      messageEle.innerHTML = "It's a draw!";
    } else if (board.players[opponentColor].possibleMoves.length <= 0) {
      // Opponent has no moves. Check if opponent is in check
      board.updatePieces(currentPlayer.color);
      if (opponent.isChecked) {
        messageEle.innerHTML = "Checkmate by " + board.turn + "!";
      } else {
        messageEle.innerHTML = "Stalemate!";
      }
    }

    messageEle.innerHTML += "<br><small>The game lasted for  " + board.history.length + " ply.</small>";

    messageEle.style.transition = "opacity 0.5s ease-in-out";
    messageEle.style.opacity = "1";
  }
}

async function drawBackground() {
  bgCtx.save();
  bgCtx.clearRect(0, 0, size, size);

  // Draw image if in the theme
  if (themes.boards[theme].hasOwnProperty("img")) {
    let img = themes.boards[theme].img;
    img = await loadImage(img);
    // bgCtx.drawImage(img, 0, 0, size, size);
    bgCtx.fillStyle = themes.boards[theme].padding;
    bgCtx.fillRect(0, 0, size, size);
    bgCtx.drawImage(img, startPos + 0.5, startPos + 0.5, squareSize * 8, squareSize * 8);
    bgCtx.globalCompositeOperation = themes.boards[theme].composit;
  } else if (themes.boards[theme].hasOwnProperty("img_light")) {
    let img_light = themes.boards[theme].img_light;
    img_light = await loadImage(img_light);
    let img_dark = themes.boards[theme].img_dark;
    img_dark = await loadImage(img_dark);
    bgCtx.save();
    bgCtx.fillStyle = themes.boards[theme].padding;
    bgCtx.fillRect(0, 0, size, size);
    bgCtx.translate(startPos, startPos);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 0) {
          // Dark
          bgCtx.drawImage(img_dark, i * squareSize, j * squareSize, squareSize, squareSize, i * squareSize, j * squareSize, squareSize, squareSize);
        } else {
          // Light
          bgCtx.drawImage(img_light, i * squareSize, j * squareSize, squareSize, squareSize, i * squareSize, j * squareSize, squareSize, squareSize);
        }
      }
    }
    bgCtx.restore();
  } else {
    bgCtx.fillStyle = themes.boards[theme].padding;
    bgCtx.fillRect(0, 0, size, size);
  }
  bgCtx.translate(startPos + 0.5, startPos + 0.5);

  // Draw squares
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        bgCtx.fillStyle = themes.boards[theme].white;
      } else {
        bgCtx.fillStyle = themes.boards[theme].black;
      }
      bgCtx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
    }
  }
  // Draw lines
  // bgCtx.globalCompositeOperation = "source-over";
  for (let i = 0; i <= 8; i++) {
    if (themes.boards[theme].hasOwnProperty("line")) {
      bgCtx.strokeStyle = themes[theme].line;
      bgCtx.lineWidth = 2.5;
      // Horizontal?
      bgCtx.beginPath();
      bgCtx.moveTo(i * squareSize + 0.5, 0.5);
      bgCtx.lineTo(i * squareSize + 0.5, squareSize * 8 + 0.5);
      bgCtx.stroke();

      // Vertical?
      bgCtx.beginPath();
      bgCtx.moveTo(0, i * squareSize);
      bgCtx.lineTo(squareSize * 8, i * squareSize);
      bgCtx.stroke();
    }

    bgCtx.globalCompositeOperation = "source-over";
    bgCtx.fillStyle = "black";
    bgCtx.textAlign = "center";
    bgCtx.textBaseline = "middle";
    bgCtx.font = squareSize / 5 + "px Verdana";
    bgCtx.fillText("abcdefgh".charAt(i), startPos + i * squareSize, size - startPos - startPos / 2);
    bgCtx.fillText("12345678".charAt(i), -startPos / 2, size - startPos - squareSize * (i + 1));
  }
  bgCtx.restore();
}
