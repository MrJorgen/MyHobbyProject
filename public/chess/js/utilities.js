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

export function loadImages(theme) {
  black.forEach(async (piece) => {
    piece.img = await loadImage(`./img/pieces/${theme}/${piece.imgName}.png`);
    delete piece.imgName;
  });

  black.forEach(async (piece) => {
    piece.img = await loadImage(`./img/pieces/${theme}/${piece.imgName}.png`);
    delete piece.imgName;
  });
}

const black = [
  { color: "black", x: 0, y: 0, imgName: "br", type: "rook", value: 500 },
  { color: "black", x: 1, y: 0, imgName: "bn", type: "knight", value: 320 },
  { color: "black", x: 2, y: 0, imgName: "bb", type: "bishop", value: 330 },
  { color: "black", x: 3, y: 0, imgName: "bq", type: "queen", value: 900 },
  { color: "black", x: 4, y: 0, imgName: "bk", type: "king", value: Infinity },
  { color: "black", x: 5, y: 0, imgName: "bb", type: "bishop", value: 330 },
  { color: "black", x: 6, y: 0, imgName: "bn", type: "knight", value: 320 },
  { color: "black", x: 7, y: 0, imgName: "br", type: "rook", value: 500 },
  { color: "black", x: 0, y: 1, imgName: "bp", type: "pawn", value: 100 },
  { color: "black", x: 1, y: 1, imgName: "bp", type: "pawn", value: 100 },
  { color: "black", x: 2, y: 1, imgName: "bp", type: "pawn", value: 100 },
  { color: "black", x: 3, y: 1, imgName: "bp", type: "pawn", value: 100 },
  { color: "black", x: 4, y: 1, imgName: "bp", type: "pawn", value: 100 },
  { color: "black", x: 5, y: 1, imgName: "bp", type: "pawn", value: 100 },
  { color: "black", x: 6, y: 1, imgName: "bp", type: "pawn", value: 100 },
  { color: "black", x: 7, y: 1, imgName: "bp", type: "pawn", value: 100 },
];

const white = [
  { color: "white", x: 0, y: 7, imgName: "wr", type: "rook", value: 500 },
  { color: "white", x: 1, y: 7, imgName: "wn", type: "knight", value: 320 },
  { color: "white", x: 2, y: 7, imgName: "wb", type: "bishop", value: 330 },
  { color: "white", x: 3, y: 7, imgName: "wq", type: "queen", value: 900 },
  { color: "white", x: 4, y: 7, imgName: "wk", type: "king", value: Infinity },
  { color: "white", x: 5, y: 7, imgName: "wb", type: "bishop", value: 330 },
  { color: "white", x: 6, y: 7, imgName: "wn", type: "knight", value: 320 },
  { color: "white", x: 7, y: 7, imgName: "wr", type: "rook", value: 500 },
  { color: "white", x: 0, y: 6, imgName: "wp", type: "pawn", value: 100 },
  { color: "white", x: 1, y: 6, imgName: "wp", type: "pawn", value: 100 },
  { color: "white", x: 2, y: 6, imgName: "wp", type: "pawn", value: 100 },
  { color: "white", x: 3, y: 6, imgName: "wp", type: "pawn", value: 100 },
  { color: "white", x: 4, y: 6, imgName: "wp", type: "pawn", value: 100 },
  { color: "white", x: 5, y: 6, imgName: "wp", type: "pawn", value: 100 },
  { color: "white", x: 6, y: 6, imgName: "wp", type: "pawn", value: 100 },
  { color: "white", x: 7, y: 6, imgName: "wp", type: "pawn", value: 100 },
];

export const colors = [black, white];

export function make2dArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

export const themes = {
  line: "rgba(128, 128, 128, 1",
  silver: {
    black: "#b0b2b5",
    white: "#e5e5e6",
    padding: "#cdcdd0",
  },
  brown: {
    black: "rgb(181,136,99)",
    white: "rgb(240,217,181)",
    padding: "rgb(211, 176, 141)",
  },
  texture_warm: {
    // black: "rgba(181, 136, 99, 1)",
    // white: "rgba(240, 217, 181, 1)",
    black: "rgba(69, 49, 33, 0.75)",
    white: "rgba(255, 255, 255, 0.0)",
    // img: "./img/textures/seamless-wood-texture-4.jpg",
    // black: "rgba(0, 0, 0, 0.5)",
    // white: "rgba(255, 255, 255, 0.75)",
    img: "./img/textures/seamless-wood-background-1.jpg",
    // padding: "rgba(211, 176, 141, 1)",
    padding: "rgb(225 149 68)",
    composit: "hard-light",
  },
  texture_dark: {
    black: "rgba(0, 0, 0, 0.5)",
    white: "rgba(255, 255, 255, 0.0)",
    padding: "rgba(128, 128, 128, 0.75)",
    img: "./img/textures/seamless-wood-texture-4.jpg",
    // composit: "overlay",
    composit: "hard-light",
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
