let canvas = document.getElementById("main");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var frameCount = 0, streamsCount = 60, streams = [], step = 4, stream;
var symbolSize = window.innerWidth / streamsCount;

// let viewport = document.querySelector("#viewport");
// viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;


function setup() {
	background("rgb(0, 0, 0)");
	var x = 0;
	for (var i = 0; i < canvas.width / symbolSize; i++) {
		stream = new Stream();
		//stream.generateSymbols(x, random(-1000, 0));
		stream.generateSymbols(x, random(0, -50) * symbolSize);
		streams.push(stream);
		x += symbolSize;
	}
}

function draw(time = 0) {
	if (frameCount % step == 0) {
		background("rgb(0, 0, 0)");
		//console.log(time);
		streams.forEach(function (stream) {
			stream.render();
		})
	}

	frameCount = requestAnimationFrame(draw);
}

function Symbol(x, y, first, opacity) {
	this.x = x;
	this.y = y;
	this.value = getRandomSymbol();
	this.first = first;
	this.opacity = opacity;

	this.setToRandomSymbol = function () {
		this.value = getRandomSymbol();
	}

	this.rain = function () {
		if (this.y >= canvas.height) {
			this.y = 0;
		}
		else {
			this.y += symbolSize;
		}
	}
}

function background(color) {
	context.fillStyle = color;
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function getRandomSymbol() {
	var symbolString = '01235456789-+/|<>*";:=';
	for (var i = 0; i < 96; i++) {
		symbolString += String.fromCharCode(0x30A0 + i);
	}
	return symbolString.charAt(random(0, symbolString.length));
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

setup();
draw();

/*
var katakana = String.fromCharCode(
	0x30A0 + Math.floor(Math.random() * 97)
	);
*/


// document.addEventListener("keydown", function (e) {
// 	fullScreen(canvas);
// });

window.addEventListener("load", function () {

	document.addEventListener("mousedown", function (e) {
		fullScreen(canvas);
	});

	window.addEventListener("touchend", function (e) {
		e.preventDefault();
		fullScreen(canvas);
	});

	window.addEventListener("touchstart", function (e) {
		e.preventDefault();
		fullScreen(canvas);
	});
	window.addEventListener("swipedown", function (e) {
		e.preventDefault();
		fullScreen(canvas);
	});
	document.addEventListener("touchstart", function (e) {
		fullScreen(canvas);
	});
	document.addEventListener("touchstart", function (e) {
		fullScreen(canvas);
	});
	document.addEventListener("touchstart", function (e) {
		fullScreen(canvas);
	});
})


function fullScreen(element) {
	if (element.requestFullScreen) {
		element.requestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	}
}