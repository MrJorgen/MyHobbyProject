import { Sides, Trait } from "../Entity.js";

export default class Jump extends Trait {
	constructor() {
		super("jump");

		this.ready = 0;
		this.duration = 0.25;
		this.engageTime = 0;
		this.requestTime = 0;
		this.gracePeriod = 0.1;
		this.speedBoost = 0.3;
		this.velocity = 200;
	}

	get falling() {
		return this.ready < 0;
	}

	start() {
		this.requestTime = this.gracePeriod;
	}

	cancel() {
		this.engageTime = 0;
		this.requestTime = 0;
  }
  
  bounceBlock(block) {
    const moveDist = 4;
  }

	obstruct(entity, side, match) {
		if (side === Sides.BOTTOM) {
			this.ready = 1;
		} else if (side === Sides.TOP) {
			// This is where Mario hit block from under
      match.y1 -= 4;
      console.log("Mario hit block from under");
      console.log(match);
			this.cancel();
		}
	}

	update(entity, deltaTime, level) {
		if (entity.killable.dead) {
			return;
		}
		if (this.requestTime > 0) {
			if (this.ready > 0) {
				this.engageTime = this.duration;
				this.requestTime = 0;
			}

			this.requestTime -= deltaTime;
		}

		if (this.engageTime > 0) {
			entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost);
			this.engageTime -= deltaTime;
		}

		this.ready--;
	}
}
