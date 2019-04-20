import { Sides, Trait } from "../Entity.js";

export default class Killable extends Trait {
	constructor() {
		super("killable");
		this.removeAfter = 1;
		this.reset();
	}

	kill(entity, animate) {
		// Check if entity is Mario then do the dying anim
		if (entity.killable.die && !entity.killable.dead) {
			// entity.killable.dead = true;
			entity.killable.die(animate);
		}
		this.queue(() => (this.dead = true));
	}

	reset(entity) {
		this.dead = false;
		this.deadTime = 0;
	}

	update(entity, deltaTime, level) {
		// Remove enteties when they fall off the scene(level)
		if (entity.bounds.top > level.camera.bounds.bottom && !entity.killable.dead) {
			console.log("Entity out of bounds! Removed " + entity.name + " from the scene");
			this.kill(entity, false);
			// level.removedEntities.add(entity);
			// level.entities.delete(entity);
		}

		if (this.dead) {
			this.deadTime += deltaTime;
			if (this.deadTime > this.removeAfter) {
				this.queue(() => {
					level.removedEntities.add(entity);
					level.entities.delete(entity);
				});
			}
		}
	}
}
