import { Trait } from '../Entity.js';

export default class Physics extends Trait {
  constructor() {
    super('physics');
  }

  reset(entity) {
    entity.pos.x = entity.spawnPos.x;
    entity.pos.y = entity.offset.y ? entity.spawnPos.y - entity.offset.y : entity.spawnPos.y;
    // entity.pos.y = entity.spawnPos.y;
    entity.vel.x = 0;
    entity.vel.y = 0;

  }

  update(entity, deltaTime, level) {
    entity.pos.x += entity.vel.x * deltaTime;
    level.tileCollider.checkX(entity);

    entity.pos.y += entity.vel.y * deltaTime;
    level.tileCollider.checkY(entity);

    entity.vel.y += level.gravity * deltaTime;
  }
}
