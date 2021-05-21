import Pawn from "./pieces/Pawn.js";
// import board from "./Board.js";
// import Player from "./Player.js";

// import("./Board.js");
// import("./Player.js");
// import("./pieces/Piece.js");
console.log("Worker initialized!");

self.onmessage = (evt) => {
  console.log("Worker started");
  let pawn1 = new Pawn("black", null, 0, 1);
  console.log(pawn1);
  console.log(evt.data);
  //   pawn1.findLegalMoves(evt.data);
  postMessage("Done");
  //   close();
};
