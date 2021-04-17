import { ChessPiece, black, white, ChessBoard } from "./classes.js";
import { loadImage } from "./utilities.js";

const canvas = document.querySelector("#bgCanvas"),
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
    test: {
      black: "#b58863", // (181,136,99)
      white: "#f0d9b5", // (240,217,181)
      padding: "rgb(211, 176, 141)",
    },
    brown: {
      black: "#b2936c",
      white: "#f1e1cd",
      padding: "#deb887",
    },
    pieces: ["neo", "game_room", "tournament"],
  },
  theme = "silver";

let mouse = {
    x: 0,
    y: 0,
    dragging: false,
  },
  size = parseInt(Math.min(window.innerWidth, window.innerHeight) * 0.85);

size -= size % 9;

const squareSize = size / 9,
  startPos = squareSize / 2 - 0.5;

canvas.width = canvas2.width = canvas3.width = animCanvas.width = size;
canvas.height = canvas2.height = canvas3.height = animCanvas.height = size;

const board = new ChessBoard();
setup();

async function setup() {
  for (let piece of black) {
    let imgSrc = `https://images.chesscomfiles.com/chess-themes/pieces/${themes.pieces[2]}/150/${piece.imgName}.png`;
    piece.img = await loadImage(imgSrc);
    board.pieces[piece.x][piece.y] = new ChessPiece(piece.type, "black", piece.img, piece.x, piece.y);
  }

  for (let piece of white) {
    let imgSrc = `https://images.chesscomfiles.com/chess-themes/pieces/${themes.pieces[2]}/150/${piece.imgName}.png`;
    piece.img = await loadImage(imgSrc);
    board.pieces[piece.x][piece.y] = new ChessPiece(piece.type, "white", piece.img, piece.x, piece.y);
  }
  drawBoard();
  drawPieces();
}

function drawPieces() {
  piecesCtx.clearRect(0, 0, size, size);
  for (let tmp of board.pieces) {
    for (let piece of tmp) {
      if (piece) {
        piecesCtx.drawImage(piece.img, piece.x * squareSize + startPos, piece.y * squareSize + startPos, squareSize, squareSize);
      }
    }
  }
}

function drawBoard() {
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
  bgCtx.strokeStyle = themes.line;
  bgCtx.lineWidth = 2.5;
  for (let i = 0; i <= 8; i++) {
    bgCtx.beginPath();
    bgCtx.moveTo(i * squareSize + startPos, 0 + startPos);
    bgCtx.lineTo(i * squareSize + startPos, size - startPos);
    bgCtx.stroke();
    bgCtx.beginPath();
    bgCtx.moveTo(0 + startPos, i * squareSize + startPos);
    bgCtx.lineTo(size - startPos, i * squareSize + startPos);
    bgCtx.stroke();

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

  guideCtx.clearRect(0, 0, size, size);
  guideCtx.fillStyle = "#0088ff55";
  if (mouse.x > startPos && mouse.y > startPos && mouse.x < size - startPos && mouse.y < size - startPos) {
    outerLoop: for (let x = startPos; x < size - squareSize; x += squareSize) {
      for (let y = startPos; y < size - squareSize; y += squareSize) {
        if (mouse.x > x && mouse.x < x + squareSize && (mouse.y > y) & (mouse.y < y + squareSize)) {
          guideCtx.fillRect(x, y, squareSize, squareSize);
          if (board.pieces[coords.x][coords.y]) {
            animCanvas.style.cursor = "grab";
          } else {
            animCanvas.style.cursor = "default";
          }
          break outerLoop;
        }
      }
    }
  }

  if (mouse.dragging) {
    findLegalMoves(mouse.piece);

    animCanvas.style.cursor = "grabbing";
    animCtx.clearRect(0, 0, size, size);
    animCtx.drawImage(mouse.piece.img, mouse.x - startPos, mouse.y - startPos, squareSize, squareSize);
  }
});

