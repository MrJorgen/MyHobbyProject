var perft_leafNodes;

function Perft(depth) {
  if (depth == 0) {
    perft_leafNodes++;
    return;
  }

  GenerateMoves();

  var index;
  var move;

  for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    move = GameBoard.moveList[index];
    if (MakeMove(move) == false) {
      continue;
    }
    Perft(depth - 1);
    TakeMove();
  }

  return;
}

function PerftTest(depth, pos5 = false) {
  if (pos5) {
    ParseFen("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8");
    PrintBoard();
    SetInitialBoardPieces();
    CheckAndSet();
  }
  let start = performance.now();
  PrintBoard();
  console.log("Starting Test To Depth:" + depth);
  perft_leafNodes = 0;

  var index;
  var move;
  var moveNum = 0;
  for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    move = GameBoard.moveList[index];
    if (MakeMove(move) == false) {
      continue;
    }
    moveNum++;
    var cumnodes = perft_leafNodes;
    Perft(depth - 1);
    TakeMove();
    var oldnodes = perft_leafNodes - cumnodes;
    console.log("move:" + moveNum + " " + PrMove(move) + " " + oldnodes);
  }

  let stop = performance.now();
  console.log(`Depth: ${depth} ply. Result: ${formatLargeNumber(perft_leafNodes)} positions Time: ${Math.round(stop - start)} ms`);

  return;
}

function formatLargeNumber(num) {
  let numStr = num.toString(),
    newStr = numStr.slice(0, numStr.length % 3),
    j = numStr.length % 3;

  while (j + 3 <= numStr.length) {
    newStr += " " + numStr.slice(j, j + 3);
    j += 3;
  }

  return newStr;
}
/*
Position 5
rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8
❌✔️
Depth	Nodes
1	44
2	1,486
3	62,379
4	2,103,487
5	89,941,194

*/
