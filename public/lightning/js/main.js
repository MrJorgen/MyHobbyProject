// http://drilian.com/2009/02/25/lightning-bolts/

import { Vector, Line, Lightning } from "./Classes.js";

document.addEventListener("DOMContentLoaded", setup);
let canvas, ctx, width, height, lightning, nextLightning;
const generations = 8, maxOffset = 0.12, maxBranches = 8, minBranches = 3,
  interval = {
    min: 1000,
    max: 5000
  }, animate = true, startPoints = [], endPoints = [];

function setup() {
  canvas = document.querySelector("#main"),
    ctx = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;
  startPoints.push(new Vector(width * 0.1, height * 0.02));
  startPoints.push(new Vector(width * 0.2, height * 0.02));
  startPoints.push(new Vector(width * 0.3, height * 0.02));
  startPoints.push(new Vector(width * 0.4, height * 0.02));
  startPoints.push(new Vector(width * 0.5, height * 0.02));
  startPoints.push(new Vector(width * 0.6, height * 0.02));
  startPoints.push(new Vector(width * 0.7, height * 0.02));
  startPoints.push(new Vector(width * 0.8, height * 0.02));
  startPoints.push(new Vector(width * 0.9, height * 0.02));

  endPoints.push(new Vector(width * 0.2, height * 0.98));
  endPoints.push(new Vector(width * 0.4, height * 0.98));
  endPoints.push(new Vector(width * 0.6, height * 0.98));
  endPoints.push(new Vector(width * 0.8, height * 0.98));
  startLightning();
  draw();
}

function draw(time = 0) {
  ctx.clearRect(0, 0, width, height);
  if (lightning.opacity > 0) {
    drawSegments(lightning);
    nextLightning = time + interval.min + (Math.random() * (interval.max - interval.min));
  } else if (time >= nextLightning) {
    startLightning();
  }
  showPoints();
  if (animate) {
    requestAnimationFrame(draw);
  }
}

function startLightning() {
  let startPoint = startPoints[Math.floor(Math.random() * startPoints.length)];
  let endPoint = endPoints[Math.floor(Math.random() * endPoints.length)];
  let line = new Line(startPoint, endPoint);
  let lines = makeSegments([line], generations);
  let branches = [], nrOfBranches = minBranches + Math.floor(Math.random() * (maxBranches - minBranches)),
    branchLength = line.getLength() * 0.25 + Math.random() * (line.getLength() * 0.2);
  for (let i = 0; i < nrOfBranches; i++) {
    let rnd = Math.floor(Math.random() * Math.floor(lines.length * 0.75));
    let angle = lines[rnd].getDirection();
    let angleOffset = (Math.PI / 8) + Math.random() * Math.PI / 4;
    angle += Math.random() < 0.5 ? -angleOffset : angleOffset;
    let startPoint = lines[rnd].endPoint;
    let endPoint = new Vector(startPoint.x + Math.cos(angle) * branchLength, startPoint.y + Math.sin(angle) * branchLength);
    branches.push(makeSegments([new Line(startPoint, endPoint)], generations - 1));
  }
  lightning = new Lightning(lines);
  lightning.branches = branches;
  console.log(lightning);
}

function makeSegments(lines, generations) {
  for (let j = 0; j < generations; j++) {
    let tempArray = [];
    for (let line of lines) {
      let direction = line.getDirection();
      let length = line.getLength();
      let offset = (length * (maxOffset / 2)) + Math.random() * ((length * (maxOffset / 2)));
      offset = Math.random() < 0.5 ? -offset : offset;
      direction += Math.PI / 2;

      let offsetVector = new Vector(Math.cos(direction) * offset, Math.sin(direction) * offset);
      let midPoint = new Vector(
        line.startPoint.x + (line.endPoint.x - line.startPoint.x) / 2,
        line.startPoint.y + (line.endPoint.y - line.startPoint.y) / 2
      );
      midPoint.add(offsetVector);

      let line1 = new Line(line.startPoint, midPoint);
      let line2 = new Line(midPoint, line.endPoint);
      tempArray.push(line1, line2);
    }
    lines = tempArray;
  }
  return lines;
}

function drawSegments(lightning) {
  ctx.save();
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = ctx.lineWidth * 4;
  ctx.shadowColor = `rgba(255, 230, 240, ${lightning.opacity})`;
  ctx.strokeStyle = `rgba(255, 230, 240, ${lightning.opacity})`;
  ctx.fillStyle = `rgba(220, 210, 255, ${lightning.opacity * 0.1})`;
  ctx.fillRect(0, 0, width, height);
  
  ctx.beginPath();
  ctx.moveTo(lightning.lines[0].startPoint.x, lightning.lines[0].startPoint.y);
  for (let line of lightning.lines) {
    ctx.lineTo(line.endPoint.x, line.endPoint.y);
  }
  ctx.stroke();
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
  
  ctx.save();
  ctx.lineWidth = 0.4;
  ctx.shadowBlur = ctx.lineWidth * 4;
  ctx.shadowColor = `rgba(230, 230, 255, ${lightning.opacity})`;
  ctx.strokeStyle = `rgba(230, 230, 255, ${lightning.opacity})`;

  
  for (let branch of lightning.branches) {
    ctx.beginPath();
    ctx.moveTo(branch[0].startPoint.x, branch[0].startPoint.y);
    for (let line of branch) {
      ctx.lineTo(line.endPoint.x, line.endPoint.y);
    }
    ctx.stroke();
    if (Math.random() < 0.5) {
      ctx.stroke();
    }
    ctx.closePath();
  }
  ctx.restore();


  if (lightning.displayFrames > 0) {
    lightning.displayFrames--;
  } else {
    lightning.opacity -= lightning.fadeRate;
    if (lightning.opacity < 0.1 && lightning.repeats > 0) {
      lightning.opacity = 1;
      lightning.repeats--;
    }
    lightning.setColor();
  }
}

function showPoints() {
  startPoints.forEach((point) => {
    point.show(ctx);
  }) 
  endPoints.forEach((point) => {
    point.show(ctx);
  }) 
}