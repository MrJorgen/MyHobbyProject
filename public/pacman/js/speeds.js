// Actor speed is controlled by a list of 16 values.
// Each value is the number of steps to take in a specific frame.
// Once the end of the list is reached, we cycle to the beginning.
// This method allows us to represent different speeds in a low-resolution space.
// From: https://github.com/masonicGIT/pacman/blob/master/src/Actor.js
// speed control table (from Jamey Pittman)
let stepSizes = (
  // LEVEL 1
  "1111111111111111" + // pac-man (normal)
  "0111111111111111" + // ghosts (normal)
  "1111211111112111" + // pac-man (fright)
  "0110110101101101" + // ghosts (fright)
  "0101010101010101" + // ghosts (tunnel)
  "1111111111111111" + // elroy 1
  "1111111121111111" + // elroy 2

  // LEVELS 2-4
  "1111211111112111" + // pac-man (normal)
  "1111111121111111" + // ghosts (normal)
  "1111211112111121" + // pac-man (fright)
  "0110110110110111" + // ghosts (fright)
  "0110101011010101" + // ghosts (tunnel)
  "1111211111112111" + // elroy 1
  "1111211112111121" + // elroy 2

  // LEVELS 5-20
  "1121112111211121" + // pac-man (normal)
  "1111211112111121" + // ghosts (normal)
  "1121112111211121" + // pac-man (fright) (N/A for levels 17, 19 & 20)
  "0111011101110111" + // ghosts (fright)  (N/A for levels 17, 19 & 20)
  "0110110101101101" + // ghosts (tunnel)
  "1121112111211121" + // elroy 1
  "1121121121121121" + // elroy 2

  // LEVELS 21+
  "1111211111112111" + // pac-man (normal)
  "1111211112111121" + // ghosts (normal)
  "0000000000000000" + // pac-man (fright) N/A
  "0000000000000000" + // ghosts (fright)  N/A
  "0110110101101101" + // ghosts (tunnel)
  "1121112111211121" + // elroy 1
  "1121121121121121"   // elroy 2
);

// how many seconds to display points when ghost is eaten
var pointsDuration = 1;

// how long to stay energized based on current level
var getDuration = (function () {
  var seconds = [6, 5, 4, 3, 2, 5, 2, 2, 1, 5, 2, 1, 1, 3, 1, 1, 0, 1];
  return function () {
    var i = level;
    return (i > 18) ? 0 : 60 * seconds[i - 1];
  };
})();

// how many ghost flashes happen near the end of frightened mode based on current level
var getFlashes = (function () {
  var flashes = [5, 5, 5, 5, 5, 5, 5, 5, 3, 5, 5, 3, 3, 5, 3, 3, 0, 3];
  return function () {
    var i = level;
    return (i > 18) ? 0 : flashes[i - 1];
  };
})();

// "The ghosts change colors every 14 game cycles when they start 'flashing'" -Jamey Pittman
var flashInterval = 14;