let viewport = document.querySelector("#viewport");
viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;

let canvas = document.getElementById("maze"),
	context = canvas.getContext("2d"),
	cellSize = 40;

canvas.width = window.innerWidth - window.innerWidth % cellSize - cellSize + 2;
canvas.height = window.innerHeight - window.innerHeight % cellSize - cellSize + 2;

let frameCount, cols = Math.floor(canvas.width / cellSize), current,
	rows = Math.floor(canvas.height / cellSize), grid, stack = [];

setup();
makeMaze();

// Set start and end positions

// Get random edges for start & end
let startEdge = Math.floor(Math.random() * 4);
let endEdge = Math.floor(Math.random() * 4);
while (endEdge == startEdge) {
	endEdge = Math.floor(Math.random() * 4);
}

// Left, right, top, bottom
let edges = [0, (cols - 1), 0, (rows - 1)];

let start, end;

if (startEdge <= 1) {
	start = grid[edges[startEdge]][Math.floor(Math.random() * rows)];
}
else {
	start = grid[Math.floor(Math.random() * cols)][edges[startEdge]];
}

if (endEdge <= 1) {
	end = grid[edges[endEdge]][Math.floor(Math.random() * rows)];
}
else {
	end = grid[Math.floor(Math.random() * cols)][edges[endEdge]];
}

if (startEdge == 0) {
	start.walls.left = false;
}
else if (startEdge == 1) {
	start.walls.right = false;
}
else if (startEdge == 2) {
	start.walls.top = false;
}
else if (startEdge == 3) {
	start.walls.bottom = false;
}

if (endEdge == 0) {
	end.walls.left = false;
}
else if (endEdge == 1) {
	end.walls.right = false;
}
else if (endEdge == 2) {
	end.walls.top = false;
}
else if (endEdge == 3) {
	end.walls.bottom = false;
}

// start.highlight("rgba(0, 255, 0, 1)", true);
// end.highlight("rgba(255, 0, 0, 1)", true);
let closedSet = [], cameFrom = [], openSet = [];
openSet.push(start);

findPath();

// This is(my attempt to do) the A* algorithm
// cell.g = the actual distance from start
// cell.h = the heuristic distance from start
// cell.f = the full(g + h) distance from start
function findPath() {
	let current, done = false;
	if (openSet.length > 0) {
		let lowest = 0;

		// Find the cell with the lowest f
		for (let i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[lowest].f) {
				lowest = i;
			}
		}

		current = openSet[lowest];

		// Done, goal reached
		if (current == end) {

			done = true;
			// drawPathLine(path);
		}

		// Check and remove current from openSet
		if (openSet.indexOf(current) >= 0) {
			openSet.splice(openSet.indexOf(current), 1);
		}
		// Add current to closedSet
		closedSet.push(current);

		// Find neighbors to current which is NOT in the closedSet and add the to openSet to be evaluated
		let neighbors = current.getNeighbors();
		for (let i = 0; i < neighbors.length; i++) {
			let neighbor = neighbors[i];

			// Not in the closedSet
			if (!closedSet.includes(neighbor)) {
				// let tempG = current.g + 1;
				let tempG = current.g + neighbor.getHeuristic(end);

				// Check for neighbor in the openSet
				let newOptimalPath = false;
				if (openSet.includes(neighbor)) {

					// Set neighbors g value (if it's better than it's previous g value)
					if (tempG < neighbor.g) {
						newOptimalPath = true;
					}
				}

				// Not in the openSet, add it and set new path found
				else {
					openSet.push(neighbor);
					newOptimalPath = true;
				}
				if (newOptimalPath) {
					// Set neighbors new f value
					neighbor.g = tempG;
					neighbor.h = neighbor.getHeuristic(end);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = current;
					cameFrom.push(current);
				}
			}
		}
	}

	// Animation stuff
	// ------------------------------------------------------------
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			grid[x][y].show();
		}
	}

	// for (let i = 0; i < closedSet.length; i++) {
	// 	closedSet[i].highlight("rgba(255, 0, 0, .25)");
	// }

	// for (let i = 0; i < openSet.length; i++) {
	// 	openSet[i].highlight("rgba(0, 255, 0, .25)");
	// }

	// Record the path
	let path = [], temp = current,
		pathColor = "rgba(255, 255, 0, .25)";
	temp.highlight(pathColor);
	path.push(temp);

	while (temp.previous) {
		path.push(temp.previous);
		temp = temp.previous;
		temp.highlight(pathColor);
	}

	start.highlight("rgba(0, 255, 0, .5)", true);
	end.highlight("rgba(255, 0, 0, .5)", true);

	drawPathLine(path, done);
	// ------------------------------------------------------------

	if (!done) {
		requestAnimationFrame(findPath);
	}
}

