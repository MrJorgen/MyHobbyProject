import { black, white, ChessBoard, Player } from "./classes.js";
import { GuideLayer } from "./GuideLayer.js";
import { ChessPiece } from "./Piece.js";
import { loadImage } from "./utilities.js";

const messageEle = document.querySelector("#message"),
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
  theme = "texture_dark";

size -= size % 9;

const squareSize = size / 9,
  startPos = squareSize / 2 - 0.5;

canvas.width = canvas2.width = canvas3.width = animCanvas.width = size;
canvas.height = canvas2.height = canvas3.height = animCanvas.height = size;
const board = new ChessBoard(piecesCtx, squareSize, guideCtx);
const guides = new GuideLayer(guideCtx, squareSize);
const players = board.players;
loadPieces();

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

    drawBoard(false);
    board.setup(size);
    getAllPossbileMoves("white", false);
    getAllPossbileMoves("black", false);
    guides.clearAll();
  }
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

      // No need to fill squares anymore
      /*
      guideCtx.fillStyle = "#0088ff55";
      if (mouse.x > startPos && mouse.y > startPos && mouse.x < size - startPos && mouse.y < size - startPos) {
        outerLoop: for (let x = startPos; x < size - squareSize; x += squareSize) {
          for (let y = startPos; y < size - squareSize; y += squareSize) {
            if (mouse.x > x && mouse.x < x + squareSize && mouse.y > y && mouse.y < y + squareSize) {
              // guideCtx.clearRect(x, y, squareSize, squareSize);
              // guideCtx.fillRect(x, y, squareSize, squareSize);
              break outerLoop;
            }
          }
        }
      }
      */
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
    mouse.piece = Object.assign({}, board.pieces[coords.x][coords.y]);

    delete board.pieces[coords.x][coords.y];
    piecesCtx.clearRect(startPos + coords.x * squareSize, startPos + coords.y * squareSize, squareSize, squareSize);
    animCtx.drawImage(mouse.piece.img, mouse.x - startPos, mouse.y - startPos, squareSize, squareSize);
    animCanvas.style.cursor = "grabbing";

    for (let move of mouse.piece.legalMoves) {
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

    // Check if the square is in the array of allowed moves
    for (let i = 0; i < mouse.piece.legalMoves.length; i++) {
      if (mouse.piece.legalMoves[i].x === coords.x && mouse.piece.legalMoves[i].y === coords.y) {
        moveIsLegal = true;
      }
    }

    // Piece is dropped on the board
    if (moveIsLegal) {
      // Square has a piece on it
      if (board.pieces[coords.x][coords.y]) {
        // Square is occupied by the opponent so it's a capture
        if (board.pieces[coords.x][coords.y].color !== mouse.piece.color) {
          board.clearSquare(coords);
          mouse.pice = Object.assign(mouse.piece, coords);
          board.pieces[coords.x][coords.y] = Object.assign({}, mouse.piece);
          board.pieces[coords.x][coords.y].hasMoved = true;
          board.drawPiece(mouse.piece, coords);
        }
      } else {
        // Square is empty
        mouse.pice = Object.assign(mouse.piece, coords);
        board.pieces[coords.x][coords.y] = Object.assign({}, mouse.piece);
        board.pieces[coords.x][coords.y].hasMoved = true;
        board.drawPiece(mouse.piece, coords);
      }

      updatePlayerPieces();
      let isPlayerChecked = isChecked(board.turn);
      let isOpponentChecked = isChecked(opponent);

      if (isOpponentChecked) {
        let checkedKing = players[opponent].pieces.filter((piece) => {
          return piece.type === "king";
        })[0];
        console.log(checkedKing);
        messageEle.style.opacity = "1";
        messageEle.textContent = `${opponent} is checked`;
        setTimeout(() => {
          messageEle.style.opacity = "0";
        }, 1500);
      }

      if (isPlayerChecked) {
        messageEle.style.opacity = "1";
        messageEle.textContent = `${board.turn} is checked`;
        setTimeout(() => {
          messageEle.style.opacity = "0";
        }, 1500);
      }

      // Player has moved, switch turns
      board.turn = board.turn === "black" ? "white" : "black";

      // Check if it's AIs turn
      getAllPossbileMoves(opponent, false);
      if (players[board.turn].ai) {
        // Ok, so implement some kind of AI to move pieces
        // animCanvas.style.cursor = "wait";
        guides.clearAll();

        getAllPossbileMoves(board.turn, true);
        // guideCtx.clearRect(0, 0, size, size);
      } else {
        animCanvas.style.cursor = "default";
      }
    } else {
      // Square is not legal
      guideCtx.clearRect(0, 0, size, size);
      piecesCtx.drawImage(mouse.piece.img, mouse.piece.x * squareSize + startPos, mouse.piece.y * squareSize + startPos, squareSize, squareSize);
      board.pieces[mouse.piece.x][mouse.piece.y] = Object.assign({}, mouse.piece);
    }
    animCtx.clearRect(0, 0, size, size);
    delete mouse.piece;
    mouse.dragging = false;
    if (animCanvas.style.cursor !== "wait") {
      animCanvas.style.cursor = "default";
    }
  }
});

