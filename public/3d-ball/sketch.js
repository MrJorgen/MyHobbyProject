// camera(1000, 1000, 0, 0, 0, 0, 0, 1, 0);
let img, angle = 0, ball;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  // createCanvas(400, 400, WEBGL);
  noStroke();
  fill(120, 0, 200);
  img = loadImage("img/poolballs1.png");
  ball = new Poolball(0, 0, 100, 7, 0);
  // ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
  // camera(0, 0, sin(frameCount * 0.01) * 100, 0, 0, 0, 0, 1, 0);

  camera(0, 0, (height * 2) / tan(PI * 30.0 / 180.0), 0, 0, 0, 0, 1, 0);
  let fov = 17 / 180 * PI;
  let cameraZ = height / 2.0 / tan(fov / 2.0);
  perspective(fov, width / height, cameraZ * 0.1, cameraZ * 10);
  orbitControl();

}

function draw() {
  background(0);
  // pointLight(0, 0, 255, -500, 500, 500);
  // pointLight(255, 0, 0, 500, -500, 500);
  // pointLight(0, 255, 0, 500, 0, 500);
  pointLight(255, 255, 255, 5000, 0, 7000);
  // ambientLight([32, 32, 32, 128]);

  // Ball movement
  push();
  texture(img);
  // specularMaterial(255, 255, 255);
  translate(ball.x, 0);
  rotateY(ball.x / ball.radius * 1.25);
  rotateX((ball.y / ball.radius) * 1.25);
  sphere(ball.radius);
  pop();

  console.log(ball.x);
  if (ball.x >= width / 2 - (ball.radius * 1.7)) {
    ball.vel.x = 0;
  }

  // "Table"
  push();
  fill(0, 127, 0);
  translate(0, 0, -250);
  plane(width, height);
  pop();

  ball.update();
}