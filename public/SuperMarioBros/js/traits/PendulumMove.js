import { Sides, Trait } from "../Entity.js";

export default class PendulumMove extends Trait {
	constructor() {
		super("pendulumMove");
		this.reset();
	}

	reset() {
		this.enabled = true;
		this.speed = -30;
	}

	collides(us, them) {
		if (!them.pendulumMove || us.killable.dead) {
			return;
		}

		if (them.behavior.state) {
			if (them.behavior.state.toString() === "Symbol(panic)") {
				return;
			}
		}

		if (us.behavior.state) {
			if (us.behavior.state.toString() === "Symbol(panic)") {
				return;
			}
		}

		// Two (alive)pendulumwalkers collide
		console.log("Collision detected!");
		if (this.speed > 0 && us.bounds.right > them.bounds.left) {
			let tmp = Math.ceil(us.bounds.right);
			us.bounds.right = Math.floor(them.bounds.left);
			them.bounds.left = tmp;
		} else if (this.speed < 0 && us.bounds.left < them.bounds.right) {
			let tmp = Math.floor(us.bounds.left);
			us.bounds.left = Math.ceil(them.bounds.right);
			them.bounds.right = tmp;
		}
		this.speed = -this.speed;
	}

	obstruct(entity, side) {
		if (side === Sides.LEFT || side === Sides.RIGHT) {
			this.speed = -this.speed;
		}
	}

	update(entity, deltaTime) {
		if (this.enabled) {
			entity.vel.x = this.speed;
		}
	}
}
