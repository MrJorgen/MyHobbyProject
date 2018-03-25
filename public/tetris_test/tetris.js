const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

// Find any full lines, remove it and create a new one at the top
function arenaSweep(){
	var rowCount = 1;
	outer: for (var y = arena.length - 1; y > 0; --y){
		for (var x = 0; x < arena[y].length; ++x){
			if(arena[y][x] === 0){
				continue outer;
			}
		}
		const row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);
		++y;
		player.score += rowCount * 10;
		rowCount *= 2;
	}
}

// Detect collision
function collide(arena, player){
	const [m, o] = [player.matrix, player.pos];
	for (var y = 0; y < m.length; ++y){
		for (var x = 0; x < m[y].length; ++x){
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
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	/*
	context.strokeStyle = "white";
	context.strokeRect(0, 0, canvas.width - 50, canvas.height - 50);
	*/

	drawMatrix(arena, {x: 0, y: 0});
	drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offSet){
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0){
				context.fillStyle = colors[value];

				context.fillRect(x + offSet.x,
								 y + offSet.y,
								 1, 1);
				/*
				context.strokeStyle = "white";
				context.strokeRect(x + offSet.x,
								 y + offSet.y,
								 1, 1);
				*/
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

function pauseGame(){
	cancelAnimationFrame(gameAnimationFrame);

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
	var offSet = 1;
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
	for (var y = 0; y < matrix.length; ++y){
		for (var x = 0; x < y; ++x){
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

var dropCounter = 0, dropInterval = 1000, lastTime = 0, gameAnimationFrame = null;

// Similar to updateInterval but with canvas functions
function update(time = 0){
	var deltaTime = time - lastTime;
	lastTime = time;

	dropCounter += deltaTime;
	if(dropCounter > dropInterval){
		playerDrop();
	}
	console.log(deltaTime);
	console.log(time);
	draw();
	gameAnimationFrame = requestAnimationFrame(update);
	console.log(gameAnimationFrame);
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

// Null T O Z S L J I
var colors = [null, "#a000f0", "#f0f000", "#f00000", "#00f000", "#f0a000", "#0000f0", "#00f0f0"];
var arena = createMatrix(12, 20);

var player = {
	pos: {x: 5, y: 0},
	matrix: createPiece("T"),
	score: 0
}

document.addEventListener("keydown", event => {
	if(event.keyCode === 37){
		playerMove(-1)
	}
	else if(event.keyCode === 39){
		playerMove(1);
	}
	else if(event.keyCode === 40){
		playerDrop();
	}
	else if(event.keyCode === 81){
		playerRotate(-1);
	}
	else if(event.keyCode === 87){
		playerRotate(1);
	}
	else if(event.keyCode === 32){
		pauseGame();
	}
	else {
		console.log(event.keyCode);
	};
});


playerReset();
update();