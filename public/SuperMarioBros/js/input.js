import Keyboard from './KeyboardState.js';

const keys = [{
  RIGHT: "ArrowRight",
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  A: "Space",
  B: "ControlLeft",
  SELECT: "",
  START: ""
}];
let selectedInput = 0;

export function setupKeyboard(mario) {
    const input = new Keyboard();

    input.addMapping(keys[selectedInput].A, keyState => {
        if (keyState) {
            mario.jump.start();
        } else {
            mario.jump.cancel();
        }
    });

    input.addMapping(keys[selectedInput].B, keyState => {
        mario.turbo(keyState);
    });

    input.addMapping(keys[selectedInput].RIGHT, keyState => {
        mario.go.dir += keyState ? 1 : -1;
    });

    input.addMapping(keys[selectedInput].LEFT, keyState => {
        mario.go.dir += keyState ? -1 : 1;
    });

    return input;
}
