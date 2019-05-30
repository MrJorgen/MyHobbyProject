class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        }
        this.visited = false;
        // For pathfinding...
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.previous = null;
    }

    // The "Manhattan" way
    getHeuristic(end) {
        return Math.abs(end.x - this.x) + Math.abs(end.y - this.y);
    }

    // Get neighbors who is not separated by a wall
    getNeighbors() {
        let neighbors = [], x = this.x, y = this.y;

        // Neighbor on top
        if (y > 0 && !grid[x][y - 1].walls.bottom) {
            neighbors.push(grid[x][y - 1]);
        }

        // Neighbor to the right
        if (x + 1 < cols && !grid[x + 1][y].walls.left) {
            neighbors.push(grid[x + 1][y]);
        }

        // Neighbor below
        if (y + 1 < rows && !grid[x][y + 1].walls.top) {
            neighbors.push(grid[x][y + 1]);
        }

        // Neighbor to the left
        if (x > 0 && !grid[x - 1][y].walls.right) {
            neighbors.push(grid[x - 1][y]);
        }
        return neighbors;
    }

    // Find neighbors to the current cell which is not visited and return a random one
    checkNeighbors() {
        let neighbors = [], x = this.x, y = this.y,
            top = (y > 0) ? grid[x][y - 1] : null,
            right = (x < cols - 1) ? grid[x + 1][y] : null,
            bottom = (y < rows - 1) ? grid[x][y + 1] : null,
            left = (x > 0) ? grid[x - 1][y] : null;

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            return neighbors[Math.floor(Math.random() * neighbors.length)];
        }
        else {
            return undefined;
        }
    }

    highlight(color = "rgba(0, 255, 0, .75)", outLine = false) {
        context.fillStyle = color;
        context.strokeStyle = color;
        context.lineWidth = 2;
        if (!outLine) {
            context.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
        }
        else {
            context.fillRect(this.x * cellSize + 2, this.y * cellSize + 2, cellSize - 2, cellSize - 2);
        }
    }

    show() {
        let x = this.x * cellSize + 1;
        let y = this.y * cellSize + 1;
        context.strokeStyle = "rgba(0, 0, 0, 1)";
        context.lineWidth = 2;
        context.lineCap = "square";

        // Draw walls
        // Top
        if (this.walls.top) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + cellSize, y);
            context.stroke();
        }

        // Right
        if (this.walls.right) {
            context.beginPath();
            context.moveTo(x + cellSize, y);
            context.lineTo(x + cellSize, y + cellSize);
            context.stroke();
        }

        // Bottom
        if (this.walls.bottom) {
            context.beginPath();
            context.moveTo(x, y + cellSize);
            context.lineTo(x + cellSize, y + cellSize);
            context.stroke();
        }

        // Left
        if (this.walls.left) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, y + cellSize);
            context.stroke();
        }
    }
}
