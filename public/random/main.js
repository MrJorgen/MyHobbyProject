import Utils from "./utils.js";
import Particle from "./particle.js";
import { Clock } from "./clock.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#canvas"),
    context = canvas.getContext("2d"),
    WIDTH = canvas.width = window.innerWidth,
    HEIGHT = canvas.height = window.innerHeight,
    TWO_PI = Math.PI * 2,
    stiffness = 2,
    friction = 0.5;
  
  let clock = new Clock();
  clock.addHand(0, 150, 15, "#000000");
  console.log(clock);

  let radius = Math.floor(Math.min(WIDTH, HEIGHT) / 2 * 0.9),
    lastSecond = 0,
    centerPoint = new Particle(Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2)),
    secondsPoint = new Particle(0, 0),
    springPoint = new Particle(0, 0);
  
  secondsPoint.friction = friction;
  drawClockface();
  draw();


  function draw(timer = 0) {
    let currentTime = new Date();
    let hours = currentTime.getHours() % 12,
      minutes = currentTime.getMinutes(),
      seconds = currentTime.getSeconds(),
      secondsHand = {
        length: 0.99,
        width: 6,
        color: "rgba(155, 0, 0, 1)"
      };

    if (timer == 0) {
      secondsPoint.x = Math.cos(Math.PI * 1.5 + (TWO_PI / 60) * seconds) * radius + centerPoint.x;
      secondsPoint.y = Math.sin(Math.PI * 1.5 + (TWO_PI / 60) * seconds) * radius + centerPoint.y;
      springPoint.x = Math.cos(Math.PI * 1.5 + (TWO_PI / 60) * seconds) * radius + centerPoint.x;
      springPoint.y = Math.sin(Math.PI * 1.5 + (TWO_PI / 60) * seconds) * radius + centerPoint.y;
      lastSecond = seconds;
    }
    
    if (lastSecond !== seconds) {
      springPoint.x = Math.cos(Math.PI * 1.5 + (TWO_PI / 60) * seconds) * radius + centerPoint.x;
      springPoint.y = Math.sin(Math.PI * 1.5 + (TWO_PI / 60) * seconds) * radius + centerPoint.y;
      lastSecond = seconds;
    }

    secondsPoint.springTo(springPoint, stiffness, 0);
    secondsPoint.update();

    context.clearRect(0, 0, WIDTH, HEIGHT);

    // Seconds hand
    drawHands(secondsPoint, secondsHand);
    
    // Centerpoint
    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.beginPath();
    context.arc(centerPoint.x, centerPoint.y, 15, 0, TWO_PI);
    context.closePath();
    context.fill();
    
    // console.log(hours + ":" + minutes + ":" + seconds);
    
    requestAnimationFrame(draw);
  }
  
  function drawHands(outerPoint, hand) {
    context.save();
    context.strokeStyle = hand.color;
    context.lineWidth = hand.width;
    context.beginPath();
    context.moveTo(centerPoint.x, centerPoint.y);
    context.lineTo(outerPoint.x, outerPoint.y);
    context.stroke();
    context.restore();
  }

  function drawClockface() {
    let bgCanvas = document.createElement("canvas");
    bgCanvas.id = "bgCanvas";
    bgCanvas.width = WIDTH;
    bgCanvas.height = HEIGHT;
    bgCanvas.style.position = "absolute";
    bgCanvas.style.left = 0;
    bgCanvas.style.top = 0;
    bgCanvas.style.zIndex = "-1";
    document.body.insertBefore(bgCanvas, canvas);
    // document.body.appendChild(bgCanvas);
    let bgContext = bgCanvas.getContext("2d");

    // Draw circle
    bgContext.lineWidth = 15;
    bgContext.fillStyle = "rgba(128, 128, 128, 1)";
    bgContext.strokeStyle = "rgba(0, 0, 0, 1)";
    bgContext.beginPath();
    bgContext.arc(centerPoint.x, centerPoint.y, radius, 0, Math.PI * 2);
    bgContext.closePath();
    bgContext.stroke();
    bgContext.fill();
    
    // Draw markers
    bgContext.lineWidth = 2;
    for (let i = 0; i < 60; i++) {
      bgContext.lineWidth = 4;
      bgContext.beginPath();
      bgContext.moveTo(centerPoint.x + Math.cos(TWO_PI / 60 * i) * radius * 0.95, centerPoint.y + Math.sin(TWO_PI / 60 * i) * radius * 0.95);
      bgContext.lineTo(centerPoint.x + Math.cos(TWO_PI / 60 * i) * radius * 0.99, centerPoint.y + Math.sin(TWO_PI / 60 * i) * radius * 0.99);
      bgContext.stroke();
      if (i % 5 == 0) {
        bgContext.lineWidth = 9;
        bgContext.beginPath();
        bgContext.moveTo(centerPoint.x + Math.cos(TWO_PI / 60 * i) * radius * 0.92, centerPoint.y + Math.sin(TWO_PI / 60 * i) * radius * 0.92);
        bgContext.lineTo(centerPoint.x + Math.cos(TWO_PI / 60 * i) * radius * 0.99, centerPoint.y + Math.sin(TWO_PI / 60 * i) * radius * 0.99);
        bgContext.stroke();
      }
    }
    
    // Draw numbers
    bgContext.fillStyle = "rgba(0, 0, 0, 1)";
    for (let i = 0; i < 4; i++) {
      bgContext.font = "bold 100px Dosis";
      bgContext.textAlign = "center";
      bgContext.textBaseline = "middle";
      bgContext.fillText(i * 3 + 3,
        centerPoint.x + Math.cos((TWO_PI / 4) * i) * radius * 0.85,
        centerPoint.y + Math.sin((TWO_PI / 4) * i) * radius * 0.85);
    }

  }
});
