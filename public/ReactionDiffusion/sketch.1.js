let grid, next;
let dA = 1, dB = 0.5, feed = 0.055, k = 0.062;

function setup() {
  createCanvas(400, 400);
  // createCanvas(window.innerWidth, window.innerHeight);
  pixelDensity(1);
  grid = [], next = [];

  for (let x = 0; x < width; x++) {
    grid[x] = [], next[x] = [];

    for (let y = 0; y < height; y++) {
      grid[x][y] = { a: 1, b: 0 };
      next[x][y] = { a: 1, b: 0 };
    }
  }

  // + sign
  // for (let i = 0; i < width; i++) {
  //   for (let j = 0; j < width; j++) {
  //     if (i == floor(width / 2) || j == floor(height / 2)) {
  //       grid[i][j].b = 1;
  //     }
  //   }
  // }

  // Outline
  // for (let i = 0; i < width; i++) {
  //   for (let j = 0; j < height; j++) {
  //     if (i < 10 || j < 10 || i > width - 10 || j > height - 10) {
  //       grid[i][j].b = 1;
  //     }
  //   }
  // }

  // Cross
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (i - j == 0 || i + j == width) {
        grid[i][j].b = 1;
      }
    }
  }


  // Centered square
  // for (let i = floor(width / 2) - 50; i < floor(width / 2) + 50; i++) {
  //   for (let j = floor(height / 2) - 50; j < floor(height / 2) + 50; j++) {
  //     grid[i][j].b = 1;
  //   }
  // }

}

function draw() {
  // background(51);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = grid[x][y].a;
      let b = grid[x][y].b;
      next[x][y].a = a +
        (dA * laplace(x, y, "a")) -
        (a * b * b) +
        (feed * (1 - a));
      next[x][y].b = b +
        (dB * laplace(x, y, "b")) +
        (a * b * b) -
        ((k + feed) * b);

      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);

    }
  }

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let pix = (x + y * width) * 4;
      let a = next[x][y].a;
      let b = next[x][y].b;
      let c = floor((a - b) * 255);
      c = constrain(c, 0, 255);
      pixels[pix + 0] = c;
      pixels[pix + 1] = c;
      pixels[pix + 2] = c;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();

  swap();
}


function laplace(x, y, obj) {
  let sum = 0;
  sum += grid[x][y][obj] * -1;
  if (x > 1) {
    sum += grid[x - 1][y][obj] * 0.2;
  }

  if (x > 1 && y < height - 1) {
    sum += grid[x - 1][y + 1][obj] * 0.05;
  }

  if (x > 1 && y > 1) {
    sum += grid[x - 1][y - 1][obj] * 0.05;
  }

  if (y > 1) {
    sum += grid[x][y - 1][obj] * 0.2;
  }

  if (x < height - 1 && y > 1) {
    sum += grid[x + 1][y - 1][obj] * 0.05;
  }

  if (x < width - 1) {
    sum += grid[x + 1][y][obj] * 0.2;
  }

  if (x < width - 1 && y < height - 1) {
    sum += grid[x + 1][y + 1][obj] * 0.05;
  }

  if (y < height - 1) {
    sum += grid[x][y + 1][obj] * 0.2;
  }

  return sum;
}



function swap() {
  let temp = grid;
  grid = next;
  next = temp;
}