animCanvas.addEventListener("mousedown", (evt) => {
  let coords = {
    x: Math.floor((mouse.x - startPos) / squareSize),
    y: Math.floor((mouse.y - startPos) / squareSize),
  };

  // Grabbing a piece
  if (board.pieces[coords.x][coords.y]) {
    let tmpPiece = board.pieces[coords.x][coords.y];
    mouse.dragging = true;
    mouse.piece = new ChessPiece(tmpPiece.type, tmpPiece.color, tmpPiece.img, tmpPiece.x, tmpPiece.y);

    delete board.pieces[coords.x][coords.y];
    piecesCtx.clearRect(startPos + coords.x * squareSize, startPos + coords.y * squareSize, squareSize, squareSize);
    animCtx.drawImage(mouse.piece.img, mouse.x - startPos, mouse.y - startPos, squareSize, squareSize);
    animCanvas.style.cursor = "none";

    mouse.moves = findLegalMoves(mouse.piece);
  }
});

animCanvas.addEventListener("mouseup", (evt) => {
  if (mouse.dragging) {
    let moveIsLegal = false;
    let coords = {
      x: Math.floor((mouse.x - startPos) / squareSize),
      y: Math.floor((mouse.y - startPos) / squareSize),
    };
    for (let i = 0; i < mouse.moves.length; i++) {
      if (mouse.moves[i].x === coords.x && mouse.moves[i].y === coords.y) {
        moveIsLegal = true;
      }
    }
    if (moveIsLegal) {
      if (board.pieces[coords.x][coords.y]) {
        // Square has a piece on it
        if (board.pieces[coords.x][coords.y].color !== mouse.piece.color) {
          // Square is occupied by the opponent
          piecesCtx.clearRect(coords.x * squareSize + startPos, coords.y * squareSize + startPos, squareSize, squareSize);
          guideCtx.clearRect(coords.x * squareSize + startPos, coords.y * squareSize + startPos, squareSize, squareSize);
          piecesCtx.drawImage(mouse.piece.img, coords.x * squareSize + startPos, coords.y * squareSize + startPos, squareSize, squareSize);
          board.pieces[coords.x][coords.y] = new ChessPiece(mouse.piece.type, mouse.piece.color, mouse.piece.img, coords.x, coords.y);
        }
      } else {
        // Square is empty
        board.pieces[coords.x][coords.y] = new ChessPiece(mouse.piece.type, mouse.piece.color, mouse.piece.img, coords.x, coords.y);
        piecesCtx.drawImage(mouse.piece.img, coords.x * squareSize + startPos, coords.y * squareSize + startPos, squareSize, squareSize);
      }
    } else {
      // Square is occupied by own piece or not legal
      piecesCtx.drawImage(mouse.piece.img, mouse.piece.x * squareSize + startPos, mouse.piece.y * squareSize + startPos, squareSize, squareSize);
      board.pieces[mouse.piece.x][mouse.piece.y] = new ChessPiece(mouse.piece.type, mouse.piece.color, mouse.piece.img, mouse.piece.x, mouse.piece.y);
    }
    animCtx.clearRect(0, 0, size, size);
    guideCtx.clearRect(0, 0, size, size);
    delete mouse.piece;
    mouse.dragging = false;
    animCanvas.style.cursor = "default";
  }
});

function findLegalMoves(piece) {
  guideCtx.save();
  let lineOffset = bgCtx.lineWidth;
  guideCtx.lineWidth = bgCtx.lineWidth * 1.5;
  let legalMoves = [];
  for (let i = 0; i < piece.moves.length; i++) {
    let x = piece.x;
    let y = piece.y;
    let repeat = piece.moves[i].repeat || false;

    do {
      x += piece.moves[i].x || 0;
      y += piece.moves[i].y || 0;
      if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        if (board.pieces[x][y]) {
          repeat = false;
          if (board.pieces[x][y].color !== piece.color) {
            legalMoves.push({ x, y });
            guideCtx.strokeStyle = "#ff5555";
            guideCtx.strokeRect(startPos + x * squareSize + lineOffset, startPos + y * squareSize + lineOffset, squareSize - lineOffset * 2, squareSize - lineOffset * 2);
          }
        } else {
          legalMoves.push({ x, y });
          guideCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
          guideCtx.beginPath();
          guideCtx.arc(x * squareSize + squareSize, y * squareSize + squareSize, squareSize * 0.2, 0, Math.PI * 2);
          guideCtx.fill();
        }
      } else {
        repeat = false;
      }
    } while (repeat);
  }
  guideCtx.restore();
  return legalMoves;
}
