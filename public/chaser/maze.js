let viewport = document.querySelector("#viewport");
viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;


let canvas = document.getElementById("maze"), pathCanvas, pathContext,
	context = canvas.getContext("2d"),
	cellSize = 50, fullPath = [],
	ball = {
		x: null,
		y: null,
		radius: cellSize / 2 * .75,
		color: "rgba(255, 255, 0, 1)"
		// color: "rgba(0, 0, 0, .5)"

	};

// Set width and height of the canvas
canvas.width = window.innerWidth - (window.innerWidth % cellSize) + 2;
canvas.height = window.innerHeight - (window.innerHeight % cellSize) + 2;
canvas.style.marginLeft = ((window.innerWidth - canvas.width) / 2) + "px";
canvas.style.marginTop = ((window.innerHeight - canvas.height) / 2) + "px";


// Settings
let cols = Math.floor(canvas.width / cellSize),
	rows = Math.floor(canvas.height / cellSize),
	grid, stack = [], frameCount, current, step = cellSize / 5;

setup();
makeMaze();


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

// Remove outer wall from start & end
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

// Draw the maze and set visited to false
for (let x = 0; x < cols; x++) {
	for (let y = 0; y < rows; y++) {
		grid[x][y].visited = false;
		grid[x][y].show();
	}
}

start.highlight("rgba(0, 255, 0, .6)", true);
end.highlight("rgba(255, 0, 0, .6)", true);

findPath();

// This is(my attempt to do) the A* algorithm
// cell.g = the actual distance from start
// cell.h = the heuristic distance from start
// cell.f = the full(g + h) distance from start
function findPath() {
	let startTime = new Date().getTime();
	let closedSet = [], cameFrom = [], openSet = [];

	openSet.push(start);

	while (openSet.length > 0) {

		// Find the cell in openSet with the lowest f
		let lowest = 0;
		for (let i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[lowest].f) {
				lowest = i;
			}
		}

		let current = openSet[lowest];

		// Done, goal reached
		if (current == end) {

			// Record the path
			path = [], temp = current;
			path.push(temp);

			while (temp.previous != start) {
				path.push(temp.previous);
				temp = temp.previous;
			}

			let totalTime = new Date().getTime() - startTime;
			console.log("Path found in " + (totalTime) + " milliseconds.");

			drawPathLine(path, true);
			animate();
			break;
		}

		// Check and remove current from openSet
		if (openSet.indexOf(current) >= 0) {
			openSet.splice(openSet.indexOf(current), 1);
		}

		// Add current to closedSet
		closedSet.push(current);

		// Find neighbors to current which is NOT in closedSet and add to openSet
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
}

function animate() {
	if (fullPath.length > 0) {
		// Add a new canvas to draw animation on
		if (!document.querySelector("#pathCanvas")) {
			pathCanvas = document.createElement("canvas");
			pathContext = pathCanvas.getContext("2d");

			pathCanvas.width = canvas.width;
			pathCanvas.height = canvas.height;
			pathCanvas.style.marginLeft = getComputedStyle(canvas).marginLeft;
			pathCanvas.style.marginTop = getComputedStyle(canvas).marginTop;
			pathCanvas.style.zIndex = "-1";
			pathCanvas.style.top = "0px";
			pathCanvas.style.position = "absolute";

			pathCanvas.id = "pathCanvas";
			document.body.appendChild(pathCanvas);
		}

		// Find and set start position
		if (ball.x == null && ball.y == null) {
			ball.x = fullPath[0].x;
			ball.y = fullPath[0].y;
		}

		// Speed up the animation
		let localStep = step;
		while (localStep > 0) {
			// If next spot is reached
			if (ball.x == fullPath[0].x && ball.y == fullPath[0].y) {
				fullPath.splice(0, 1);
				console.log(fullPath.length);
			}

			if (fullPath.length == 0) {
				break;
			}
			// Move towards next spot
			if (ball.x < fullPath[0].x) {
				ball.x++;
			}
			if (ball.y < fullPath[0].y) {
				ball.y++;
			}
			if (ball.x > fullPath[0].x) {
				ball.x--;
			}
			if (ball.y > fullPath[0].y) {
				ball.y--;
			}
			localStep--;
		}

		// Draw "ball"

		pathContext.clearRect(0, 0, pathCanvas.width, pathCanvas.height);
		pathContext.fillStyle = ball.color;
		pathContext.strokeStyle = "#000";
		pathContext.lineWidth = 2;
		pathContext.beginPath();
		pathContext.arc(ball.x + 1, ball.y + 1, ball.radius, 0, Math.PI * 2);
		pathContext.fill();
		pathContext.stroke();

		requestAnimationFrame(animate);
	}
}

