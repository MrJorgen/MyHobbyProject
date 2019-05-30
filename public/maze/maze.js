let canvas = document.getElementById("maze"),
	context = canvas.getContext("2d"),
	cellSize = 80;

canvas.width = window.innerWidth - window.innerWidth % cellSize - cellSize + 2;
canvas.height = window.innerHeight - window.innerHeight % cellSize - cellSize + 2;

let frameCount, cols = Math.floor(canvas.width / cellSize), current,
	rows = Math.floor(canvas.height / cellSize), grid = [], stack = [], done = false;

setup();
draw();

function setup() {
	context.fillStyle = "rgba(0, 0, 0, 0)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	grid = make2DArray(cols, rows);
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			let cell = new Cell(x, y);
			grid[x][y] = cell;
		}
	}
	current = grid[0][0];
}

function draw(time = 0) {
	// Make the initial grid
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			grid[x][y].show();
		}
	}

	// Starting point
	current.visited = true;
	current.highlight();

	// Go to neighbor and remove walls between
	let next = current.checkNeighbors();
	if (next) {
		if (current.x < next.x) { // Move right
			current.walls.right = false;
			next.walls.left = false;
		}
		if (current.x > next.x) { // Move left
			current.walls.left = false;
			next.walls.right = false;
		}
		if (current.y < next.y) { // Move down
			current.walls.bottom = false;
			next.walls.top = false;
		}
		if (current.y > next.y) { // Move up
			current.walls.top = false;
			next.walls.bottom = false;
		}
		next.visited = true;
		stack.push(current);
		current = next;
	}
	// The is no neighbor so backtrace in the stack
	else {
		if (stack.length > 0) {
			current = stack.pop();
		}
		// Stack is empty which mean we are back at the starting position and done!
		else {
			console.log("Done! It took " + (time.toFixed(0) / 1000) + " seconds to finish.");
			done = true;
		}
	}
	if (!done) {
		frameCount = requestAnimationFrame(draw);
	}
}

function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}