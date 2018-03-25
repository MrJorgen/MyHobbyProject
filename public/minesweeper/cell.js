var Cell = function(i, j) {
	this.i = i;
	this.j = j;
	this.x = i * size;
	this.y = j * size;
	this.neighborCount = 0;
	this.flagged = false;
	this.isBomb = false;
	this.revealed = false;
}

// "Main" function to draw everything on the grid
Cell.prototype.show = function(x , y) {
	if(this.revealed){
		if(this.isBomb){
			draw(this.x + 1, this.y + 1, "#ccc");
			context.drawImage(mineImg, this.x + 4, this.y + 4, size - 6, size - 6);
		}
		else{
			if(this.neighborCount > 0){
				if(selectedTheme.numbers && selectedTheme.numbers.length > 0){
					var x = this.x;
					var y = this.y;
					var thisImg = new Image();
					thisImg.onload = function(){
						context.drawImage(thisImg, x + 1, y + 1, size, size);
					}
					thisImg.src = selectedTheme.numbers[this.neighborCount];
					
					//drawNumber(this.x, this.y, this.neighborCount);

				}
				else{
					draw(this.x + 1, this.y + 1, "#ccc");
					context.fillStyle = textColors[this.neighborCount];
					context.font = "bold " + (size / 2) + "px Verdana";
					context.textAlign = "center";
					context.textBaseline = "middle";
					context.fillText(this.neighborCount, this.x + (size / 2) + 1, this.y + (size / 2) + 1);
				}
			}
			else{
				draw(this.x + 1, this.y + 1, "#ccc");
			}
		}
	}
	if(this.flagged && !this.revealed){
		context.drawImage(flagImg, this.x + 1, this.y + 1, size, size);
		mine0.className = "numbers num" + Math.floor(totalBombs / 100);
		mine1.className = "numbers num" + Math.floor(totalBombs / 10);
		mine2.className = "numbers num" + totalBombs % 10;
	}
	if(!this.flagged && !this.revealed){
		draw(this.x + 1, this.y + 1, "#ccc"); // Draws the background grid
		context.drawImage(squareImg, this.x + 1, this.y + 1, size, size); // If there
	}
};

// Reveal cell
Cell.prototype.reveal = function(){
	this.revealed = true;
	this.show();
	if(this.neighborCount == 0){
		this.floodFill();
	}
}

// Clear all "blankspaces"
Cell.prototype.floodFill = function() {
	for (var xoff = -1; xoff <= 1; xoff++) {
		for (var yoff = -1; yoff <= 1; yoff++) {
			var i = this.i + xoff;
			var j = this.j + yoff;
			if(i >= 0 && i < cols && j >= 0 && j < rows){
				if(!grid[i][j].isBomb && !grid[i][j].revealed){
					grid[i][j].reveal();
				}
			}
		}
	}
};

// Count neighbors to get the number of adjecent bombs
Cell.prototype.countBombs = function(){
	if(this.isBomb){
		this.neighborCount = -1;
		return;
	}
	var total = 0;

	for (var xoff = -1; xoff <= 1; xoff++) {
		for (var yoff = -1; yoff <= 1; yoff++) {
			var i = this.i + xoff;
			var j = this.j + yoff;
			if(i >= 0 && i < cols && j >= 0 && j < rows){
				if (grid[i][j].isBomb) {
					total++;
				}				
			}
		}
	}
	this.neighborCount = total;
}
