import { black, white, ChessBoard } from "./Board.js";
import { GuideLayer } from "./GuideLayer.js";
import { ChessPiece } from "./Piece.js";
import { loadImage } from "./utilities.js";

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
  themes = {
    line: "rgb(50, 50, 50)",
    silver: {
      black: "#b0b2b5",
      white: "#e5e5e6",
      padding: "#cdcdd0",
    },
    brown: {
      black: "#b58863", // (181,136,99)
      white: "#f0d9b5", // (240,217,181)
      padding: "rgb(211, 176, 141)",
    },
    texture_warm: {
      black: "rgba(181, 126, 99, 0.6)", // (181,136,99)
      white: "rgba(240, 217, 181, 0.6)", // (240,217,181)
      padding: "rgba(211, 176, 141, 0.5)",
      style: {
        backgroundImage: 'url("./img/textures/seamless-wood-texture-4.jpg")',
        backgroundSize: "cover",
      },
    },
    texture_dark: {
      black: "rgba(0, 0, 0, 0.5)", // (181,136,99)
      white: "rgba(255, 255, 255, 0.5)", // (240,217,181)
      padding: "rgba(128, 128, 128, 0.5)",
      style: {
        backgroundImage: 'url("./img/textures/seamless-wood-texture-4.jpg")',
        backgroundSize: "cover",
      },
    },
    pieces: ["neo", "game_room", "tournament"],
  };

let mouse = {
    x: 0,
    y: 0,
    dragging: false,
  },
  size = parseInt(Math.min(window.innerWidth, window.innerHeight) * 0.85),
  theme = "brown";

size -= size % 9;

const squareSize = size / 9,
  startPos = squareSize / 2;

canvas.width = canvas2.width = canvas3.width = animCanvas.width = size;
canvas.height = canvas2.height = canvas3.height = animCanvas.height = size;
const board = new ChessBoard(piecesCtx, squareSize, guideCtx);
const guides = new GuideLayer(guideCtx, squareSize);
const players = board.players;
loadPieces();
drawBoard(false);

async function loadPieces() {
  for (let piece of white) {
    let imgSrc = `https://images.chesscomfiles.com/chess-themes/pieces/${themes.pieces[2]}/150/${piece.imgName}.png`;
    piece.img = await loadImage(imgSrc);
    board.pieces[piece.x][piece.y] = new ChessPiece(piece.type, "white", piece.img, piece.x, piece.y, piece.value);
    players.white.pieces.push(board.pieces[piece.x][piece.y]);
  }

  for (let piece of black) {
    let imgSrc = `https://images.chesscomfiles.com/chess-themes/pieces/${themes.pieces[2]}/150/${piece.imgName}.png`;
    piece.img = await loadImage(imgSrc);
    board.pieces[piece.x][piece.y] = new ChessPiece(piece.type, "black", piece.img, piece.x, piece.y, piece.value);
    players.black.pieces.push(board.pieces[piece.x][piece.y]);
  }
  board.setup(size);
  guides.clearAll();
}

function drawBoard(drawLines = false) {
  bgCtx.clearRect(0, 0, size, size);
  if (themes[theme].hasOwnProperty("style")) {
    for (let prop in themes[theme].style) {
      canvas.style[prop] = themes[theme].style[prop];
    }
  } else {
    canvas.style.background = "none";
  }
  bgCtx.fillStyle = themes[theme].padding;
  bgCtx.fillRect(0, 0, size, size);
  bgCtx.fillStyle = themes[theme].black;
  bgCtx.fillRect(0 + startPos, 0 + startPos, size - squareSize, size - squareSize);
  bgCtx.fillStyle = themes[theme].white;
  for (let i = 0; i < 8; i += 2) {
    for (let j = 0; j < 8; j += 2) {
      bgCtx.fillRect(i * squareSize + startPos, j * squareSize + startPos, squareSize, squareSize);
      bgCtx.fillRect((1 + i) * squareSize + startPos, (1 + j) * squareSize + startPos, squareSize, squareSize);
    }
  }
  // Draw lines
  bgCtx.strokeStyle = themes.line;
  bgCtx.lineWidth = 2.5;
  for (let i = 0; i <= 8; i++) {
    if (drawLines) {
      bgCtx.beginPath();
      bgCtx.moveTo(i * squareSize + startPos, 0 + startPos);
      bgCtx.lineTo(i * squareSize + startPos, size - startPos);
      bgCtx.stroke();
      bgCtx.beginPath();
      bgCtx.moveTo(0 + startPos, i * squareSize + startPos);
      bgCtx.lineTo(size - startPos, i * squareSize + startPos);
      bgCtx.stroke();
    }

    bgCtx.fillStyle = "black";
    bgCtx.textAlign = "center";
    bgCtx.textBaseline = "middle";
    bgCtx.font = squareSize / 5 + "px Verdana";
    bgCtx.fillText("abcdefgh".charAt(i), squareSize + i * squareSize, size - startPos / 2);
    bgCtx.fillText("12345678".charAt(i), startPos / 2, size - squareSize * (i + 1));
  }
}

