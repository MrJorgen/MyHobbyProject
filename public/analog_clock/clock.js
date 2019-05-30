document.onreadystatechange = function () {
	console.log(document.readyState);
};

document.addEventListener('DOMContentLoaded', setup, false);
let viewport = document.querySelector("#viewport");
viewport.content = "width=device-width, initial-scale=" + 1 / window.devicePixelRatio;
var canvas, context, size, radius, selectedFont, frameCount, stepSeconds = true, faceBackground, thickness = {};
var fontKeepers = ["Dosis", "Metrophobic", "Arsenal", "Pompiere", "Schoolbell", "Simonetta", "Paprika", "Rajdhani", "Julee", "Averia Gruesa Libre", "Fenix", "Gruppo",
	"Sarpanch", "Amita", "Overlock", "Gilda Display", "Athiti", "Salsa", "Modern Antiqua", "Josefin Sans", "Nova Square", "Unkempt", "Esteban", "Combo", "Nova Slim",
	"Dynalight", "Sniglet", "Marmelad", "Oregano", "Snippet", "Artifika"];


// Sets a few variables and draws the clockface
function setup() {
	canvas = document.getElementById("clock");
	context = canvas.getContext("2d");
	size = Math.min(window.innerWidth, window.innerHeight);
	//size *= .75;
	canvas.width = size;
	canvas.height = size;
	radius = (size / 2) * 0.9;
	thickness = {
		thin: radius * 0.01,
		medium: radius * 0.02,
		thick: radius * 0.04
	}
	faceBackground = new Image();
	faceBackground.src = "clock-304841.svg"
	context.translate(size / 2, size / 2);
	drawFace();
	selectedFont = "Verdana";
	selectFont();
	calcHands();
	draw();
}

function draw(time = 0) {
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0, );
	context.clearRect(0, 0, size, size);
	//context.drawImage(faceBackground, 0, 0, size, size);
	context.restore();
	drawFace();
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0, );
	context.fillStyle = "rgba(0, 0, 0, 1)";
	context.font = size / 70 + "px Verdana";
	context.textAlign = "center";
	context.fillText("KARLSSON", size * 0.5, size * (1 / 3));
	context.fillText("http://mrjorgen.synology.me/analog_clock/", size * 0.5, size * (2 / 3));
	context.restore();
	drawNumbers();
	calcHands();


	//context.drawImage(faceBackground, -1, -1, size, size);
	frameCount = requestAnimationFrame(draw);
}

// Select a random font
function selectFont(font) {
	if (!font) {
		var allFonts = [], fontsStr = "";
		var fontLink = document.getElementById("fonts").href;
		fontsStr = fontLink.split("=")[1];
		fontsStr = fontsStr.replace(/\+/g, " ");
		allFonts = fontsStr.split("|");
		allFonts.sort();
		selectedFont = allFonts[Math.floor(Math.random() * allFonts.length)]
		var fontPreload = document.getElementById("fontPreload");
		fontPreload.style.fontFamily = selectedFont;
		fontPreload.innerText = "Font used: " + selectedFont;
	}
	// Wait for font to load
	setTimeout(function () {
		if (document.fonts.check("16px " + selectedFont)) {
			draw();
			drawNumbers(selectedFont);
		}
		else {
			selectFont(selectedFont);
		}
	}, 200);
}


function drawFace() {
	// Outer circle and background
	context.strokeStyle = "#000";
	context.lineWidth = 3;
	context.beginPath();
	context.arc(0, 0, size / 2 * .9, 0, Math.PI * 2);
	context.fillStyle = "rgba(255, 255, 255, 1)";
	context.stroke();
	context.fill();

	// Add shadow
	context.shadowBlur = 12;
	context.shadowOffsetX = 4;
	context.shadowOffsetY = 4;
	context.shadowColor = "rgba(0, 0, 0, 1)";
}

