// Variables needed to display and correct the arena to the right size
var arenaSize = { x: 31, y: 21 }, scale = 20, spacing = 0;
var canvas = document.getElementById("snake");

// This acts as an outer wall
// This nees to be remade to a proper wall if future levels will
// allow traveling from right to left, top to bottom and so on
canvas.style.border = "solid " + scale + "px red";

var squarePiece = spacing + scale + spacing;
canvas.width = squarePiece * arenaSize.x;
canvas.height = squarePiece * arenaSize.y;
// Top element. Used to display score, current level and food left to eat.
document.getElementById("game_info").style.width = (arenaSize.x * squarePiece) + (scale * 2) + "px";

var context = canvas.getContext("2d");

// Snake properties
var snake = {
	size: 5,
	color: "#25ff00",
	speed: 250,
	grow: 7
 };

// Player properties
var player = {
	foodEaten: 0,
	score: 0,
	level: 1,
	bgColor: "#222",
	updateInfo: function(){
		document.getElementById("score").innerText = this.score;
		document.getElementById("food").innerText = foodToLevel - this.foodEaten;
		document.getElementById("level").innerText = this.level;
	}
};

// Global variables
var foodToLevel = 10, levelUp = false, move = { x: 1, y: 0 }, obstacle = [], level = {};
var lastTime = 0, animCounter = 0, snakePositions = [], food = {}, moveAllowed = true, gameOver = false;

// Start of a new level (and restart after pause?)
function newLevel(){
	snakePositions = [ null ];
	move = { x: 1, y: 0 };
	newFood();
	snake.size = 5;
	snake.speed = 250;
	player.foodEaten = 0;
	player.updateInfo();
	initLevel(player.level);
	repaintCanvas();
	snakePositions[0] = level.startPos;
	draw(snakePositions[0], snake.color);
	animate();
}

// Resets only when fresh game ie just entered(refreshed) the site or after a game over
// Ie, starts from the beginning at level 1 with a score of 0
function newGame(){
	lastTime = 0, animCounter = 0,  food = {}, moveAllowed = true, gameOver = false;
	player.score = 0;
	player.level = 1;
	player.updateInfo();
	newLevel();
}

// Calculates a new random spot for the food square
function newFood() {
	food = {
		x: (arenaSize.x * Math.random() | 0),
		y: (arenaSize.y * Math.random() | 0),
		color: "yellow"
	}
}

// Repaints the playfield(ground, food and obstacles)
function repaintCanvas(){
	context.fillStyle = player.bgColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	draw(food, food.color);
	if(level.obstacles){
		for(var i = 0; i < level.obstacles.length; i++){
			draw(level.obstacles[i], level.obstacleColor);
		}
	}
}

// Initiates levels, maybe this should be in an object...
function initLevel(currentLevel){
	snake.speed = snake.speed / Math.ceil(currentLevel / 3);
	currentLevel = currentLevel % 3;

	level = {}, obstacles = [], level.obstacleColor = "red";
	level.startPos = {
			x: (arenaSize.x / 2 | 0),
			y: (arenaSize.y / 2 | 0)
		};

	switch(currentLevel){
		case 1:
			break;
	
		// Centered vertical line. Half of arenasize with a quarter space on each side(top & bottom).
		case 2:
			var x = (arenaSize.x / 2 | 0);
			for(var y = (arenaSize.y / 4 | 0); y <= ((arenaSize.y / 4) * 3 | 0); y++){
				obstacles.push({x: x, y: y});
			}

			level.startPos = {
					x: (arenaSize.x / 2 | 0) + 1,
					y: (arenaSize.y / 2 | 0),
				};
			level.obstacles = obstacles;
			break;
	
		case 0:
			var x = (arenaSize.x / 2 | 0);
			for(var y = 0; y <= ((arenaSize.y / 3) | 0); y++){
				obstacles.push({x: x, y: y});
			}
			for(var y = (arenaSize.y / 3 * 2); y <= arenaSize.y; y++){
				obstacles.push({x: x, y: y});
			}
			level.obstacles = obstacles;
			break;
		default:
			snake.speed = snake.speed / 2;
	}
}

// Param: arr = array of x and y to draw, color = color of course :)
function draw(pos, color){
	// Paint a square. 1 px spacing top & left and "scale" size
	// Need to explain more just as a reminder of what this does...
	// Pos is the place in the playfield. Spacing before and multiply position with scale and each spacing before current position.
	context.fillStyle = color;
	context.fillRect(squarePiece * pos.x + spacing, squarePiece * pos.y + spacing, scale, scale);
}

