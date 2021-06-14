let squareSize = Math.min(Math.floor(window.innerHeight / 100) * 10, Math.floor((window.innerWidth - 310) / 100) * 10);
let capturedPieces = { WHITE: [], BLACK: [] };
const boardElement = document.querySelector("#board");

document.documentElement.style.setProperty("--size", squareSize + "px");

window.addEventListener("resize", (e) => {
  squareSize = Math.min(Math.floor(window.innerHeight / 100) * 10, Math.floor((window.innerWidth - 310) / 100) * 10);
  document.documentElement.style.setProperty("--size", squareSize + "px");
});

document.querySelector("#setFen").addEventListener("click", () => {
  let fenStr = document.querySelector("#fenInput").value;
  if (fenStr) NewGame(fenStr);
});

document.querySelector("#takeButton").onclick = (e) => {
  if (GameBoard.hisPly > 0) {
    TakeMove();
    GameBoard.ply = 0;
    SetInitialBoardPieces();
  }
};

document.querySelector("#newGameButton").onclick = function () {
  NewGame(START_FEN);
};

function NewGame(fenStr) {
  ParseFen(fenStr);
  PrintBoard();
  SetInitialBoardPieces();
  CheckAndSet();
}

function ClearAllPieces() {
  document.querySelectorAll(".piece").forEach((ele) => {
    ele.remove();
  });
}

function SetInitialBoardPieces() {
  let sq120, pce;

  ClearAllPieces();

  for (let sq = 0; sq < 64; ++sq) {
    sq120 = SQ120(sq);
    pce = GameBoard.pieces[sq120];
    if (pce >= PIECES.wP && pce <= PIECES.bK) {
      AddGUIPiece(sq120, pce);
    }
  }
}

function DeSelectSq(sq) {
  document.querySelector(`square[data-square="${sq}"]`).classList.remove("highLight");
}

function SetSqSelected(sq) {
  document.querySelector(`square[data-square="${sq}"]`).classList.add("highLight");
}

boardElement.addEventListener("click", (evt) => {
  let square = parseInt(evt.target.dataset.square);

  // Try to extract legal moves from that square
  const start = GameBoard.moveListStart[GameBoard.ply];
  const end = GameBoard.moveListStart[GameBoard.ply + 1];

  for (let i = start; i < end; i++) {
    let currentMove = {
      from: FROMSQ(GameBoard.moveList[i]),
      to: TOSQ(GameBoard.moveList[i]),
      capture: CAPTURED(GameBoard.moveList[i]),
    };

    let parsed = ParseMove(currentMove.from, currentMove.to);
    if (parsed == NOMOVE) continue;
    console.log(currentMove);
    if (currentMove.from === square) {
      markValidMoves(currentMove);
    }
  }

  if ([...evt.target.classList].includes("piece")) {
    if (UserMove.from == SQUARES.NO_SQ) {
      UserMove.from = square;
    } else {
      UserMove.to = square;
    }

    SetSqSelected(square);
    MakeUserMove();
  } else if ([...evt.target.classList].includes("square")) {
    if (UserMove.from != SQUARES.NO_SQ) {
      UserMove.to = square;
      MakeUserMove();
    }
  }
});

function markValidMoves(move) {
  let marker = `<div class="marker"></div>`;
  let capture = `<div class="capture"></div>`;
  if (move.capture != PIECES.EMPTY) {
    // capture move
    document.querySelector(`square[data-square="${move.to}"]`).innerHTML += capture;
  } else {
    // "quiet" move
    document.querySelector(`square[data-square="${move.to}"]`).innerHTML += marker;
  }
}

function clearValidMoves() {
  document.querySelectorAll(".marker").forEach((e) => e.remove());
  document.querySelectorAll(".capture").forEach((e) => e.remove());
}

