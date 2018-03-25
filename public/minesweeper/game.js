//document.addEventListener('DOMContentLoaded', setup, false);

var settings = [
	{
		name: "beginner",
		cols: 9,
		rows: 9,
		mines: 10
	},
	{
		name: "intermediate",
		cols: 16,
		rows: 16,
		mines: 40
	},
	{
		name: "expert",
		cols: 30,
		rows: 16,
		mines: 99
	}];

// TODO: Make sprites for all themes. (To make sure they load properly)
// Order of images should be:
// gridCover, gridFlag, gridBackground.empty = null, gridBackground.1, gridBackground.2, gridBackground.3 on so on
// gridBackground.empty = null id there is no empty tile
// Mine(s) should be transparent png so i could be drawn on top of the current tile.
// Maybe numbers should be handled this way too...
// This way I can use fixed measurements for all sprites


var defaultDifficulty = 0;
var selectedSettings = settings[defaultDifficulty];
var cols = selectedSettings.cols;
var rows = selectedSettings.rows;
var clickAction = 0; // For touchdevice
var defaultTheme = 0;
var selectedTheme = themes[defaultTheme];

var size = 36;
var gameWidth = cols * size, gameHeight = rows * size;
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
canvas.width = gameWidth + 2;
canvas.height = gameHeight + 2;
document.getElementById("container").style.width = gameWidth + "px";
document.getElementById("settings").style.width = gameWidth + "px";

var newSqare;
var cells = [];
var mineImg, flagImg, squareImg, gridImg, bombsCount = 10, grid = null, cellsFlagged = 0;
var cols = Math.floor(canvas.width / size);
var rows = Math.floor(canvas.height / size);
var firstClick = true;
var timerImages = new Array();
var timerAnim = null;
var displayTime = 0;
var smileys = {
	sad: "./img/smiley3.png",
	happy: "./img/smiley1.png",
	worried: "./img/smiley2.png",
	cool: "./img/smiley.png"
}


// Images
var smiley = document.getElementById("smiley");
var totalBombs = selectedSettings.mines;
var textColors = ["#fff", "#2847f5", "#547921", "#c7312e", "#14247b", "#840000", "#008284", "#840084", "#757575"];

function isTouch() {
	return (('ontouchstart' in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0));
}


// ...
function make2DArray(cols, rows) {
	var arr = new Array(cols);
	for (var i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

// Load images into memory for use later
function loadImage() {

	squareImg = document.getElementById("square");
	mineExploadImg = document.getElementById("mine_expload");
	mineImg = document.getElementById("bomb");
	flagImg = document.getElementById("flag");
	squareImg.onload = function () {
		mineImg.onload = function () {
			flagImg.onload = function () {
				setup();
			}
		}
	}


	if (selectedTheme.grid) {
		gridImg = new Image();
		gridImg.onload = function () {
			setup();
		}
		gridImg.src = selectedTheme.grid;
	}

	squareImg.src = selectedTheme.empty;
	if (selectedTheme.mineExpload) {
		mineExploadImg.src = selectedTheme.mineExpload;
	}
	mineImg.src = selectedTheme.mine;
	flagImg.src = selectedTheme.flag;

	// Numbers
	mine0 = document.getElementById("bomb_number0");
	mine1 = document.getElementById("bomb_number1");
	mine2 = document.getElementById("bomb_number2");
	number0 = document.getElementById("number0");
	number1 = document.getElementById("number1");
	number2 = document.getElementById("number2");
}

function setup() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	var selectedSettings = settings[defaultDifficulty];
	cols = selectedSettings.cols;
	rows = selectedSettings.rows;
	gameWidth = cols * size
	gameHeight = rows * size;
	canvas.width = gameWidth + 2;
	canvas.height = gameHeight + 2;


	// Reset a few settings
	totalBombs = selectedSettings.mines;

	clearInterval(timerAnim);
	displayTime = 0;
	firstClick = true;
	smiley.src = smileys.happy;

	var sizeSelect = document.getElementById("size_select");
	sizeSelect.value = size;
	sizeSelect.onchange = function () {
		size = parseInt(sizeSelect.value);
		setup();
	}

	var difficultySelect = document.getElementById("difficulty_select");
	difficultySelect.selectedIndex = defaultDifficulty;
	difficultySelect.onchange = function () {
		defaultDifficulty = difficultySelect.selectedIndex;
		setup();
	}

	var themeSelect = document.getElementById("theme_select");
	themeSelect.selectedIndex = defaultTheme;
	themeSelect.onchange = function () {
		defaultTheme = themeSelect.selectedIndex;
		selectedTheme = themes[defaultTheme];
		loadImage();
	}

	if (isTouch()) {
		document.getElementById("touch_controls").style.display = "block";
	}
	else {
		document.getElementById("touch_controls").style.display = "none";
	}

	// Initialize the array containing all cells
	grid = make2DArray(cols, rows);
	var options = [];
	// Fill the array with cells
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j] = new Cell(i, j);
		}
	}

	// Make array with all options where to put bombs
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			options.push([i, j]);
		}
	}

	// Select random places to insert bombs and remove from options
	for (var n = 0; n < totalBombs; n++) {
		var index = Math.floor(Math.random() * options.length);
		var choice = options[index];
		var i = choice[0];
		var j = choice[1];
		options.splice(index, 1);
		grid[i][j].isBomb = true;
	}

	// Loop all places on the grid and call "countbombs" to get the number of adjecent bombs
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j].countBombs();
			grid[i][j].show();
		}
	}
	mine0.className = "numbers num" + Math.floor(totalBombs / 100);
	mine1.className = "numbers num" + Math.floor(totalBombs / 10);
	mine2.className = "numbers num" + totalBombs % 10;

	canvas.addEventListener('contextmenu', prevDefault, false);
	canvas.addEventListener('mousedown', setSmiley, false);
	canvas.addEventListener('mouseup', getCursorPosition, false);
}

