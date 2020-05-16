import Entity, { Sides, Trait } from "../Entity.js";
import Killable from "../traits/Killable.js";
import PendulumMove from "../traits/PendulumMove.js";
import Physics from "../traits/Physics.js";
import Solid from "../traits/Solid.js";
import { loadSpriteSheet } from "../loaders.js";

export function loadKoopa() {
	return loadSpriteSheet("koopa").then(createKoopaFactory);
}

const STATE_WALKING = Symbol("walking");
const STATE_HIDING = Symbol("hiding");
const STATE_PANIC = Symbol("panic");

class Behavior extends Trait {
	constructor() {
		super("behavior");

		this.hideDuration = 5;
		this.panicSpeed = 300;
		this.reset();
	}

	reset() {
		this.hideTime = 0;
		this.walkSpeed = null;
		this.state = STATE_WALKING;
	}

	collides(us, them) {
		if (us.killable.dead || them.killable.dead) {
			return;
		}

		if (them.stomper) {
			if (them.vel.y > us.vel.y) {
				this.handleStomp(us, them);
			} else {
				this.handleNudge(us, them);
			}
		} else {
			if (this.state === STATE_PANIC) {
				them.vel.set(100, -200);
				them.solid.obstructs = false;
			}
		}
	}

	handleNudge(us, them) {
		if (this.state === STATE_WALKING) {
			them.killable.kill(them);
		} else if (this.state === STATE_HIDING) {
			this.panic(us, them);
		} else if (this.state === STATE_PANIC) {
			const travelDir = Math.sign(us.vel.x);
			const impactDir = Math.sign(us.pos.x - them.pos.x);
			if (travelDir !== 0 && travelDir !== impactDir) {
				them.killable.kill(them);
			}
		}
	}

	handleStomp(us, them) {
		if (this.state === STATE_WALKING) {
			this.hide(us);
		} else if (this.state === STATE_HIDING) {
			// A "panicing" Koopa does not die when hiding and stomped on
			// it goes to panic state.

			// us.killable.kill(us);
			// us.vel.set(100, -200);
			// us.solid.obstructs = false;
			this.handleNudge(us, them);
		} else if (this.state === STATE_PANIC) {
			this.hide(us);
		}
	}

	hide(us) {
		us.vel.x = 0;
		us.pendulumMove.enabled = false;
		if (this.walkSpeed === null) {
			this.walkSpeed = us.pendulumMove.speed;
		}
		this.hideTime = 0;
		this.state = STATE_HIDING;
	}

	unhide(us) {
		us.pendulumMove.enabled = true;
		us.pendulumMove.speed = this.walkSpeed;
		this.state = STATE_WALKING;
	}

	panic(us, them) {
		us.pendulumMove.enabled = true;
		us.pendulumMove.speed = this.panicSpeed * Math.sign(us.pos.x - them.pos.x);
		this.state = STATE_PANIC;
	}

  update(us, deltaTime, level) {
		if (this.state === STATE_HIDING) {
			this.hideTime += deltaTime;
			if (this.hideTime > this.hideDuration) {
				this.unhide(us);
			}
    }
    if (this.state === STATE_PANIC && us.bounds.left > level.camera.bounds.right + 16) {
      level.removedEntities.add(us);
      level.entities.delete(us);
    }
	}
}

function createKoopaFactory(sprite) {
	const walkAnim = sprite.animations.get("walk");
	const wakeAnim = sprite.animations.get("wake");

	function routeAnim(koopa) {
		if (koopa.behavior.state === STATE_HIDING) {
			if (koopa.behavior.hideTime > 3) {
				return wakeAnim(koopa.behavior.hideTime);
			}
			return "hiding";
		}

		if (koopa.behavior.state === STATE_PANIC) {
			return "hiding";
		}

		return walkAnim(koopa.lifetime);
	}

	function drawKoopa(context) {
		sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
	}

	return function createKoopa() {
		const koopa = new Entity();
		koopa.size.set(16, 16);
		koopa.offset.y = 8;

		koopa.addTrait(new Physics());
		koopa.addTrait(new Solid());
		koopa.addTrait(new PendulumMove());
		koopa.addTrait(new Killable());
		koopa.addTrait(new Behavior());

		koopa.draw = drawKoopa;

		return koopa;
	};
}
