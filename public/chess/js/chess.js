import { ChessBoard } from "./Board.js";
import { Drawing } from "./Drawing.js";
import { GuideLayer } from "./GuideLayer.js";
import { loadImage, themes, make2dArray, ChessImages } from "./utilities.js";

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

canvas.width = canvas2.width = canvas3.width = animCanvas.width = size;
canvas.height = canvas2.height = canvas3.height = animCanvas.height = size;
const settings = {
  theme: themes.pieces[3],
  ai: {
    white: false,
    black: false,
  },
  squareSize,
};

let images = new ChessImages(settings);
await images.loadImages();

// Positions from
// https://www.chessprogramming.org/Perft_Results

let fenStrings = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - -",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "2r3k1/1q1nbppp/r3p3/3pP3/pPpP4/P1Q2N2/2RN1PPP/2R4K b - b3 0 23", // En Passant test
];

/*
Pos 5(index 4)

Depth	Nodes
1	    44
2	    1,486
3	    62,379
4	    2,103,487
5	    89,941,194

*/

// Make the board
const board = new ChessBoard(settings);
const drawing = new Drawing(piecesCtx, guideCtx, animCtx, images, squareSize);
window.board = board;
// Load pieces etc
board.decodeFen(fenStrings[0]);
drawing.redraw(board.pieces);

let sounds = { move: new Audio("./sounds/move-self.webm"), capture: new Audio("./sounds/capture.webm"), illegal: new Audio("./sounds/illegal.webm") };

const guides = new GuideLayer(guideCtx, squareSize);
drawBackground(false);
testWorkers();

function testWorkers() {
  let start = performance.now();
  let stop = performance.now();
  // Testing workers
  // -----------------------------------------------------------------------------
  let workers = [];
  for (let x = 0; x < board.pieces.length; x++) {
    for (let y = 0; y < board.pieces[x].length; y++) {
      if (board.pieces[x][y]) {
        let newWorker = new Worker("./js/workers/findLegalMoves.js", { type: "module" });
        newWorker.postMessage({ board, x, y });
        newWorker.addEventListener("message", result);
        workers.push(newWorker);
      }
    }
  }
  let workersTerminated = 0;
  function result(evt) {
    evt.target.terminate();
    if (evt.data) {
      let { x, y, legalMoves } = evt.data;
      board.pieces[x][y].legalMoves = legalMoves;
    }
    workersTerminated++;
    if (workers.length === workersTerminated) {
      stop = performance.now();
      console.log(`It took ${stop - start} ms to compute with workers.`);
    }
  }

  // -----------------------------------------------------------------------------
  start = performance.now();
  for (let x = 0; x < board.pieces.length; x++) {
    for (let y = 0; y < board.pieces[x].length; y++) {
      if (board.pieces[x][y] && board.pieces[x][y].type === "pawn") {
        board.pieces[x][y].findLegalMoves(board);
      }
    }
  }
  stop = performance.now();
  console.log(`It took ${stop - start} ms to compute without workers.`);
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
  let correct = [0, 44, 1486, 62379, 2103487, 89941194];

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
}

document.querySelector("#themeSelect").addEventListener("change", (evt) => {
  theme = evt.target.value;
  drawBackground();
});

function grabPiece(evt) {
  if (evt.which === 3) {
    evt.preventDefault();
    if (board.history.length > 0) {
      board.unMakeMove();
      guides.clearAll();
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
      img: images[board.pieces[coords.x][coords.y].color][board.pieces[coords.x][coords.y].type],
    };

    drawing.clearSquare(coords);
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
        console.log(currentMove);
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
      drawing.drawPiece(mouse.piece.img, mouse.piece);
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
    guides.clearAll();
    guides.markMove(currentMove);
  }

  let opponentColor = currentPlayer.opponent;
  let opponent = board.players[opponentColor];
  let totalNumberOfPieces = currentPlayer.pieces.length + opponent.pieces.length;

  if (board.players[opponentColor].possibleMoves.length > 0 && totalNumberOfPieces > 2 && board.fiftyMove < 100) {
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
    if (totalNumberOfPieces <= 2 || board.fiftyMove >= 100) {
      // Only 2 pieces left(shpuld be the kings)
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

    messageEle.innerHTML += "<br><small>The game lasted for  " + board.moveIndex + " ply.</small>";

    messageEle.style.transition = "opacity 0.5s ease-in-out";
    messageEle.style.opacity = "1";
  }
}

async function drawBackground(drawLines = false) {
  bgCtx.save();
  bgCtx.clearRect(0, 0, size, size);

  // Draw image if in the theme
  if (themes[theme].hasOwnProperty("img")) {
    let img = themes[theme].img;
    img = await loadImage(img);
    // bgCtx.drawImage(img, 0, 0, size, size);
    bgCtx.fillStyle = themes[theme].padding;
    bgCtx.fillRect(0, 0, size, size);
    bgCtx.drawImage(img, startPos + 0.5, startPos + 0.5, squareSize * 8, squareSize * 8);
    bgCtx.globalCompositeOperation = themes[theme].composit;
  } else {
    bgCtx.fillStyle = themes[theme].padding;
    bgCtx.fillRect(0, 0, size, size);
  }
  bgCtx.translate(startPos, startPos);

  // Draw squares
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        bgCtx.fillStyle = themes[theme].white;
      } else {
        bgCtx.fillStyle = themes[theme].black;
      }
      bgCtx.fillRect(i * squareSize + 0.5, j * squareSize + 0.5, squareSize, squareSize);
    }
  }
  // Draw lines
  // bgCtx.globalCompositeOperation = "source-over";
  bgCtx.strokeStyle = themes.line;
  bgCtx.lineWidth = 2.5;
  for (let i = 0; i <= 8; i++) {
    if (drawLines) {
      // Horizontal?
      bgCtx.beginPath();
      bgCtx.moveTo(i * squareSize, 0);
      bgCtx.lineTo(i * squareSize, squareSize * 8);
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