function setSmiley(event) {
	event.preventDefault();
	if (event.button == 0) {
		smiley.src = smileys.worried;
	}
	if (event.buttons == 3) {
		console.log("Double press detected!");
	}
}

function prevDefault(e) {
	e.preventDefault();
}

// Game over :)
function gameOver() {
	smiley.src = smileys.sad;
	clearInterval(timerAnim);
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			if (grid[i][j].flagged && !grid[i][j].isBomb) {
				wrongFlag(i * size, j * size);
			}
			if (grid[i][j].isBomb) {
				grid[i][j].revealed = true;
				grid[i][j].show();
			}
		}
	}
	canvas.removeEventListener("mouseup", getCursorPosition);
	canvas.removeEventListener("mousedown", setSmiley);
}

function changeAction(a, elem) {
	console.log(elem.parentNode.childNodes);
	clickAction = a;
	for (var i = 0; i < document.getElementsByClassName("markers").length; i++) {
		document.getElementsByClassName("markers")[i].classList.remove("active");
	}
	elem.classList.add("active");
}

// Mouseclick handler
function getCursorPosition(event) {
	var i = Math.floor(event.offsetX / size);
	var j = Math.floor(event.offsetY / size);

	if (firstClick) {
		timer();
	}

	if (!isTouch()) {
		clickAction = event.button;
	}
	if (clickAction == 0) {
		if (!grid[i][j].flagged && !grid[i][j].revealed) {
			grid[i][j].reveal();
			if (grid[i][j].isBomb) { // Cell is bomb, game over
				gameOver();
				drawBomb(grid[i][j].x + 1, grid[i][j].y + 1);
			}
			else { // Cell is not bomb. One step closer to winning
				smiley.src = smileys.happy;
			}
		}
	}
	if (clickAction == 2) {
		if (!grid[i][j].revealed) {
			if (grid[i][j].flagged) {
				grid[i][j].flagged = false;
				totalBombs++;
			}
			else {
				grid[i][j].flagged = true;
				totalBombs--;
			}
			grid[i][j].show();
		}
	}

	// We won the game!
	if (checkForWin()) {
		smiley.src = smileys.cool;
		setRemainingFlags();
		clearInterval(timerAnim);
		canvas.removeEventListener("mousedown", setSmiley);
		canvas.removeEventListener("mouseup", getCursorPosition);
	}
}

function setRemainingFlags() {
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			if (grid[i][j].isBomb && !grid[i][j].flagged) {
				grid[i][j].flagged = true;
				grid[i][j].show();
			}
		}
	}
}

// Stopwatch
function timer() {
	if (firstClick) {
		firstClick = false;
		displayTime = 0;
		timerAnim = setInterval(timer, 1000);
	}
	if (displayTime <= 999) {
		number0.className = "numbers num" + Math.floor(displayTime / 100) % 10; // Hundratal sekunder
		number1.className = "numbers num" + Math.floor(displayTime / 10) % 10; // Hundratal sekunder
		number2.className = "numbers num" + displayTime % 10; // Hundratal sekunder
	}
	displayTime++;
}

// Background grid
function draw(x, y, color) {
	if (selectedTheme.grid) {

		context.drawImage(gridImg, x, y, size, size);

		/*
		var gridImg = new Image();
		gridImg.src = "./img/tiles.png";
		context.drawImage(gridImg, 64, 0, 64, 64, x, y, size, size);
		*/
	}
	else {
		context.fillStyle = color;
		context.fillRect(x, y, size, size);
		context.strokeStyle = "#777";
		context.lineWidth = 2;
		context.strokeRect(x, y, size, size);
	}
}

// Used when user clicks a bomb to indicate that this was the one who "exploded"
function drawBomb(x, y) {
	if (selectedTheme.mineExpload) {
		context.drawImage(mineExploadImg, x, y, size, size);
	}
	else {
		context.fillStyle = "red";
		context.fillRect(x + 1, y + 1, size - 2, size - 2);
		context.drawImage(mineImg, x + 4, y + 4, size - 6, size - 6);
	}
}
// Draw X over wrong flagged Cell
function wrongFlag(x, y) {
	x = x + 3;
	y = y + 3;
	var drawSize = size - 4;
	context.strokeStyle = "rgba(255, 0, 0, 0.5)";
	context.lineWidth = Math.floor(size / 10);
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x + drawSize, y + drawSize);
	context.stroke();
	context.beginPath();
	context.moveTo(x, y + drawSize);
	context.lineTo(x + drawSize, y);
	context.stroke();
}

function checkForWin() {
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			//if(grid[i][j].revealed == grid[i][j].isBomb || grid[i][j].flagged != grid[i][j].isBomb){
			if (grid[i][j].revealed == grid[i][j].isBomb) {
				return false;
			}
		}
	}
	return true;
}

function drawNumber(x, y, a) {
	var gridImg = new Image();
	gridImg.src = "./img/tiles.png";

	//var thisImg = document.getElementById("tiles");
	context.drawImage(gridImg, 64 + a * 64, 0, 64, 64, x, y, size, size);

}