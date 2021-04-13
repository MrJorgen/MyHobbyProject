export class Player {
  constructor(color) {}
}

export class ChessPiece {
  constructor(name, color, img, posX, posY) {
    this.name = name;
    this.img = img;
    this.x = posX;
    this.y = posY;
    this.color = color;
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

const names = ["rook1", "knight1", "bishop1", "queen", "king", "bishop2", "knight2", "rook2", "pawn1", "pawn2", "pawn3", "pawn4", "pawn5", "pawn6", "pawn7", "pawn8"];

export const black = {
  rook1: { x: 0, y: 0, imgName: "BR" },
  knight1: { x: 1, y: 0, imgName: "BN" },
  bishop1: { x: 2, y: 0, imgName: "BB" },
  queen: { x: 3, y: 0, imgName: "BQ" },
  king: { x: 4, y: 0, imgName: "BK" },
  bishop2: { x: 5, y: 0, imgName: "BB" },
  knight2: { x: 6, y: 0, imgName: "BN" },
  rook2: { x: 7, y: 0, imgName: "BR" },
  pawn1: { x: 0, y: 1, imgName: "BP" },
  pawn2: { x: 1, y: 1, imgName: "BP" },
  pawn3: { x: 2, y: 1, imgName: "BP" },
  pawn4: { x: 3, y: 1, imgName: "BP" },
  pawn5: { x: 4, y: 1, imgName: "BP" },
  pawn6: { x: 5, y: 1, imgName: "BP" },
  pawn7: { x: 6, y: 1, imgName: "BP" },
  pawn8: { x: 7, y: 1, imgName: "BP" },
};

export const white = {
  rook1: { x: 0, y: 7, imgName: "WR" },
  knight1: { x: 1, y: 7, imgName: "WN" },
  bishop1: { x: 2, y: 7, imgName: "WB" },
  queen: { x: 3, y: 7, imgName: "WQ" },
  king: { x: 4, y: 7, imgName: "WK" },
  bishop2: { x: 5, y: 7, imgName: "WB" },
  knight2: { x: 6, y: 7, imgName: "WN" },
  rook2: { x: 7, y: 7, imgName: "WR" },
  pawn1: { x: 0, y: 6, imgName: "WP" },
  pawn2: { x: 1, y: 6, imgName: "WP" },
  pawn3: { x: 2, y: 6, imgName: "WP" },
  pawn4: { x: 3, y: 6, imgName: "WP" },
  pawn5: { x: 4, y: 6, imgName: "WP" },
  pawn6: { x: 5, y: 6, imgName: "WP" },
  pawn7: { x: 6, y: 6, imgName: "WP" },
  pawn8: { x: 7, y: 6, imgName: "WP" },
};