function drawPathLine(path, done) {
	// Draw the path to follow
	context.save();
	context.setLineDash([5]);
	context.strokeStyle = "rgba(0, 0, 255, .5)";
	context.lineWidth = 2;
	context.beginPath();


	// Left, right, top, bottom
	// Path goes from start to end
	// Draw line to edge at START position
	if (startEdge == 0) {
		context.moveTo((start.x * cellSize), (start.y * cellSize) + (cellSize / 2));
	}
	else if (startEdge == 2) {
		context.moveTo((start.x * cellSize) + (cellSize / 2), (start.y * cellSize));
	}
	else if (startEdge == 1) {
		context.moveTo(((start.x + 1) * cellSize), (start.y * cellSize) + (cellSize / 2));
	}
	else if (startEdge == 3) {
		context.moveTo((start.x * cellSize) + (cellSize / 2), ((start.y + 1) * cellSize));
	}
	context.lineTo((start.x * cellSize) + (cellSize / 2), (start.y * cellSize) + (cellSize / 2));

	// Loop through all other spots in the path
	for (let i = path.length - 1; i >= 1; i--) {
		context.lineTo((path[i].x * cellSize) + (cellSize / 2), (path[i].y * cellSize) + (cellSize / 2));
	}
	context.lineTo((path[0].x * cellSize) + (cellSize / 2), (path[0].y * cellSize + (cellSize / 2)));
	if (done) {
		// Draw line to edge at END position
		if (path[0].x <= 0) {
			context.lineTo((path[0].x * cellSize), (path[0].y * cellSize) + (cellSize / 2));
		}
		else if (path[0].y <= 0) {
			context.lineTo((path[0].x * cellSize) + (cellSize / 2), (path[0].y * cellSize));
		}
		else if (path[0].x >= cols - 1) {
			context.lineTo(((path[0].x + 1) * cellSize), (path[0].y * cellSize) + (cellSize / 2));
		}
		else if (path[0].y >= rows - 1) {
			context.lineTo((path[0].x * cellSize) + (cellSize / 2), ((path[0].y + 1) * cellSize));
		}
	}

	context.stroke();
	context.restore();
}

function setup() {
	grid = make2DArray(cols, rows);
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			grid[x][y] = new Cell(x, y);
		}
	}
}

function makeMaze() {

	current = grid[0][0];
	let startTime = new Date().getTime(), done = false;

	while (!done) {

		// Starting point
		current.visited = true;

		// Go to neighbor and remove walls between
		let next = current.checkNeighbors();
		if (next) {
			if (current.x < next.x) { // Move right
				current.walls.right = false;
				next.walls.left = false;
			}
			else if (current.x > next.x) { // Move left
				current.walls.left = false;
				next.walls.right = false;
			}
			else if (current.y < next.y) { // Move down
				current.walls.bottom = false;
				next.walls.top = false;
			}
			else if (current.y > next.y) { // Move up
				current.walls.top = false;
				next.walls.bottom = false;
			}
			next.visited = true;
			stack.push(current);
			current = next;
		}
		// There is no neighbor so backtrace in the stack
		else {
			if (stack.length > 0) {
				current = stack.pop();
			}
			// Stack is empty which mean we are back at the starting position and done!
			else {
				done = true;
			}
		}
	}

	// Draw the maze and set visited to false
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			grid[x][y].visited = false;
			grid[x][y].show();
		}
	}

	// Display message in console
	let totalTime = new Date().getTime() - startTime;
	console.log("Done! It took " + (totalTime.toFixed(0) / 1000) + " seconds to generate the maze.");
}

function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}