function drawPathLine(path, done) {
	context.save();
	context.setLineDash([5]);
	context.strokeStyle = "rgba(0, 0, 0, 1)";
	context.lineWidth = 2;
	context.beginPath();

	// Draw line to edge at START position
	if (startEdge == 0) {
		context.moveTo((start.x * cellSize), (start.y * cellSize) + (cellSize / 2));
		fullPath.push({ x: start.x * cellSize, y: (start.y * cellSize) + (cellSize / 2) });
	}
	else if (startEdge == 1) {
		context.moveTo(((start.x + 1) * cellSize), (start.y * cellSize) + (cellSize / 2));
		fullPath.push({ x: ((start.x + 1) * cellSize), y: (start.y * cellSize) + (cellSize / 2) });
	}
	else if (startEdge == 2) {
		context.moveTo((start.x * cellSize) + (cellSize / 2), (start.y * cellSize));
		fullPath.push({ x: (start.x * cellSize) + (cellSize / 2), y: (start.y * cellSize) });
	}
	else if (startEdge == 3) {
		context.moveTo((start.x * cellSize) + (cellSize / 2), ((start.y + 1) * cellSize));
		fullPath.push({ x: (start.x * cellSize) + (cellSize / 2), y: ((start.y + 1) * cellSize) });
	}
	context.lineTo((start.x * cellSize) + (cellSize / 2), (start.y * cellSize) + (cellSize / 2));
	fullPath.push({ x: (start.x * cellSize) + (cellSize / 2), y: (start.y * cellSize) + (cellSize / 2) });

	// Loop through all other spots in the path
	for (let i = path.length - 1; i >= 1; i--) {
		context.lineTo((path[i].x * cellSize) + (cellSize / 2), (path[i].y * cellSize) + (cellSize / 2));
		fullPath.push({ x: (path[i].x * cellSize) + (cellSize / 2), y: (path[i].y * cellSize) + (cellSize / 2) });
	}

	context.lineTo((path[0].x * cellSize) + (cellSize / 2), (path[0].y * cellSize + (cellSize / 2)));
	fullPath.push({ x: (path[0].x * cellSize) + (cellSize / 2), y: (path[0].y * cellSize + (cellSize / 2)) });

	if (done) {
		// Draw line to edge at END position
		if (endEdge == 0) {
			context.lineTo((end.x * cellSize), (end.y * cellSize) + (cellSize / 2));
			fullPath.push({ x: (end.x * cellSize), y: (end.y * cellSize) + (cellSize / 2) });
		}
		else if (endEdge == 1) {
			context.lineTo(((end.x + 1) * cellSize), (end.y * cellSize) + (cellSize / 2));
			fullPath.push({ x: ((end.x + 1) * cellSize), y: (end.y * cellSize) + (cellSize / 2) });
		}
		else if (endEdge == 2) {
			context.lineTo((end.x * cellSize) + (cellSize / 2), (end.y * cellSize));
			fullPath.push({ x: (end.x * cellSize) + (cellSize / 2), y: (end.y * cellSize) });
		}
		else if (endEdge == 3) {
			context.lineTo((end.x * cellSize) + (cellSize / 2), ((end.y + 1) * cellSize));
			fullPath.push({ x: (end.x * cellSize) + (cellSize / 2), y: ((end.y + 1) * cellSize) });
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

	let startTime = new Date().getTime(), done = false;
	current = grid[0][0];

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

	// Display message in console
	let totalTime = new Date().getTime() - startTime;
	console.log("Maze genarated in " + (totalTime.toFixed(0) / 1000) + " seconds.");
}

function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}