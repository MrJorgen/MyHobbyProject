import { Car } from "./Car.js";
import { createCar, createTrack } from "./init.js";

let raceCar, carContext, WIDTH, HEIGHT, gamePad;

window.onload = () => {
	setup();
};

async function setup() {
  const canvas = document.querySelector("#background"),
    context = canvas.getContext("2d"),
    carCanvas = document.createElement("canvas");
		// Settings
    WIDTH = canvas.width = window.innerWidth;
    HEIGHT = canvas.height = window.innerHeight;
		const track = {
			width: WIDTH / 13 - (WIDTH / 13 % 16),
      padding: (WIDTH / 13 - (WIDTH / 13 % 16)) / 2
		};

	carContext = carCanvas.getContext("2d");
	carCanvas.width = canvas.width;
	carCanvas.height = canvas.height;
	document.body.appendChild(carCanvas);
	context.fillRect(0, 0, WIDTH, HEIGHT);

	createTrack(canvas, context, track);

	let newCar = await createCar("./img/car2.png", "Yellow", track.width / 2);
	raceCar = new Car(WIDTH / 2, HEIGHT - track.padding - track.width / 2, newCar);
	raceCar.findMaxSpeed();
	animate();
}

function animate() {
  gamePad = navigator.getGamepads()[0];
  console.log(gamePad);
	if (gamePad != null) {
		if (gamePad.axes[0] < -0.25 || gamePad.axes[0] > 0.25) {
			if (gamePad.axes[0] < -0.25) {
				raceCar.turningLeft = true;
				raceCar.steerButton = Math.abs(gamePad.axes[0]);
			}
			if (gamePad.axes[0] > 0.25) {
				raceCar.turningRight = true;
				raceCar.steerButton = Math.abs(gamePad.axes[0]);
			}
		} else {
			raceCar.turningRight = false;
			raceCar.turningLeft = false;
		}
		if (gamePad.buttons[7].value > 0) {
			raceCar.accelerate = true;
			raceCar.accelButton = gamePad.buttons[7].value;
		} else {
			raceCar.accelerate = false;
		}
  }
  else {
    raceCar.accelButton = 1;
    raceCar.steerButton = 1;
  }

	// console.log(gamePad.axes[0]);
	raceCar.update(WIDTH, HEIGHT);
	raceCar.show(carContext, WIDTH, HEIGHT);

	requestAnimationFrame(animate);
}

document.body.addEventListener("keydown", e => {
	// console.log(e.keyCode);
	let speed = 0.5,
		turnSpeed = 0.05;
	switch (e.keyCode) {
		// Accelerate
		case 38: // Up arrow
		case 87: // W
			raceCar.accelerate = true;
			break;

		// Break (decelerate)
		case 40: // Down arrow
		case 83: // S
			raceCar.accelerate = false;
			break;

		// Turn right
		case 39: // Right arrow
		case 68: // D
			raceCar.turningRight = true;
			break;

		// Turn left
		case 37: // Left arrow
		case 65: // D
			raceCar.turningLeft = true;
			break;
	}
});

document.body.addEventListener("keyup", e => {
	// console.log(e.keyCode);
	let speed = 0.5,
		turnSpeed = 0.05;
	switch (e.keyCode) {
		// Accelerate
		case 38: // Up arrow
		case 87: // W
			raceCar.accelerate = false;
			break;

		// Break (decelerate)
		case 40: // Down arrow
		case 83: // S
			// raceCar.accelerate(-speed);
			break;

		// Turn right
		case 39: // Right arrow
		case 68: // D
			raceCar.turningRight = false;
			break;

		// Turn left
		case 37: // Left arrow
		case 65: // D
			raceCar.turningLeft = false;
			break;
	}
});

window.addEventListener("gamepadconnected", function(e) {
	console.log(
		"Gamepad connected at index %d: %s. %d buttons, %d axes.",
		e.gamepad.index,
		e.gamepad.id,
		e.gamepad.buttons.length,
		e.gamepad.axes.length
	);
});
