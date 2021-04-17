let canvas, ctx;
let hrs1 = new Image(), hrs2 = new Image();
let mins1 = new Image(), mins2 = new Image();
let secs1 = new Image(), secs2 = new Image();
let dots = new Image();

document.addEventListener("DOMContentLoaded", () => {
  canvas = document.querySelector("#canvas"),
    ctx = canvas.getContext("2d");
  
  let clock = new Clock(), time = new Date();
  hrs = time.getHours(), mins = time.getMinutes(), secs = time.getSeconds();
  
  hrs1.onload = () => {
    canvas.width = hrs1.width * 6 + 26;
    canvas.height = hrs1.height;
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hrs2 = clock.images[Math.floor(hrs % 10)];
    mins1 = clock.images[Math.floor(mins / 10)];
    mins2 = clock.images[hrs % 10];
    secs1 = clock.images[Math.floor(secs / 10)];
    secs2 = clock.images[secs % 10];
    dots = clock.images["dots"];
    ctx.drawImage(hrs1, 0, 0);
    ctx.drawImage(hrs2, hrs1.width * 1, 0);

    ctx.drawImage(dots, hrs1.width * 2, 0);
    
    ctx.drawImage(mins1, hrs1.width * 2 + 13, 0);
    ctx.drawImage(mins2, hrs1.width * 3 + 13, 0);
    
    ctx.drawImage(dots, hrs1.width * 4, 0);

    ctx.drawImage(secs1, hrs1.width * 4 + 26, 0);
    ctx.drawImage(secs2, hrs1.width * 5 + 26, 0);
  }
  hrs1.src = clock.images[Math.floor(hrs / 10)].src;

  clock.update(ctx);
});

class Clock {
  constructor(hrs, mins, secs) {
    let tmpDate = new Date;
    this.hrs = hrs || tmpDate.getHours();
    this.mins = mins || tmpDate.getMinutes();
    this.secs = secs || tmpDate.getSeconds();
    this.images = {
      "0": new Image(),
      "1": new Image(),
      "2": new Image(),
      "3": new Image(),
      "4": new Image(),
      "5": new Image(),
      "6": new Image(),
      "7": new Image(),
      "8": new Image(),
      "9": new Image(),
      "dots": new Image()
    }
      this.init();
    }
    
    init() {
      this.images["0"].src = "./images/0.png";
      this.images["1"].src = "./images/1.png";
      this.images["2"].src = "./images/2.png";
      this.images["3"].src = "./images/3.png";
      this.images["4"].src = "./images/4.png";
      this.images["5"].src = "./images/5.png";
      this.images["6"].src = "./images/6.png";
      this.images["7"].src = "./images/7.png";
      this.images["8"].src = "./images/8.png";
      this.images["9"].src = "./images/9.png";
      this.images["dots"].src = "./images/DotsFilled.png";
    }
    
    update(ctx) {
      let time = new Date();
      let hrs = time.getHours(), mins = time.getMinutes(), secs = time.getSeconds();
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      hrs1 = this.images[Math.floor(hrs / 10)];
      hrs2 = this.images[hrs % 10];
      mins1 = this.images[Math.floor(mins / 10)];
      mins2 = this.images[mins % 10];
      secs1 = this.images[Math.floor(secs / 10)];
      secs2 = this.images[secs % 10];
      ctx.drawImage(hrs1, 0, 0);
      ctx.drawImage(hrs2, hrs1.width * 1, 0);
      
      ctx.drawImage(dots, hrs1.width * 2, 0);
      
      ctx.drawImage(mins1, hrs1.width * 2 + 13, 0);
      ctx.drawImage(mins2, hrs1.width * 3 + 13, 0);
      
      ctx.drawImage(dots, hrs1.width * 4 + 13, 0);
      
      ctx.fillStyle = "black";
      ctx.fillRect(hrs1.width * 4 + 26, 0, canvas.width, canvas.height);
      ctx.fillStyle = "red";
      ctx.fillRect(hrs1.width * 4 + 26, Math.floor(this.images[8].height / 2), hrs1.width, canvas.height);

      ctx.drawImage(secs1, hrs1.width * 4 + 26, Math.floor(this.images[8].height / 2), this.images[8].width / 2, this.images[8].height / 2);
      ctx.drawImage(secs2, hrs1.width * 5 - (this.images[8].width / 2) + 26, Math.floor(this.images[8].height / 2), this.images[8].width / 2, this.images[8].height / 2);
      // ctx.drawImage(secs1, hrs1.width * 4 + 26, 0);
      // ctx.drawImage(secs2, hrs1.width * 5 + 26, 0);
      
      // document.querySelector("#time").innerHTML = time.toLocaleString().slice(-8);

      requestAnimationFrame(() => this.update(ctx));
    }
  }