export class Player {
  constructor(color, ai = false) {
    this.color = color;
    this.pieces = [];
    this.possibleMoves = [];
    this.ai = ai;
    this.checked = false;
  }
}

export class ChessBoard {
  constructor(ctx, squareSize, guideCtx, ai) {
    this.pieces = make2dArray(8, 8);
    this.turn = "white";
    this.ctx = ctx;
    this.squareSize = squareSize;
    this.recent = [];
    this.guides = {
      ctx: guideCtx,
    };
    this.players = {
      white: new Player("white"),
      black: new Player("black", true),
    };
  }

  setup(size) {
    this.ctx.clearRect(0, 0, size, size);
    for (let tmp of this.pieces) {
      for (let piece of tmp) {
        if (piece) {
          this.drawPiece(piece, piece);
        }
      }
    }
  }

  movePiece(from, to) {}

  update() {}

  redraw() {
    let startPos = this.squareSize / 2;
    this.ctx.clearRect(startPos, startPos, this.squareSize * 8, this.squareSize * 8);
    for (let x = 0; x < this.pieces.length; x++) {
      for (let y = 0; y < this.pieces[x].length; y++) {
        let piece = this.pieces[x][y];
        this.ctx.drawImage(piece.img, piece.x * this.squareSize + startPos, piece.y * this.squareSize + startPos, this.squareSize, this.squareSize);
      }
    }
  }

  drawPiece(piece, coords) {
    let { x, y } = coords;
    let startPos = this.squareSize / 2;
    this.ctx.clearRect(startPos + x * this.squareSize, startPos + y * this.squareSize, this.squareSize, this.squareSize);
    this.ctx.drawImage(piece.img, x * this.squareSize + startPos, y * this.squareSize + startPos, this.squareSize, this.squareSize);
  }

  clearSquare(coords) {
    let { x, y } = coords,
      startPos = this.squareSize / 2;
    this.ctx.clearRect(x * this.squareSize + startPos, y * this.squareSize + startPos, this.squareSize, this.squareSize);
  }
}

function make2dArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
export const black = [
  { x: 0, y: 0, imgName: "br", type: "rook", value: 5 },
  { x: 1, y: 0, imgName: "bn", type: "knight", value: 3 },
  { x: 2, y: 0, imgName: "bb", type: "bishop", value: 3 },
  { x: 3, y: 0, imgName: "bq", type: "queen", value: 9 },
  { x: 4, y: 0, imgName: "bk", type: "king", value: Infinity },
  { x: 5, y: 0, imgName: "bb", type: "bishop", value: 3 },
  { x: 6, y: 0, imgName: "bn", type: "knight", value: 3 },
  { x: 7, y: 0, imgName: "br", type: "rook", value: 5 },
  { x: 0, y: 1, imgName: "bp", type: "pawn", value: 1 },
  { x: 1, y: 1, imgName: "bp", type: "pawn", value: 1 },
  { x: 2, y: 1, imgName: "bp", type: "pawn", value: 1 },
  { x: 3, y: 1, imgName: "bp", type: "pawn", value: 1 },
  { x: 4, y: 1, imgName: "bp", type: "pawn", value: 1 },
  { x: 5, y: 1, imgName: "bp", type: "pawn", value: 1 },
  { x: 6, y: 1, imgName: "bp", type: "pawn", value: 1 },
  { x: 7, y: 1, imgName: "bp", type: "pawn", value: 1 },
];

export const white = [
  { x: 0, y: 7, imgName: "wr", type: "rook", value: 5 },
  { x: 1, y: 7, imgName: "wn", type: "knight", value: 3 },
  { x: 2, y: 7, imgName: "wb", type: "bishop", value: 3 },
  { x: 3, y: 7, imgName: "wq", type: "queen", value: 9 },
  { x: 4, y: 7, imgName: "wk", type: "king", value: Infinity },
  { x: 5, y: 7, imgName: "wb", type: "bishop", value: 3 },
  { x: 6, y: 7, imgName: "wn", type: "knight", value: 3 },
  { x: 7, y: 7, imgName: "wr", type: "rook", value: 5 },
  { x: 0, y: 6, imgName: "wp", type: "pawn", value: 1 },
  { x: 1, y: 6, imgName: "wp", type: "pawn", value: 1 },
  { x: 2, y: 6, imgName: "wp", type: "pawn", value: 1 },
  { x: 3, y: 6, imgName: "wp", type: "pawn", value: 1 },
  { x: 4, y: 6, imgName: "wp", type: "pawn", value: 1 },
  { x: 5, y: 6, imgName: "wp", type: "pawn", value: 1 },
  { x: 6, y: 6, imgName: "wp", type: "pawn", value: 1 },
  { x: 7, y: 6, imgName: "wp", type: "pawn", value: 1 },
];

/*

Values:
-----------
Pawn: 1
Bishop: 3
Knight: 3
Rook: 5
Queen: 9


*/

const test = [
  ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
  ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
  ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
  ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
  ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
  ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
  ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"],
];
