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

    highlight() {
        context.fillStyle = "rgba(0, 255, 0, .75)";
        context.fillRect(this.x * cellSize + 2, this.y * cellSize + 2, cellSize - 2, cellSize - 2);
    }

    show() {
        let x = this.x * cellSize + 1;
        let y = this.y * cellSize + 1;
        context.strokeStyle = "rgb(0, 0 ,0)";
        context.lineWidth = 2;

        if (this.visited) {
            context.fillStyle = "rgba(255, 255, 255, 1)";
            context.fillRect(x, y, cellSize, cellSize);
        }

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
