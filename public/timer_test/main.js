import { Particle } from "./classes.js";

const canvas = document.querySelector("#canvas"),
ctx = canvas.getContext("2d");
ctx.font = "20px Verdana";

const framesDiv = document.querySelector("#frames");
const dtDiv = document.querySelector("#frameTime");
const fpsDiv = document.querySelector("#fps");

let WIDTH, HEIGHT;
let frameCounter = 0, deltaTime = 0, lastTime, lastSecond = 0, pixels;

let imgData = [];
let img = new Image();
// Pulp Fiction
// img.src = "https://image.tmdb.org/t/p/w600_and_h900_bestv2/dRZpdpKLgN9nk57zggJCs1TjJb4.jpg";
// Kill Bill: Vol 1
// img.src = "https://image.tmdb.org/t/p/w600_and_h900_bestv2/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg";
// Matrix
img.src = "https://image.tmdb.org/t/p/w600_and_h900_bestv2/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg";
img.crossOrigin = "Anonymous";

img.onload = (evt) => {
    WIDTH = canvas.width = img.width;
    HEIGHT = canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    
    pixels = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    for(let i = 0; i < pixels.data.length / 4; i++) {
        let r = pixels.data[(i * 4)];
        let g = pixels.data[(i * 4) + 1];
        let b = pixels.data[(i * 4) + 2];
        let brightness = Math.floor((r + g + b) / 3);
        
        let newBrightness =  Math.sqrt((0.299 * (r * r)) + (0.587 * (g * g)) + (0.114 * (b * b)));
        
        pixels.data[i * 4] = (typeof newBrightness === "undefined") ? brightness : newBrightness;
        pixels.data[i * 4 + 1] = (typeof newBrightness === "undefined") ? brightness : newBrightness;
        pixels.data[i * 4 + 2] = (typeof newBrightness === "undefined") ? brightness : newBrightness;
        // pixels.data[i * 4 + 3] = 255;


    }
    ctx.putImageData(pixels, 0, 0);
    // update();
}

function update(time = 0) {
    // ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    // ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(img, 0, 0);

    if(lastTime) {
        deltaTime = time - lastTime;
    }
    if(lastSecond > 1000) {
        lastSecond -= 1000;
    }
    let fps = 1000 / deltaTime;

    framesDiv.textContent = `Framecount: ${frameCounter}`;
    dtDiv.textContent = `Frametime: ${deltaTime.toFixed(1)} ms`;
    fpsDiv.textContent = `FPS: ${Math.round(fps)}`;

    lastTime = time;
    frameCounter = requestAnimationFrame(update);
}
