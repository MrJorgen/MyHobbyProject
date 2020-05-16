import Compositor from "./Compositor.js";
import EntityCollider from "./EntityCollider.js";
import TileCollider from "./TileCollider.js";

export default class Level {
	constructor() {
		this.gravity = 1500;
		this.totalTime = 0;

		this.comp = new Compositor();
		this.entities = new Set();
		this.removedEntities = new Set();
		this.checkPoints = null;

		this.entityCollider = new EntityCollider(this.entities);
		this.tileCollider = null;
	}

	setCollisionGrid(matrix) {
		this.tileCollider = new TileCollider(matrix);
	}

	restart() {
		this.removedEntities.forEach(entity => {
			if (entity.spawnPos.x >= this.camera.bounds.right) {
				this.entities.add(entity);
			}
		});
		this.removedEntities.clear();
		this.entities.forEach(entity => {
			entity.active = false;
			entity.traits.forEach(trait => {
				trait.reset(entity, this);
			});
		});
	}

	update(deltaTime) {
		this.entities.forEach(entity => {
			if (entity.active) {
				entity.update(deltaTime, this);
			} else {
				// Entity becomes active when they are 3 tiles right of the camera
				// NOT TRUE!!!
				if (entity.pos.x < this.camera.bounds.right + 16) {
					entity.active = true;
				}
			}
		});

		this.entities.forEach(entity => {
			this.entityCollider.check(entity);
		});

		this.entities.forEach(entity => {
			entity.finalize();
		});

		this.totalTime += deltaTime;
	}
}