function drawNumbers() {
	var ang, hour, steps = 60, hour = 1, dist = .88;
	context.font = (radius * 0.19) + "px " + selectedFont;
	context.textBaseline = "middle";
	context.textAlign = "center";
	context.fillStyle = "#000";
	context.lineCap = "round";
	context.strokeStyle = "black";

	for (curStep = 1; curStep <= steps; curStep++) {

		// Calculates the angle to rotate
		ang = curStep * Math.PI / (steps / 2);
		context.rotate(ang);

		// Moves to edge
		context.translate(0, -radius * dist);

		// Rotate to display number upright
		if (curStep % (steps / 4) == 0) {
			if (1 == 1) {
				context.rotate(-ang);
				context.fillText(hour, 0, 0);
				context.rotate(ang);
			}
			else {
				context.lineWidth = thickness.thick;
				context.beginPath();
				context.moveTo(0, radius * .01);
				context.lineTo(0, -radius * .05);
				context.stroke();
			}
		}

		// If not 3, 6, 9 or 12, draw a short line
		else if (curStep % (steps / 12) == 0) {
			if (1 == 1) {
				context.lineWidth = thickness.medium;
				context.beginPath();
				context.moveTo(0, radius * .01);
				context.lineTo(0, -radius * .05);
				context.stroke();
			}
			else {
				context.rotate(-ang);
				context.fillText(hour, 0, 0);
				context.rotate(ang);
			}
		}

		// Draw mini line at each second
		else {
			if (1 == 1) {
				context.lineWidth = thickness.thin;
				context.beginPath();
				context.moveTo(0, -radius * .025);
				context.lineTo(0, -radius * .05);
				context.stroke();
			}
		}
		// Reset angle and go back to center
		context.translate(0, radius * dist);
		context.rotate(-ang);
		// Add one hour for each time it lands on a 12:th part of the whole
		if (curStep % (steps / 12) == 0) {
			hour++;
		}
	}
}

function calcHands() {
	let now = new Date();
	let hours = now.getHours();
	let minutes = now.getMinutes();
	let seconds = now.getSeconds();
	let milli = now.getMilliseconds();
	hours %= 12;

	document.getElementById("fontPreload").innerHTML = "Font used: " + selectedFont + "<br>" + now.toLocaleTimeString();

	// Hour center cover
	context.beginPath();
	context.arc(0, 0, radius * .06, 0, Math.PI * 2);
	context.closePath();
	context.fillStyle = "rgba(0, 0, 0, 1)";
	context.fill();

	// Calc and draw hours  	
	hours = (hours * Math.PI / 6) + (minutes * Math.PI / (6 * 60)) + (seconds * Math.PI / (60 * 60 * 6));

	drawHand(hours, radius * .5, thickness.thick, "black");

	// Calc and draw minutes
	minutes += seconds / 60;
	minutes *= Math.PI / 30;
	drawHand(minutes, radius * .75, thickness.medium, "rgba(180, 180, 180, 1)");
	// Minutes center cover
	context.beginPath();
	context.arc(0, 0, radius * .04, 0, Math.PI * 2);
	context.closePath();
	context.fillStyle = "rgba(180, 180, 180, 1)";
	context.fill();


	// Calc and draw seconds
	if (!stepSeconds) {
		seconds = seconds + milli / 1000;
	}
	seconds *= Math.PI / 30;
	drawHand(seconds, radius * .88, thickness.thin, "rgba(220, 0 , 0, 1)");
	// Seconds center cover
	context.beginPath();
	//context.arc(0, 0, radius * .02, 0, Math.PI * 2);
	context.closePath();
	context.fillStyle = "rgba(220, 0, 0, 1)";
	context.fill();


}

function drawHand(angle, length, width, color) {
	context.strokeStyle = color || "#000";
	context.fillStyle = color;
	context.beginPath();
	// Round and pointy
	//width = radius * .05;
	context.rotate(angle);
	context.moveTo(0, 0);
	context.quadraticCurveTo(width * 2, -width * 2, 0, -length);
	context.quadraticCurveTo(-width * 2, -width * 2, 0, 0);
	// context.closePath();
	// context.fill();
	// context.beginPath();
	context.arc(0, 0, radius * .02, 0, Math.PI * 2);
	context.closePath();
	context.fill();

	// Pointy thick to thin
	// width *= 1.5;
	// context.rotate(angle);
	// context.moveTo(0, 0);
	// context.lineTo(-width, -width * 2);
	// context.lineTo(-width / 2, -length + width);
	// context.lineTo(0, -length); // Änden
	// context.lineTo(width / 2, -length + width);
	// context.lineTo(width, -width * 2);
	// context.closePath();
	// context.fillStyle = color;
	// context.fill();



	/*    // Straight line
		context.lineWidth = width;
		context.lineCap = "round";
		context.rotate(angle);
		context.moveTo(0, 0);
		context.lineTo(0, -length);
	*/
	//context.stroke();
	context.rotate(-angle);

}