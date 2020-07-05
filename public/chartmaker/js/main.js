import { exampleData } from "./data.js";
import { Piechart } from "./Piechart.js";

document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.querySelector("#chartCanvas").getContext("2d"),
    WIDTH = ctx.canvas.width = window.innerWidth,
    HEIGHT = ctx.canvas.height = window.innerHeight,
    TWO_PI = Math.PI * 2,
    pieRadius = Math.round(Math.min(WIDTH, HEIGHT) * 0.9 / 2),
    chart = new Piechart(WIDTH / 2, HEIGHT / 2, pieRadius);
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  // ctx.imageSmoothingQuality = "low|medium|high"

    
    chart.total = exampleData.reduce((total, current) => total + current.data, 0);
    chart.title = "Antal döda i Sverige – per åldersgrupp";
    chart.unit = " år";
  
  makePieChart(exampleData);
  
  function makePieChart(data) {
    
    let currentAngle = 0, currentColor = 0;
    for (let slice of data) {
      if (slice.data === 0) { continue };
      let tmpAngle = currentColor * 210;
      ctx.fillStyle = `hsl(${tmpAngle}, 100%, 50%)`;

      let tmpPath = new Path2D();
      tmpPath.moveTo(chart.x, chart.y);
      tmpPath.arc(chart.x, chart.y, chart.radius, currentAngle, currentAngle + TWO_PI * (slice.data / chart.total));
      tmpPath.closePath();
      chart.slices.push(tmpPath);
      ctx.stroke(tmpPath);
      ctx.fill(tmpPath);
      
      currentAngle += TWO_PI * (slice.data / chart.total);
      currentColor++;
    }
  }

  function makeTooltip(pos) {

  }

  ctx.canvas.addEventListener("mousemove", (e) => {
    for (let i = 0; i < chart.slices.length; i++) {
      if (ctx.isPointInPath(chart.slices[i], e.clientX, e.clientY)) {
        console.log(exampleData[i].name);
      }
    }
  })
});