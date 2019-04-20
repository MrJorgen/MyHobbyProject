import { Vec2 } from './math.js';
import BoundingBox from './BoundingBox.js';

export default class Camera {
  constructor() {
    this.pos = new Vec2(0, 8);
    this.size = new Vec2(256, 224);
    this.bounds = new BoundingBox(this.pos, this.size);
    this.scrollMax = 0;
    this.scrollBuffer = 0;
  }
}
