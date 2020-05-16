import TileResolver from "./TileResolver.js";
import { Sides } from "./Entity.js";

export default class TileCollider {
	constructor(tileMatrix) {
		this.tiles = new TileResolver(tileMatrix);
	}

	checkX(entity) {
		let x;
		if (entity.vel.x > 0) {
			x = entity.bounds.right;
		} else if (entity.vel.x < 0) {
			x = entity.bounds.left;
		} else {
			return;
		}

		const matches = this.tiles.searchByRange(
			x,
			x,
			entity.bounds.top,
			entity.bounds.bottom
		);

		matches.forEach(match => {
			if (match.tile.type !== "solid") {
				return;
			}

			if (entity.vel.x > 0) {
				if (entity.bounds.right > match.x1) {
					entity.obstruct(Sides.RIGHT, match);
				}
			} else if (entity.vel.x < 0) {
				if (entity.bounds.left < match.x2) {
					entity.obstruct(Sides.LEFT, match);
				}
			}
		});
	}

	checkY(entity) {
		let y;
		if (entity.vel.y > 0) {
			y = entity.bounds.bottom;
		} else if (entity.vel.y < 0) {
			y = entity.bounds.top;
		} else {
			return;
		}

		function findOuterBounds(tiles) {
			let outerBounds = { left: Infinity, right: -Infinity };
			tiles.forEach(tile => {
				if (tile.tile.type === "solid") {
					outerBounds.left = outerBounds.left > tile.x1 ? tile.x1 : outerBounds.left;
					outerBounds.right = outerBounds.right < tile.x2 ? tile.x2 : outerBounds.right;
				}
			});
			return outerBounds;
		}

		const matches = this.tiles.searchByRange(
			entity.bounds.left,
			entity.bounds.right,
			y,
			y
		);

    // Mario(or any entity) will not be obstructed if his center is outside the 
    // outer bound, but he will be moved outside the outer bound.
    // Also the tile his center is hitting is the one to be returned(or obstruct him).

		matches.forEach(match => {
			if (match.tile.type !== "solid") {
				return;
			}

			if (entity.vel.y > 0) {
				if (entity.bounds.bottom > match.y1) {
					entity.obstruct(Sides.BOTTOM, match);
				}
			} else if (entity.vel.y < 0) {
				let outerBounds = findOuterBounds(matches);
        if (entity.bounds.top < match.y2) {
          if (entity.bounds.left + (entity.size.x / 2) > outerBounds.right) {
            entity.bounds.left = outerBounds.right;
          }
          else if (entity.bounds.right - (entity.size.x / 2) < outerBounds.left) {
            entity.bounds.right = outerBounds.left;
          }
          else {
            entity.obstruct(Sides.TOP, match);
          }

				}
			}
		});
	}
}
