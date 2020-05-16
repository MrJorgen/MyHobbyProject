export function startKeyTracking(game) {
  document.addEventListener("keydown", (e) => {
    let { pacman, maze } = game;
    // if (pacman.pauseEnd > game.timer || e.repeat) {
    if (e.repeat || pacman.dead) {
      return;
    }
    switch (e.keyCode) {
      case 37:
        if (pacman.canMove(pacman.DIR.left, maze)) {
          pacman.currentDirection = pacman.directions[1];
          pacman.heading = pacman.DIR.left;
          pacman.moving = true;
          pacman.pos.y = Math.round(pacman.pos.y);
        }
        break;
      case 38:
        if (pacman.canMove(pacman.DIR.up, maze)) {
          pacman.currentDirection = pacman.directions[0];
          pacman.heading = pacman.DIR.up;
          pacman.moving = true;
          pacman.pos.x = Math.round(pacman.pos.x);
        }
        break;
      case 39:
        if (pacman.canMove(pacman.DIR.right, maze)) {
          pacman.currentDirection = pacman.directions[3];
          pacman.heading = pacman.DIR.right;
          pacman.moving = true;
          pacman.pos.y = Math.round(pacman.pos.y);
        }
        break;
      case 40:
        if (pacman.canMove(pacman.DIR.down, maze)) {
          pacman.currentDirection = pacman.directions[2];
          pacman.heading = pacman.DIR.down;
          pacman.moving = true;
          pacman.pos.x = Math.round(pacman.pos.x);
        }
        break;
    }
  });
}