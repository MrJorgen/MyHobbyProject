export function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    // image.src = `./img/${src}.svg`;
    image.src = src;
  });
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

export function make2dArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

export const themes = {
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
