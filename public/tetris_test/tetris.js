const canvas = document.getElementById("tetris"),
  ctx = canvas.getContext("2d"),
  scale = Math.floor(Math.min(window.innerWidth / 12, window.innerHeight / 22));

canvas.width = scale * 12;
canvas.height = scale * 20;
document.querySelector(".container").style.width = (scale * 12) + "px";

let dropCounter = 0, dropInterval = 1000, lastTime = 0, gameAnimationFrame = null,
  player = { pos: { x: 5, y: 0 }, matrix: createPiece("T"), score: 0 };

// Null T O Z S L J I
let colors = [null, "#a000f0", "#f0f000", "#f00000", "#00f000", "#f0a000", "#0000f0", "#00f0f0"],
  arena = createMatrix(12, 20);

playerReset();
update();

// Find any full lines, remove it and create a new one at the top
function arenaSweep(){
	let rowCount = 1;
	outer: for (let y = arena.length - 1; y > 0; y--){
          for (let x = 0; x < arena[y].length; x++){
            if(arena[y][x] === 0){
              continue outer;
            }
          }
		const row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);
		y++;
		player.score += rowCount * 10;
		rowCount *= 2;
	}
}

// Detect collision
function collide(arena, player){
	const [m, o] = [player.matrix, player.pos];
	for (let y = 0; y < m.length; y++){
		for (let x = 0; x < m[y].length; x++){
			if(m[y][x] !== 0 && 
				(arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0){
				return true;
			}
		}
	}
	return false;
}

// Initiate the playfield
function createMatrix(w, h){
	const matrix = [];
	while (h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

// Create a new random piece
function createPiece(type){
	if(type === "T"){
		return [
				[1, 1, 1],
				[0, 1, 0],
				[0, 0, 0],
			];
	}
	else if(type === "O"){
		return [
				[2, 2],
				[2, 2]
			];
	}
	else if(type === "Z"){
		return [
				[3, 3, 0],
				[0, 3, 3],
				[0, 0, 0],
			];
	}
	else if(type === "S"){
		return [
				[0, 4, 4],
				[4, 4, 0],
				[0, 0, 0],
			];
	}
	else if(type === "L"){
		return [
				[0, 5, 0],
				[0, 5, 0],
				[0, 5, 5]
			];
	}
	else if(type === "J"){
		return [
				[0, 6, 0],
				[0, 6, 0],
				[6, 6, 0]
			];
	}
	else if(type === "I"){
		return [
				[0, 7, 0, 0],
				[0, 7, 0, 0],
				[0, 7, 0, 0],
				[0, 7, 0, 0]
			];
	}
}

// Draw
function draw(){
	ctx.fillStyle = "rgb(128, 128, 128)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.save();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  for (let i = 1; i < canvas.height; i += scale) {
    ctx.beginPath();
    ctx.moveTo(0, i - 1);
    ctx.lineTo(canvas.width, i - 1);
    ctx.stroke();
  }
  for (let i = 1; i < canvas.width; i += scale) {
    ctx.beginPath();
    ctx.moveTo(i - 1, 0);
    ctx.lineTo(i - 1, canvas.height);
    ctx.stroke();
  }
  ctx.restore();

	drawMatrix(arena, {x: 0, y: 0});
	drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offSet){
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0){
				ctx.fillStyle = colors[value];

				ctx.fillRect((x + offSet.x) * scale, (y + offSet.y) * scale, scale, scale);
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.strokeRect((x + offSet.x) * scale, (y + offSet.y) * scale, scale, scale);
        
			}
		});
	});
}

// Merge old piece with arena
function merge(arena, player){
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value !== 0){
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		})
	})	
}

function pauseGame() {
  if (gameAnimationFrame !== null) {
    cancelAnimationFrame(gameAnimationFrame);
    gameAnimationFrame = null;
  } else {
    update();
  }
}

// Drop piece one step
function playerDrop(){
	player.pos.y++;
	if (collide(arena, player)){
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter = 0;
}

// Move left or right
function playerMove(dir){
	player.pos.x += dir;
	if(collide(arena, player)){
		player.pos.x -= dir;
	}
}

function playerReset(){
	
	// Drop new piece
	const pieces = "ILJOTSZ";
	player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
	player.pos.y = 0;
	player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

	// Game over!
	if (collide(arena, player)){
		arena.forEach(row => row.fill(0));
		player.score = 0;
		updateScore();
	}
}

function playerRotate(dir){
	const pos = player.pos.x;
	let offSet = 1;
	rotate(player.matrix, dir);
	while(collide(arena, player)){
		player.pos.x += offSet;
		offSet = -(offSet + (offSet > 0 ? 1 : -1));
		if (offSet > player.matrix[0].length){
			rotate(player.matrix, -dir);
			player.pos.x = pos;
			return;
		}
	}
}

// Rotate current piece
function rotate(matrix, dir){
	for (let y = 0; y < matrix.length; ++y){
		for (let x = 0; x < y; ++x){
			[
				matrix[x][y],
				matrix[y][x],
			] = [
				matrix[y][x],
				matrix[x][y],
			]
		}
	}

	if (dir > 0){
		matrix.forEach(row => row.reverse());
	}
	else{
		matrix.reverse();
	}
}

// Similar to updateInterval but with canvas functions
function update(time = 0){
	let deltaTime = time - lastTime;
	lastTime = time;

	dropCounter += deltaTime;
	if(dropCounter > dropInterval){
		playerDrop();
	}

  draw();
	gameAnimationFrame = requestAnimationFrame(update);
}

function updateScore(){
	document.getElementById("score").innerText = player.score;
	if (player.score >= 500 && dropInterval == 1000){
		dropInterval = 750;
	}
	if (player.score >= 1000 && dropInterval == 750){
		dropInterval = 500;
	}
	if (player.score >= 2000 && dropInterval == 500){
		dropInterval = 250;
	}
}

document.addEventListener("keydown", e => {

  switch (e.keyCode) {
    case 37:
      playerMove(-1);
      break;
    
    case 39:
      playerMove(1);
      break;
    
    case 40:
      playerDrop();
      break;

    case 81:
      playerRotate(-1);
      break;
    
    case 87:
      playerRotate(1);
      break;
    
    case 32:
      pauseGame();
      break;
  }
});