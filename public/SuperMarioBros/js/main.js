import Camera from "./Camera.js";
import Entity from "./Entity.js";
import PlayerController from "./traits/PlayerController.js";
import Timer from "./Timer.js";
import { createLevelLoader } from "./loaders/level.js";
import { loadFont } from "./loaders/font.js";
import { loadEntities } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers/collision.js";
import { createDashboardLayer } from "./layers/dashboard.js";

const canvas = document.getElementById("screen");
const debug = false;

function createPlayerEnv(playerEntity) {
	const playerEnv = new Entity();
	playerEnv.active = true;
	const playerControl = new PlayerController();
	playerControl.checkpoint.set(41, 192);
	playerControl.setPlayer(playerEntity);
	playerEnv.addTrait(playerControl);
	return playerEnv;
}

async function main() {
	const context = canvas.getContext("2d");

	const [entityFactory, font] = await Promise.all([loadEntities(), loadFont()]);

	const loadLevel = await createLevelLoader(entityFactory);

	const level = await loadLevel("1-1");
	level.camera = new Camera();

	const mario = entityFactory.mario();
	mario.name = "mario";

	const playerEnv = createPlayerEnv(mario);
	level.entities.add(playerEnv);

	// This is for debugging reason only
	if (debug) {
		window.level = level;
		console.log(level);
		level.comp.layers.push(createCollisionLayer(level));
	}
	level.comp.layers.push(createDashboardLayer(font, playerEnv));

	const input = setupKeyboard(mario);
	input.listenTo(window);

	const timer = new Timer(1 / 60);
	timer.update = function update(deltaTime) {
		level.update(deltaTime);

		//  Prevent Mario from going offscreen to the left
		if (mario.pos.x < level.camera.pos.x) {
			mario.pos.x = level.camera.pos.x;
		}

		// Prevent game from scrolling left
		level.camera.scrollMax = level.camera.pos.x;

		// Scrolling "softstarts" over 2 tiles(32 px)
		let buffer = {
			min: 96,
			now: 96,
			max: 128
		};
		// if (mario.vel.x > 0) {
		//   console.log(level.camera.pos.x - mario.bounds.right + buffer.now);
		// }
		level.camera.pos.x = Math.max(
			level.camera.scrollMax,
			mario.bounds.right - buffer.min
		);
		// level.camera.pos.x = Math.max(level.camera.scrollMax, mario.bounds.right - 96);
		// level.camera.pos.x = Math.max(level.camera.scrollMax, mario.bounds.right - 128);

		level.comp.draw(context, level.camera);
	};

	timer.start();
}

main();