// This is for AI to know which moves it has choose from
function getAllPossbileMoves(color, aiMoves = true) {
  let player = players[color];
  player.possibleMoves = [];
  for (let i = 0; i < player.pieces.length; i++) {
    let tmpArray = [];
    let piece = player.pieces[i];
    tmpArray = findLegalMoves(piece);
    if (tmpArray.length > 0) {
      player.possibleMoves.push({ piece, movesTo: tmpArray });
    }
  }
  if (!aiMoves) {
    return player.possibleMoves;
  }

  // Frome here on it's about ai making a move
  // Make a random move
  if (player.possibleMoves.length > 0) {
    // Get a random piece
    let pieceIndex = Math.floor(Math.random() * player.possibleMoves.length);

    // Make a random move with that piece
    let moveIndex = Math.floor(Math.random() * player.possibleMoves[pieceIndex].movesTo.length);

    let oldX = player.possibleMoves[pieceIndex].piece.x,
      oldY = player.possibleMoves[pieceIndex].piece.y;

    let newX = player.possibleMoves[pieceIndex].movesTo[moveIndex].x,
      newY = player.possibleMoves[pieceIndex].movesTo[moveIndex].y;

    // It is a capture
    if (board.pieces[newX][newY]) {
      delete board.pieces[newX][newY];
      piecesCtx.clearRect(newX * squareSize + startPos, newY * squareSize + startPos, squareSize, squareSize);
    }

    board.pieces[newX][newY] = Object.assign({}, board.pieces[oldX][oldY]);
    let currentPiece = board.pieces[newX][newY];
    currentPiece.x = newX;
    currentPiece.y = newY;

    guideCtx.fillStyle = "rgb(220, 200, 100, 0.5)";
    guideCtx.fillRect(newX * squareSize + startPos, newY * squareSize + startPos, squareSize, squareSize);
    guideCtx.fillRect(oldX * squareSize + startPos, oldY * squareSize + startPos, squareSize, squareSize);

    board.clearSquare({ x: oldX, y: oldY });
    board.drawPiece(currentPiece, { x: newX, y: newY });
    delete board.pieces[oldX][oldY];

    let oppenentColor = color === "black" ? "white" : "black";
    getAllPossbileMoves(oppenentColor, false);
    updatePlayerPieces();
    board.turn = board.turn === "black" ? "white" : "black";
  } else {
    // No possible moves
    // This is where checkmate and/or stalemate happens
  }
}

function updatePlayerPieces() {
  players.white.pieces = [];
  players.black.pieces = [];
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (board.pieces[x][y]) {
        players[board.pieces[x][y].color].pieces.push(board.pieces[x][y]);
      }
    }
  }
}

document.querySelector("#themeSelect").addEventListener("change", (evt) => {
  theme = evt.target.value;
  drawBoard();
});

function findLegalMoves(piece) {
  piece.legalMoves = [];

  for (let i = 0; i < piece.moves.length; i++) {
    let x = piece.x,
      y = piece.y,
      repeat = piece.moves[i].repeat || false;

    do {
      x += piece.moves[i].x || 0;
      y += piece.moves[i].y || 0;
      if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        // Pawn captures
        if (piece.type === "pawn" && !repeat) {
          if (x >= 1 && board.pieces[x - 1][y] && board.pieces[x - 1][y].color !== piece.color) {
            piece.legalMoves.push({ x: x - 1, y, isCapture: true });
          }
          if (x <= 6 && board.pieces[x + 1][y] && board.pieces[x + 1][y].color !== piece.color) {
            piece.legalMoves.push({ x: x + 1, y, isCapture: true });
          }
          if ((piece.color === "white" && piece.y === 6) || (piece.color === "black" && piece.y === 1)) {
            repeat = true;
          }
        } else if (piece.type === "pawn" && repeat) {
          repeat = false;
        }

        if (board.pieces[x][y]) {
          repeat = false;
          // Take opponents piece
          if (board.pieces[x][y].color !== piece.color && piece.type !== "pawn") {
            piece.legalMoves.push({ x, y, isCapture: true });
          }
        } else {
          // Move to empty square
          piece.legalMoves.push({ x, y, isCapture: false });
        }
      } else {
        repeat = false;
      }
    } while (repeat);
  }
  return piece.legalMoves;
}

function isChecked(color) {
  // Find oppenent
  let opponent = color === "white" ? "black" : "white";

  // Get all oppenent moves
  let tmpArray = getAllPossbileMoves(opponent, false);

  // Find my king
  let myKing = players[color].pieces.filter((piece) => {
    return piece.type === "king";
  })[0];

  // Check if my king is under attack from oppenent
  for (let i = 0; i < tmpArray.length; i++) {
    for (let j = 0; j < tmpArray[i].movesTo.length; j++) {
      if (tmpArray[i].movesTo[j].x === myKing.x && tmpArray[i].movesTo[j].y === myKing.y) {
        // Ok, my king is checked
        console.log(color + " is checked!");
        return true;
      }
    }
  }
  return false;
}
