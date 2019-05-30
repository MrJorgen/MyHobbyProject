export function createCar(src, color, width) {
  let canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = width / 2;

  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => {
      // Draw the car
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Add the "tint"
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clear edges
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    }
    img.onerror = reject;
    img.src = src;
  })

}

export function createTrack(canvas, context, track) {
  const HEIGHT = canvas.height,
    WIDTH = canvas.width;
  // Outer limit
  let outerLimit = new Path2D();
  // context.beginPath();

  // Top left
  outerLimit.moveTo(track.padding, HEIGHT / 2);
  outerLimit.arcTo(track.padding, track.padding, track.padding + track.width, track.padding, track.width);

  // Top right
  // outerLimit.lineTo(WIDTH - track.width - track.padding, track.padding);
  outerLimit.arcTo(WIDTH - track.padding, track.padding, WIDTH - track.padding, track.padding + track.width, track.width);

  // Bottom right
  // outerLimit.lineTo(WIDTH - track.padding, HEIGHT - track.padding - track.width);
  outerLimit.arcTo(WIDTH - track.padding, HEIGHT - track.padding, WIDTH - track.padding - track.width, HEIGHT - track.padding, track.width);

  // Bottom left
  // outerLimit.lineTo(track.padding + track.width, HEIGHT - track.padding);
  outerLimit.arcTo(track.padding, HEIGHT - track.padding, track.padding, HEIGHT - track.padding - track.width, track.width);

  outerLimit.closePath();
  // Fill track
  context.fillStyle = "grey";
  context.fill(outerLimit);
  // Draw outer line
  context.lineWidth = 9;
  context.strokeStyle = "white";
  context.stroke(outerLimit);

  context.setLineDash([7]);
  context.strokeStyle = "red";
  context.stroke(outerLimit);
  // context.strokeStyle = "black";
  // context.stroke();

  // Inner limit
  let innerLimit = new Path2D();
  // context.beginPath();

  // Top left
  innerLimit.moveTo(track.padding + track.width, HEIGHT / 2);
  innerLimit.arcTo(track.padding + track.width, track.padding + track.width, track.padding + track.width + track.width / 2, track.padding + track.width, track.width / 2);

  // Top right
  // innerLimit.lineTo(WIDTH - track.width - track.padding - track.width / 2, track.padding + track.width);
  innerLimit.arcTo(WIDTH - track.padding - track.width, track.padding + track.width, WIDTH - track.padding - track.width, track.padding + track.width + track.width / 2, track.width / 2);

  // Bottom right
  // innerLimit.lineTo(WIDTH - track.padding, HEIGHT - track.padding - track.width);
  innerLimit.arcTo(WIDTH - track.padding - track.width, HEIGHT - track.padding - track.width, WIDTH - track.padding - track.width - track.width / 2, HEIGHT - track.padding - track.width, track.width / 2);

  // Bottom left
  // innerLimit.lineTo(track.padding + track.width, HEIGHT - track.padding);
  innerLimit.arcTo(track.padding + track.width, HEIGHT - track.padding - track.width, track.padding + track.width, HEIGHT - track.padding - track.width - track.width / 2, track.width / 2);

  innerLimit.closePath();
  // Fill track inner field
  context.fillStyle = "black";
  context.fill(innerLimit);
  // Draw outer line
  context.setLineDash([]);
  context.lineWidth = 9;
  context.strokeStyle = "white";
  context.stroke(innerLimit);

  context.setLineDash([7]);
  context.strokeStyle = "red";
  context.stroke(innerLimit);

  // Draw start/finish line
  context.save();
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(WIDTH / 2, HEIGHT - track.padding - track.width + context.lineWidth);
  context.lineTo(WIDTH / 2, HEIGHT - track.padding - context.lineWidth);
  context.setLineDash([]);
  context.strokeStyle = "black";
  context.stroke();

  // context.lineDashOffset = -(track.width % 9 + 1);
  context.setLineDash([5]);
  context.strokeStyle = "white";
  context.stroke();

  context.beginPath();
  context.moveTo(WIDTH / 2 - context.lineWidth, HEIGHT - track.padding - track.width + context.lineWidth);
  context.lineTo(WIDTH / 2 - context.lineWidth, HEIGHT - track.padding - context.lineWidth);
  context.setLineDash([]);
  context.strokeStyle = "black";
  context.stroke();

  context.lineDashOffset = 5;
  context.setLineDash([5]);
  context.strokeStyle = "white";
  context.stroke();

  context.restore();
}