// Check for collision with wall, snake(incl head) or obstacle. Returns true of collision is detected
function collide(pos) {
	if(level.obstacles){
		for (var i = 0; i < level.obstacles.length; i++) {
			if(level.obstacles[i].x == pos.x && level.obstacles[i].y == pos.y){
				return true;
			}
		}
	}
	if(pos.x < 0 || pos.y < 0 || pos.x >= arenaSize.x || pos.y >= arenaSize.y){
		return true;
	}
	for (var i = 0; i < snakePositions.length; i++) {
		if(snakePositions[i].x == pos.x && snakePositions[i].y == pos.y){
			return true;
		}
	}
	return false;
}

// Grays out the screen and display a message
function writeMessage(message, vAlign, textSize) {
	vAlign = vAlign || "middle";
	textSize = textSize || scale * 5;
	context.fillStyle = "rgba(0, 0, 0, 0.5)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font =  textSize + "px VT323";
	context.textAlign = "center";
	context.textBaseline = vAlign;
	context.fillStyle = "red";
	context.fillText(message, canvas.width / 2, canvas.height / 2);
}

// Main loop. Animates everything
function animate(time = 0){
	var deltaTime = time - lastTime;
	lastTime = time;

	animCounter += deltaTime;
	
	if(animCounter > snake.speed){

		// Calculate next position of the head
		var nextPos = {
				x: snakePositions[0].x + move.x,
				y: snakePositions[0].y + move.y
			};

		// Check if it will collide
		if(collide(nextPos)){
			draw(nextPos, "white");
			gameOver = true;
		};

		// Skip the next section if game is over
		if(!gameOver){
			// Adds the new position of the snakes "head"
			snakePositions.unshift(nextPos);

			// Eat food and get awards
			if(snakePositions[0].x == food.x && snakePositions[0].y == food.y){

				// Check if new food is on top of something bad :)
				do {
					newFood();
				}
				while(collide(food));

				snake.size += snake.grow;
				player.foodEaten++;
				player.score += 10 + (player.level - 1) + player.foodEaten;

				if(player.foodEaten >= foodToLevel){
					player.score += player.level * 50;
					player.level++;
					levelUp = true;
				}

				player.updateInfo();
			}

			// Clear and update canvas with food and obstacles
			repaintCanvas();

			// Snake isn't growning. Remove tail position
			if(snakePositions.length > snake.size){
				snakePositions.pop();
			}

			// Draw the snake
			for(var i = 0; i < snakePositions.length; i++){
				draw(snakePositions[i], snake.color);
			}

			// Position updated. Allowed to move again
			moveAllowed = true;
		}
		animCounter = 0;
	}

	// If not game over or level up, display(and calculate) next frame
	if(!gameOver && !levelUp) {
		gameAnimationFrame = requestAnimationFrame(animate);
	}
	else if(gameOver) {
		writeMessage("Press space to start again", "top", canvas.height / 8);
		//writeMessage("Press space to start again", "top", scale * 3);
		writeMessage("Game Over!", "bottom");
	}
	else if(levelUp){
		levelUp = false;
		writeMessage("Level " + player.level);
		setTimeout(function(){
			newLevel();
		}, 1000);
	}
}

// Keyboard input. Setting moveAllowed to false to prevent multiple inputs before next positon
document.addEventListener("keydown", function(event){
	event.preventDefault();
	// Space to restart
	if(event.keyCode === 32){
		if(gameOver == true){
			newGame();
		}
	}
	// Move down
	else if(event.keyCode === 40 || event.keyCode === 83){
		if(move.y === 0 && moveAllowed){
			move = {x: 0, y: 1 };
			moveAllowed = false;
		}
	}
	// Move right
	else if(event.keyCode === 39 || event.keyCode === 68){
		if(move.x === 0 && moveAllowed){
			move = {x: 1, y: 0 };
			moveAllowed = false;
		}
	}
	// Move left
	else if(event.keyCode === 37 || event.keyCode === 65){
		if(move.x === 0 && moveAllowed){
			move = { x: -1, y: 0 };
			moveAllowed = false;
		}
	}
	// Move up
	else if(event.keyCode === 38 || event.keyCode === 87){
		if(move.y === 0 && moveAllowed){
			move = {x: 0, y: -1 };
			moveAllowed = false;
		}
	}
	else{
		console.log(event.keyCode)
	};
})

// This is what starts the whole ting
newGame();