function MakeUserMove() {
  if (UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {
    console.log("User Move:" + PrSq(UserMove.from) + PrSq(UserMove.to));

    var parsed = ParseMove(UserMove.from, UserMove.to);

    if (parsed != NOMOVE) {
      MakeMove(parsed);
      PrintBoard();
      MoveGUIPiece(parsed);
      CheckAndSet();
      PreSearch();
    }

    DeSelectSq(UserMove.from);
    DeSelectSq(UserMove.to);
    clearValidMoves();

    UserMove.from = SQUARES.NO_SQ;
    UserMove.to = SQUARES.NO_SQ;
  }
}

function removeHightLights() {
  document.querySelectorAll(".highLight").forEach((ele) => {
    ele.classList.remove("highLight");
  });
}

function highLight(sq) {
  document.querySelector(`square[data-square="${sq}"]`).classList.add("highLight");
}

function PieceIsOnSq(sq, top, left) {
  if (RanksBrd[sq] == 7 - Math.round(top / squareSize) && FilesBrd[sq] == Math.round(left / squareSize)) {
    return true;
  }

  return false;
}

function RemoveGUIPiece(sq) {
  document.querySelector(`img[data-square="${sq}"]`).remove();
}

function AddGUIPiece(sq, pce) {
  var file = FilesBrd[sq];
  var rank = RanksBrd[sq];
  var rankName = "rank" + (rank + 1);
  var fileName = "file" + (file + 1);
  // var pieceFileName = "images/pieces/tournament/" + SideChar[PieceCol[pce]] + PceChar[pce].toLowerCase() + ".png";
  var pieceFileName = "images/pieces/default/" + SideChar[PieceCol[pce]] + PceChar[pce].toLowerCase() + ".svg";
  var imageString = '<image data-square="' + (21 + rank * 10 + file) + '" src="' + pieceFileName + '" class="piece ' + rankName + " " + fileName + '"/>';
  boardElement.innerHTML += imageString;
}

function MoveGUIPiece(move) {
  let from = FROMSQ(move);
  let to = TOSQ(move);
  // let capture = Object.keys(PIECES).find((key) => PIECES[key] === CAPTURED(move));
  let capture = CAPTURED(move);
  let turn = Object.keys(COLOURS).find((key) => (COLOURS[key] === GameBoard.side) ^ 1);

  if (capture !== PIECES.EMPTY) {
    capturedPieces[turn].push(capture);

    // Black captures
    capturedPieces.BLACK.sort();
    document.querySelector("#blackCaptures").innerHTML = "";
    for (let i = 0; i < capturedPieces.BLACK.length; i++) {
      let capturedPiece = capturedPieces.BLACK[i];
      let className = "";
      if (i > 0 && capturedPiece == capturedPieces.BLACK[i - 1]) {
        className = "class='stack'";
      }
      let pieceName = Object.keys(PIECES).find((key) => PIECES[key] === capturedPiece);
      let pieceFileName = "images/pieces/default/" + pieceName + ".svg";
      let imageString = '<image src="' + pieceFileName + '" ' + className + "/>";
      document.querySelector("#blackCaptures").innerHTML += imageString;
    }

    // White captures
    capturedPieces.WHITE.sort();
    document.querySelector("#whiteCaptures").innerHTML = "";
    for (let i = 0; i < capturedPieces.WHITE.length; i++) {
      let capturedPiece = capturedPieces.WHITE[i];
      let className = "";
      if (i > 0 && capturedPiece == capturedPieces.WHITE[i - 1]) {
        className = "class='stack'";
      }
      let pieceName = Object.keys(PIECES).find((key) => PIECES[key] === capturedPiece);
      let pieceFileName = "images/pieces/default/" + pieceName + ".svg";
      let imageString = '<image src="' + pieceFileName + '" ' + className + "/>";
      document.querySelector("#whiteCaptures").innerHTML += imageString;
    }
  }

  if (move & MFLAGEP) {
    var epRemove;
    if (GameBoard.side == COLOURS.BLACK) {
      epRemove = to - 10;
    } else {
      epRemove = to + 10;
    }
    RemoveGUIPiece(epRemove);
  } else if (CAPTURED(move)) {
    RemoveGUIPiece(to);
  }

  var file = FilesBrd[to];
  var rank = RanksBrd[to];
  var rankName = "rank" + (rank + 1);
  var fileName = "file" + (file + 1);

  let currentPiece = document.querySelector(`img[data-square="${from}"]`);
  currentPiece.className = "";
  currentPiece.classList.add(rankName);
  currentPiece.classList.add(fileName);
  currentPiece.classList.add("piece");
  currentPiece.dataset.square = to;

  removeHightLights();
  highLight(from);
  highLight(to);

  if (move & MFLAGCA) {
    switch (to) {
      case SQUARES.G1:
        RemoveGUIPiece(SQUARES.H1);
        AddGUIPiece(SQUARES.F1, PIECES.wR);
        break;
      case SQUARES.C1:
        RemoveGUIPiece(SQUARES.A1);
        AddGUIPiece(SQUARES.D1, PIECES.wR);
        break;
      case SQUARES.G8:
        RemoveGUIPiece(SQUARES.H8);
        AddGUIPiece(SQUARES.F8, PIECES.bR);
        break;
      case SQUARES.C8:
        RemoveGUIPiece(SQUARES.A8);
        AddGUIPiece(SQUARES.D8, PIECES.bR);
        break;
    }
  } else if (PROMOTED(move)) {
    RemoveGUIPiece(to);
    AddGUIPiece(to, PROMOTED(move));
  }
}

function DrawMaterial() {
  if (GameBoard.pceNum[PIECES.wP] != 0 || GameBoard.pceNum[PIECES.bP] != 0) return false;
  if (GameBoard.pceNum[PIECES.wQ] != 0 || GameBoard.pceNum[PIECES.bQ] != 0 || GameBoard.pceNum[PIECES.wR] != 0 || GameBoard.pceNum[PIECES.bR] != 0) return false;
  if (GameBoard.pceNum[PIECES.wB] > 1 || GameBoard.pceNum[PIECES.bB] > 1) {
    return false;
  }
  if (GameBoard.pceNum[PIECES.wN] > 1 || GameBoard.pceNum[PIECES.bN] > 1) {
    return false;
  }

  if (GameBoard.pceNum[PIECES.wN] != 0 && GameBoard.pceNum[PIECES.wB] != 0) {
    return false;
  }
  if (GameBoard.pceNum[PIECES.bN] != 0 && GameBoard.pceNum[PIECES.bB] != 0) {
    return false;
  }

  return true;
}

function ThreeFoldRep() {
  var i = 0,
    r = 0;

  for (i = 0; i < GameBoard.hisPly; ++i) {
    if (GameBoard.history[i].posKey == GameBoard.posKey) {
      r++;
    }
  }
  return r;
}

function CheckResult() {
  if (GameBoard.fiftyMove >= 100) {
    document.querySelector("#gameStatus").textContent = "GAME DRAWN {fifty move rule}";
    return true;
  }

  if (ThreeFoldRep() >= 2) {
    document.querySelector("#gameStatus").textContent = "GAME DRAWN {3-fold repetition}";
    return true;
  }

  if (DrawMaterial() == true) {
    document.querySelector("#gameStatus").textContent = "GAME DRAWN {insufficient material to mate}";
    return true;
  }

  GenerateMoves();

  var MoveNum = 0;
  var found = 0;

  for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
    if (MakeMove(GameBoard.moveList[MoveNum]) == false) {
      continue;
    }
    found++;
    TakeMove();
    break;
  }

  if (found != 0) return false;

  var InCheck = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], GameBoard.side ^ 1);

  if (InCheck == true) {
    if (GameBoard.side == COLOURS.WHITE) {
      document.querySelector("#gameStatus").textContent = "GAME OVER {black mates}";
      return true;
    } else {
      document.querySelector("#gameStatus").textContent = "GAME OVER {white mates}";
      return true;
    }
  } else {
    document.querySelector("#gameStatus").textContent = "GAME DRAWN {stalemate}";
    return true;
  }

  return false;
}

function CheckAndSet() {
  if (CheckResult() == true) {
    GameController.GameOver = true;
  } else {
    GameController.GameOver = false;
    document.querySelector("#gameStatus").textContent = "";
  }
}

function PreSearch() {
  if (GameController.GameOver == false) {
    SearchController.thinking = true;
    setTimeout(function () {
      StartSearch();
    }, 200);
  }
}

document.querySelector("#searchButton").onclick = function () {
  GameController.PlayerSide = GameController.side ^ 1;
  PreSearch();
};

function StartSearch() {
  SearchController.depth = MAXDEPTH;
  var t = performance.now();
  var tt = document.querySelector("#thinkTimeChoice").value;

  SearchController.time = parseInt(tt) * 1000;
  SearchPosition();

  MakeMove(SearchController.best);
  MoveGUIPiece(SearchController.best);
  CheckAndSet();
}
