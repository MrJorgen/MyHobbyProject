export class Player {
  constructor(color) {}
}

export class ChessPiece {
  constructor(type, color, img, posX, posY) {
    this.type = type;
    this.img = img;
    this.x = posX;
    this.y = posY;
    this.color = color;
    this.hasMoved = false;
    if (type !== "pawn") {
      this.moves = moves[this.type];
    } else {
      if (color === "white") {
        this.moves = [{ y: -1 }, { y: -2 }];
      } else {
        this.moves = [{ y: 1 }, { y: 2 }];
      }
    }
  }

  move(to) {
    this.hasMoved = true;
    this.x = to.x;
    this.y = to.y;
  }
}

export class ChessBoard {
  constructor() {
    this.pieces = make2dArray(8, 8);
  }
}

function make2dArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

const moves = {
  rook: [
    { x: 1, repeat: true },
    { x: -1, repeat: true },
    { y: 1, repeat: true },
    { y: -1, repeat: true },
  ],
  knight: [
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: -2, y: 1 },
    { x: -2, y: -1 },
    { x: 1, y: 2 },
    { x: 1, y: -2 },
    { x: -1, y: 2 },
    { x: -1, y: -2 },
  ],
  bishop: [
    { x: 1, y: 1, repeat: true },
    { x: 1, y: -1, repeat: true },
    { x: -1, y: 1, repeat: true },
    { x: -1, y: -1, repeat: true },
  ],
  queen: [
    { x: 1, repeat: true },
    { x: -1, repeat: true },
    { y: 1, repeat: true },
    { y: -1, repeat: true },
    { x: 1, y: 1, repeat: true },
    { x: 1, y: -1, repeat: true },
    { x: -1, y: 1, repeat: true },
    { x: -1, y: -1, repeat: true },
  ],
  king: [{ x: 1 }, { x: -1 }, { y: 1 }, { y: -1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }],
};

export const black = [
  { x: 0, y: 0, imgName: "br", type: "rook" },
  { x: 1, y: 0, imgName: "bn", type: "knight" },
  { x: 2, y: 0, imgName: "bb", type: "bishop" },
  { x: 3, y: 0, imgName: "bq", type: "queen" },
  { x: 4, y: 0, imgName: "bk", type: "king" },
  { x: 5, y: 0, imgName: "bb", type: "bishop" },
  { x: 6, y: 0, imgName: "bn", type: "knight" },
  { x: 7, y: 0, imgName: "br", type: "rook" },
  { x: 0, y: 1, imgName: "bp", type: "pawn" },
  { x: 1, y: 1, imgName: "bp", type: "pawn" },
  { x: 2, y: 1, imgName: "bp", type: "pawn" },
  { x: 3, y: 1, imgName: "bp", type: "pawn" },
  { x: 4, y: 1, imgName: "bp", type: "pawn" },
  { x: 5, y: 1, imgName: "bp", type: "pawn" },
  { x: 6, y: 1, imgName: "bp", type: "pawn" },
  { x: 7, y: 1, imgName: "bp", type: "pawn" },
];

export const white = [
  { x: 0, y: 7, imgName: "wr", type: "rook" },
  { x: 1, y: 7, imgName: "wn", type: "knight" },
  { x: 2, y: 7, imgName: "wb", type: "bishop" },
  { x: 3, y: 7, imgName: "wq", type: "queen" },
  { x: 4, y: 7, imgName: "wk", type: "king" },
  { x: 5, y: 7, imgName: "wb", type: "bishop" },
  { x: 6, y: 7, imgName: "wn", type: "knight" },
  { x: 7, y: 7, imgName: "wr", type: "rook" },
  { x: 0, y: 6, imgName: "wp", type: "pawn" },
  { x: 1, y: 6, imgName: "wp", type: "pawn" },
  { x: 2, y: 6, imgName: "wp", type: "pawn" },
  { x: 3, y: 6, imgName: "wp", type: "pawn" },
  { x: 4, y: 6, imgName: "wp", type: "pawn" },
  { x: 5, y: 6, imgName: "wp", type: "pawn" },
  { x: 6, y: 6, imgName: "wp", type: "pawn" },
  { x: 7, y: 6, imgName: "wp", type: "pawn" },
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

let test = [
  ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
  ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
  ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
  ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
  ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
  ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
  ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"],
];