animCanvas.addEventListener("mousemove", (evt) => {
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
});

animCanvas.addEventListener("mousedown", (evt) => {
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

    piecesCtx.clearRect(startPos + coords.x * squareSize, startPos + coords.y * squareSize, squareSize, squareSize);
    animCtx.drawImage(mouse.piece.img, mouse.x - startPos, mouse.y - startPos, squareSize, squareSize);

    // Draw guides showing the possible moves
    for (let move of board.pieces[coords.x][coords.y].legalMoves) {
      if (move.isCapture) {
        guides.moveToCapture(move);
      } else {
        guides.moveToEmpty(move);
      }
    }
  }
});

animCanvas.addEventListener("mouseup", (evt) => {
  // Dropping a piece
  if (mouse.dragging) {
    let opponent = board.turn === "black" ? "white" : "black";
    let moveIsLegal = false;
    let coords = {
      x: Math.floor((mouse.x - startPos) / squareSize),
      y: Math.floor((mouse.y - startPos) / squareSize),
    };

    // Check if the square is in the array of legal moves
    for (let i = 0; i < board.pieces[mouse.piece.x][mouse.piece.y].legalMoves.length; i++) {
      if (board.pieces[mouse.piece.x][mouse.piece.y].legalMoves[i].x === coords.x && board.pieces[mouse.piece.x][mouse.piece.y].legalMoves[i].y === coords.y) {
        moveIsLegal = true;
        break;
      }
    }

    if (moveIsLegal) {
      // It's a legal move
      board.movePiece(mouse.piece, coords);

      // Player has moved, switch turns
      getAllPossbileMoves();
      updatePlayerPieces();
      board.turn = board.turn === "black" ? "white" : "black";

      guides.clearAll();
      guides.markMove(mouse.piece, coords);
      // Check if it's AIs turn
      if (players[board.turn].ai) {
        // Ok, so implement some kind of AI to move pieces
        animCanvas.style.cursor = "wait";

        makeAiMove(players[board.turn]);
      } else {
        animCanvas.style.cursor = "default";
      }
    } else {
      // Move is not legal, so set piece back where it was
      guides.clearAll();
      piecesCtx.drawImage(mouse.piece.img, mouse.piece.x * squareSize + startPos, mouse.piece.y * squareSize + startPos, squareSize, squareSize);
      board.drawPiece(mouse.piece, mouse.piece);
      delete mouse.piece;
    }
    animCtx.clearRect(0, 0, size, size);
    delete mouse.piece;
    mouse.dragging = false;
    if (animCanvas.style.cursor == "wait") {
      animCanvas.style.cursor = "default";
    }
  }
});

// This is for AI to know which moves it has choose from
function getAllPossbileMoves() {
  for (let color in players) {
    let player = players[color];
    player.possibleMoves = [];
    for (let i = 0; i < player.pieces.length; i++) {
      let piece = player.pieces[i];
      // board.findLegalMoves(piece);
      piece.findLegalMoves(board);
      if (piece.legalMoves.length > 0) {
        player.possibleMoves.push({ piece, moveTo: piece.legalMoves });
      }
    }
  }
}

function makeAiMove(player) {
  if (player.possibleMoves.length > 0) {
    // Get a random piece
    let pieceIndex = Math.floor(Math.random() * player.possibleMoves.length);

    // Find a random move with that piece
    let moveIndex = Math.floor(Math.random() * player.possibleMoves[pieceIndex].moveTo.length);

    let oldX = player.possibleMoves[pieceIndex].piece.x,
      oldY = player.possibleMoves[pieceIndex].piece.y,
      newX = player.possibleMoves[pieceIndex].moveTo[moveIndex].x,
      newY = player.possibleMoves[pieceIndex].moveTo[moveIndex].y;

    board.movePiece({ x: oldX, y: oldY }, { x: newX, y: newY });
    guides.clearAll();
    guides.markMove({ x: oldX, y: oldY }, { x: newX, y: newY });
    updatePlayerPieces();

    let oppenentColor = player.color === "black" ? "white" : "black";
    // getAllPossbileMoves();

    // AI has moved, switch turns
    board.turn = oppenentColor;
  } else {
    // No possible moves
    // This is where checkmate and/or stalemate happens
  }
}

function updatePlayerPieces() {
  players.white.pieces = [];
  players.black.pieces = [];
  let score = {
    white: 0,
    black: 0,
  };
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (board.pieces[x][y]) {
        players[board.pieces[x][y].color].pieces.push(board.pieces[x][y]);
        if (board.pieces[x][y].type !== "king") {
          score[board.pieces[x][y].color] += board.pieces[x][y].value;
        }
      }
    }
  }
  infoDiv.innerHTML = `<h3>Score</h3><br>White: ${score.white}<br>Black: ${score.black}`;
}

document.querySelector("#themeSelect").addEventListener("change", (evt) => {
  theme = evt.target.value;
  drawBoard();
});
