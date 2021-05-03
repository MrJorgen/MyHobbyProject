export class ChessPiece {
  constructor(type, color, img, posX, posY, value) {
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
        this.moves = [{ y: -1 }];
      } else if (color == "black") {
        this.moves = [{ y: 1 }];
      }
    }
    this.value = value;
    this.pinned = false;
    this.legalMoves = [];
  }

  move(to, board) {
    this.hasMoved = true;
    this.x = to.x;
    this.y = to.y;
  }
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
