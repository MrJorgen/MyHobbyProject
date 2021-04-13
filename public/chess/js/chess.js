import { ChessPiece, black, white, ChessBoard } from "./classes.js";

const canvas = document.querySelector("#bgCanvas"),
  ctx = canvas.getContext("2d"),
  canvas2 = document.querySelector("#layerCanvas"),
  ctx2 = canvas2.getContext("2d"),
  canvas3 = document.querySelector("#piecesCanvas"),
  ctx3 = canvas3.getContext("2d"),
  colors = {
    line: "rgb(50, 50, 50)",
    silver: {
      black: "#b0b2b5",
      white: "#e5e5e6",
      padding: "#cdcdd0",
    },
    brown: {
      black: "#b2936c",
      white: "#f1e1cd",
      padding: "#deb887",
    },
  };

const theme = "silver";

let mouse = {
  x: 0,
  y: 0,
  dragging: false,
};

let size = parseInt(Math.min(window.innerWidth, window.innerHeight) * 0.75);
size = size - (size % 9);
const squareSize = size / 9,
  startPos = squareSize / 2 - 0.5;

canvas.width = size;
canvas.height = size;
canvas2.width = size;
canvas2.height = size;
canvas3.width = size;
canvas3.height = size;

const board = new ChessBoard();
setup();

async function setup() {
  for (let piece in black) {
    black[piece].img = await loadImage(black[piece].imgName);
    board.pieces[black[piece].x][black[piece].y] = new ChessPiece(piece, "black", black[piece].img, black[piece].x, black[piece].y);
  }

  for (let piece in white) {
    white[piece].img = await loadImage(white[piece].imgName);
    board.pieces[white[piece].x][white[piece].y] = new ChessPiece(piece, "white", white[piece].img, white[piece].x, white[piece].y);
  }

  drawBoard();
  drawPieces();
}

function drawPieces() {
  ctx3.clearRect(0, 0, size, size);
  for (let x of board.pieces) {
    for (let piece of x) {
      if (piece) {
        ctx3.drawImage(piece.img, piece.x * squareSize + startPos, piece.y * squareSize + startPos, squareSize, squareSize);
      }
    }
  }
}

function drawBoard() {
  ctx.fillStyle = colors[theme].padding;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = colors[theme].black;
  ctx.fillRect(0 + startPos, 0 + startPos, size - squareSize, size - squareSize);
  ctx.fillStyle = colors[theme].white;
  for (let i = 0; i < 8; i += 2) {
    for (let j = 0; j < 8; j += 2) {
      ctx.fillRect(i * squareSize + startPos, j * squareSize + startPos, squareSize, squareSize);
      ctx.fillRect((1 + i) * squareSize + startPos, (1 + j) * squareSize + startPos, squareSize, squareSize);
    }
  }
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = 2.5;
  for (let i = 0; i <= 8; i++) {
    ctx.beginPath();
    ctx.moveTo(i * squareSize + startPos, 0 + startPos);
    ctx.lineTo(i * squareSize + startPos, size - startPos);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0 + startPos, i * squareSize + startPos);
    ctx.lineTo(size - startPos, i * squareSize + startPos);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = squareSize / 5 + "px Verdana";
    ctx.fillText("abcdefgh".charAt(i), squareSize + i * squareSize, size - startPos / 2);
    ctx.fillText("12345678".charAt(i), startPos / 2, size - squareSize * (i + 1));
  }
}

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = `./img/${src}.svg`;
  });
}

canvas3.addEventListener("mousemove", (evt) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = evt.clientX - rect.left - 5;
  mouse.y = evt.clientY - rect.top - 5;

  ctx2.clearRect(0, 0, size, size);
  if (!mouse.dragging) {
    ctx2.fillStyle = "#0088ff55";
  } else {
    ctx2.fillStyle = "#00ff8855";
  }
  if (mouse.x > startPos && mouse.y > startPos && mouse.x < size - startPos && mouse.y < size - startPos) {
    outerLoop: for (let x = startPos; x < size - squareSize; x += squareSize) {
      for (let y = startPos; y < size - squareSize; y += squareSize) {
        if (mouse.x > x && mouse.x < x + squareSize && (mouse.y > y) & (mouse.y < y + squareSize)) {
          ctx2.fillRect(x, y, squareSize, squareSize);
          break outerLoop;
        }
      }
    }
  }

  if (mouse.dragging) {
    canvas3.style.cursor = "none";
    ctx2.drawImage(mouse.piece.img, mouse.x + mouse.offSet.x, mouse.y + mouse.offSet.y, squareSize, squareSize);
  }
});

canvas3.addEventListener("mousedown", (evt) => {
  let coords = {
    x: Math.floor((mouse.x - startPos) / squareSize),
    y: Math.floor((mouse.y - startPos) / squareSize),
  };

  if (board.pieces[coords.x][coords.y]) {
    let tmpPiece = board.pieces[coords.x][coords.y];
    mouse.dragging = true;
    mouse.piece = new ChessPiece(tmpPiece.name, tmpPiece.color, tmpPiece.img, tmpPiece.x, tmpPiece.y);
    mouse.offSet = {
      x: coords.x * squareSize - mouse.x + startPos,
      y: coords.y * squareSize - mouse.y + startPos,
    };
    console.log("You clicked on a piece");
    console.log(board.pieces[coords.x][coords.y]);
    console.log(mouse);
    delete board.pieces[coords.x][coords.y];
    ctx3.clearRect(startPos + coords.x * squareSize, startPos + coords.y * squareSize, squareSize, squareSize);
  }

  if (!mouse.dragging) {
    console.log("You didn't click on a piece");
  }
});

canvas3.addEventListener("mouseup", (evt) => {
  if (mouse.dragging) {
    let coords = {
      x: Math.floor((mouse.x - startPos) / squareSize),
      y: Math.floor((mouse.y - startPos) / squareSize),
    };
    if (board.pieces[coords.x][coords.y]) {
      if (board.pieces[coords.x][coords.y].color !== mouse.piece.color) {
        ctx3.clearRect(coords.x * squareSize + startPos, coords.x * squareSize + startPos, squareSize, squareSize);
        ctx2.clearRect(coords.x * squareSize + startPos, coords.x * squareSize + startPos, squareSize, squareSize);
        ctx3.drawImage(mouse.piece.img, coords.x * squareSize + startPos, coords.y * squareSize + startPos, squareSize, squareSize);
        board.pieces[coords.x][coords.y] = new ChessPiece(mouse.piece.name, mouse.piece.color, mouse.piece.img, coords.x, coords.y);
      } else {
        ctx3.drawImage(mouse.piece.img, mouse.piece.x * squareSize + startPos, mouse.piece.y * squareSize + startPos, squareSize, squareSize);
        board.pieces[mouse.piece.x][mouse.piece.y] = new ChessPiece(mouse.piece.name, mouse.piece.color, mouse.piece.img, mouse.piece.x, mouse.piece.y);
      }
    } else {
      board.pieces[coords.x][coords.y] = new ChessPiece(mouse.piece.name, mouse.piece.color, mouse.piece.img, coords.x, coords.y);
      ctx3.drawImage(mouse.piece.img, coords.x * squareSize + startPos, coords.y * squareSize + startPos, squareSize, squareSize);
    }
    delete mouse.piece;
    mouse.dragging = false;
    canvas3.style.cursor = "default";
  }
});
