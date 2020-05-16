let canvas, ctx, WIDTH, HEIGHT, counter = 0;

function setup() {
  canvas = document.querySelector("#mainCanvas"),
    ctx = canvas.getContext("2d");
  WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  noise.seed(Math.random());
  draw();
}

function draw(time = 0) {
  ctx.fillStyle = "rgb(120, 120, 255)";
  ctx.strokeStyle = "rgb(0, 0, 0)";
  ctx.lineWidth = 3;

  var image = ctx.createImageData(canvas.width, canvas.height);
  var data = image.data;

  for (let x = 0; x < WIDTH; x++){
    for (let y = 0; y < HEIGHT; y++){

      // let value = (1 + (noise.perlin2(x / 100, y / 100))) / 2;
      let value = (1 + (noise.simplex3(x / 150, y / 150, time / 2000))) / 2;

      let cell = (x + y * canvas.width) * 4;
      // data[cell] = data[cell + 1] = data[cell + 2] = value;
      data[cell + 0] = value * 192 + 63; // red
      data[cell + 1] = value * 192 + 63; // green
      data[cell + 2] = 255;   // blue
      data[cell + 3] = 255;   // alpha.
      
    }
  }

  ctx.putImageData(image, 0, 0);

  
  // ctx.beginPath();
  
  // ctx.rect(WIDTH / 2 - 800, HEIGHT / 2 - 450, WIDTH / 2, HEIGHT / 2);
  // ctx.fill();
  // ctx.stroke();
  
  // ctx.closePath();
  // counter++;
  // console.log(counter);
  requestAnimationFrame(draw);
}

document.addEventListener("DOMContentLoaded", setup);