export function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = src;
  });
}

export class ChessImages {
  constructor(settings) {
    this.settings = settings;
  }

  async loadImages() {
    const settings = this.settings;
    this.black = {
      pawn: await loadImage(`./img/pieces/${settings.theme.name}/bp${settings.theme.format}`),
      rook: await loadImage(`./img/pieces/${settings.theme.name}/br${settings.theme.format}`),
      knight: await loadImage(`./img/pieces/${settings.theme.name}/bn${settings.theme.format}`),
      bishop: await loadImage(`./img/pieces/${settings.theme.name}/bb${settings.theme.format}`),
      queen: await loadImage(`./img/pieces/${settings.theme.name}/bq${settings.theme.format}`),
      king: await loadImage(`./img/pieces/${settings.theme.name}/bk${settings.theme.format}`),
    };
    this.white = {
      pawn: await loadImage(`./img/pieces/${settings.theme.name}/wp${settings.theme.format}`),
      rook: await loadImage(`./img/pieces/${settings.theme.name}/wr${settings.theme.format}`),
      knight: await loadImage(`./img/pieces/${settings.theme.name}/wn${settings.theme.format}`),
      bishop: await loadImage(`./img/pieces/${settings.theme.name}/wb${settings.theme.format}`),
      queen: await loadImage(`./img/pieces/${settings.theme.name}/wq${settings.theme.format}`),
      king: await loadImage(`./img/pieces/${settings.theme.name}/wk${settings.theme.format}`),
    };
  }
}

export function make2dArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

export const themes = {
  boards: {
    silver: {
      black: "rgb(176, 178, 181)",
      white: "rgb(229, 229, 230)",
      padding: "#cdcdd0",
      line: "rgba(80, 80, 80, 1)",
    },
    green: {
      black: "rgb(118, 150, 86)",
      white: "rgb(238, 238, 210)",
      padding: "rgb(178, 194, 148)",
    },
    brown: {
      black: "rgb(181,136,99)",
      white: "rgb(240,217,181)",
      padding: "rgb(211, 176, 141)",
    },
    texture_warm: {
      black: "rgba(69, 49, 33, 0.75)",
      white: "rgba(255, 255, 255, 0.0)",
      img: "./img/textures/seamless-wood-background-1.jpg",
      padding: "rgb(225 149 68)",
      composit: "hard-light",
    },
    texture_dark: {
      black: "rgba(0, 0, 0, 0.5)",
      white: "rgba(255, 255, 255, 0.0)",
      padding: "rgba(128, 128, 128, 0.75)",
      img: "./img/textures/seamless-wood-texture-4.jpg",
      composit: "hard-light",
    },
    two_textures: {
      black: "rgba(0, 0, 0, 0)",
      white: "rgba(255, 255, 255, 0)",
      padding: "rgba(128, 128, 128, 0.75)",
      // img_light: "./img/textures/seamless-wood-texture-5.jpg",
      img_light: "./img/textures/seamless-wood-background-1.jpg",
      img_dark: "./img/textures/texture-seamless-wood-3.jpg",
    },
  },
  pieces: [
    { name: "default", format: ".svg" },
    { name: "neo", format: ".png" },
    { name: "game_room", format: ".png" },
    { name: "tournament", format: ".png" },
  ],
};
