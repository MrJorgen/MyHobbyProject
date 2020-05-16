import { Trait } from "../Entity.js";
import { Vec2 } from "../math.js";

export default class PlayerController extends Trait {
	constructor() {
		super("playerController");
		this.checkpoint = new Vec2(0, 0);
		this.player = null;
		this.score = 0;
		this.time = 0;
		this.coins = 0;
		this.lives = 99;
		this.dead = false;
		this.active = true;
	}

	setPlayer(entity) {
		this.player = entity;

		this.player.stomper.onStomp = () => {
			this.score += 100;
		};
	}

	reset(entity, level) {
		this.time = level.timeToComplete;
		this.dead = false;
		this.active = true;
	}

	update(entity, deltaTime, level) {
		//  Player died. Resetting everything!
		if (!level.entities.has(this.player) && this.lives > 0) {
			this.player.traits.forEach(trait => {
				trait.reset(entity, level);
			});
			this.lives--;

			// Update checkpoint
			for (let checkPoint of level.checkPoints) {
				if (level.camera.bounds.left >= checkPoint) {
					this.checkpoint.x = this.checkpoint.x >= checkPoint ? this.checkpoint.x : checkPoint;
				} else {
					break;
				}
			}

			level.camera.bounds.left = this.checkpoint.x - 41;
			level.restart();
			this.player.vel.set(0, 0);
			this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
			level.entities.add(this.player);
		} else {
			if (this.time <= 0) {
				this.time = 0;
				this.player.killable.kill(this.player);
			} else {
				if (!this.player.killable.dead) {
					this.time -= deltaTime * 2.5;
				}
			}
		}
	}
}
