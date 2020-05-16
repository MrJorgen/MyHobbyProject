import { Vec2 } from "./math.js";
import BoundingBox from "./BoundingBox.js";

export const Sides = {
	TOP: Symbol("top"),
	BOTTOM: Symbol("bottom"),
	LEFT: Symbol("left"),
	RIGHT: Symbol("right")
};

export class Trait {
	constructor(name) {
		this.NAME = name;

		this.tasks = [];
	}

	finalize() {
		this.tasks.forEach(task => task());
		this.tasks.length = 0;
	}

	queue(task) {
		this.tasks.push(task);
	}

	collides(us, them) {}

	obstruct() {}

	update() {}

	reset() {}
}

export default class Entity {
	constructor() {
		this.spawnPos = new Vec2(0, 0);
		this.pos = new Vec2(0, 0);
		this.vel = new Vec2(0, 0);
		this.size = new Vec2(0, 0);
		this.offset = new Vec2(0, 0);
		this.bounds = new BoundingBox(this.pos, this.size, this.offset);
		this.lifetime = 0;
		this.name = "";
		this.active = false;

		this.traits = [];
	}

	addTrait(trait) {
		this.traits.push(trait);
		this[trait.NAME] = trait;
  }
  
  removeTrait(trait) {
    for (let i = 0; i < this.traits.length; i++) {
      if (this.traits === trait) {
        this.traits.splice(i, 1)
        console.log("Removed triat " + trait);
        break;
      }
    }
  }

	collides(candidate) {
		this.traits.forEach(trait => {
			trait.collides(this, candidate);
		});
	}

	obstruct(side, match) {
		this.traits.forEach(trait => {
			trait.obstruct(this, side, match);
		});
	}

	draw() {}

	finalize() {
		this.traits.forEach(trait => {
			trait.finalize();
		});
	}

	update(deltaTime, level) {
		this.traits.forEach(trait => {
			trait.update(this, deltaTime, level);
		});

		this.lifetime += deltaTime;
	}
}
