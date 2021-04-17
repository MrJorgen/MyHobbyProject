class Sevenseg {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  init() {
    let tmpCanvas = document.createElement("canvas");
    let ctx = tmpCanvas.getContext("2d");
    tmpCanvas.width = this.width;
    tmpCanvas.height = this.height;
  }

  a() {

  }

  b() {

  }
}
