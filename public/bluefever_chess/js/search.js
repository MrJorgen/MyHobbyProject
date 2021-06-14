var SearchController = {};

SearchController.nodes;
SearchController.fh;
SearchController.fhf;
SearchController.depth;
SearchController.time;
SearchController.start;
SearchController.stop;
SearchController.best;
SearchController.thinking;

function PickNextMove(MoveNum) {
  var index = 0;
  var bestScore = -1;
  var bestNum = MoveNum;

  for (index = MoveNum; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
    if (GameBoard.moveScores[index] > bestScore) {
      bestScore = GameBoard.moveScores[index];
      bestNum = index;
    }
  }

  if (bestNum != MoveNum) {
    var temp = 0;
    temp = GameBoard.moveScores[MoveNum];
    GameBoard.moveScores[MoveNum] = GameBoard.moveScores[bestNum];
    GameBoard.moveScores[bestNum] = temp;

    temp = GameBoard.moveList[MoveNum];
    GameBoard.moveList[MoveNum] = GameBoard.moveList[bestNum];
    GameBoard.moveList[bestNum] = temp;
  }
}

function ClearPvTable() {
  for (index = 0; index < PVENTRIES; index++) {
    GameBoard.PvTable[index].move = NOMOVE;
    GameBoard.PvTable[index].posKey = 0;
  }
}

function CheckUp() {
  if (performance.now() - SearchController.start > SearchController.time) {
    SearchController.stop = true;
  }
}

function IsRepetition() {
  var index = 0;

  for (index = GameBoard.hisPly - GameBoard.fiftyMove; index < GameBoard.hisPly - 1; ++index) {
    if (GameBoard.posKey == GameBoard.history[index].posKey) {
      return true;
    }
  }

  return false;
}

function Quiescence(alpha, beta) {
  if ((SearchController.nodes & 2047) == 0) {
    CheckUp();
  }

  SearchController.nodes++;

  if ((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply != 0) {
    return 0;
  }

  if (GameBoard.ply > MAXDEPTH - 1) {
    return EvalPosition();
  }

  var Score = EvalPosition();

  if (Score >= beta) {
    return beta;
  }

  if (Score > alpha) {
    alpha = Score;
  }

  GenerateCaptures();

  var MoveNum = 0;
  var Legal = 0;
  var OldAlpha = alpha;
  var BestMove = NOMOVE;
  var Move = NOMOVE;

  for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
    PickNextMove(MoveNum);

    Move = GameBoard.moveList[MoveNum];

    if (MakeMove(Move) == false) {
      continue;
    }
    Legal++;
    Score = -Quiescence(-beta, -alpha);

    TakeMove();

    if (SearchController.stop == true) {
      return 0;
    }

    if (Score > alpha) {
      if (Score >= beta) {
        if (Legal == 1) {
          SearchController.fhf++;
        }
        SearchController.fh++;
        return beta;
      }
      alpha = Score;
      BestMove = Move;
    }
  }

  if (alpha != OldAlpha) {
    StorePvMove(BestMove);
  }

  return alpha;
}

function AlphaBeta(alpha, beta, depth) {
  if (depth <= 0) {
    return Quiescence(alpha, beta);
  }

  if ((SearchController.nodes & 2047) == 0) {
    CheckUp();
  }

  SearchController.nodes++;

  if ((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply != 0) {
    return 0;
  }

  if (GameBoard.ply > MAXDEPTH - 1) {
    return EvalPosition();
  }

  var InCheck = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], GameBoard.side ^ 1);
  if (InCheck == true) {
    depth++;
  }

  var Score = -INFINITE;

  GenerateMoves();

  var MoveNum = 0;
  var Legal = 0;
  var OldAlpha = alpha;
  var BestMove = NOMOVE;
  var Move = NOMOVE;

  var PvMove = ProbePvTable();
  if (PvMove != NOMOVE) {
    for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
      if (GameBoard.moveList[MoveNum] == PvMove) {
        GameBoard.moveScores[MoveNum] = 2000000;
        break;
      }
    }
  }

  for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
    PickNextMove(MoveNum);

    Move = GameBoard.moveList[MoveNum];

    if (MakeMove(Move) == false) {
      continue;
    }
    Legal++;
    Score = -AlphaBeta(-beta, -alpha, depth - 1);

    TakeMove();

    if (SearchController.stop == true) {
      return 0;
    }

    if (Score > alpha) {
      if (Score >= beta) {
        if (Legal == 1) {
          SearchController.fhf++;
        }
        SearchController.fh++;
        if ((Move & MFLAGCAP) == 0) {
          GameBoard.searchKillers[MAXDEPTH + GameBoard.ply] = GameBoard.searchKillers[GameBoard.ply];
          GameBoard.searchKillers[GameBoard.ply] = Move;
        }
        return beta;
      }
      if ((Move & MFLAGCAP) == 0) {
        GameBoard.searchHistory[GameBoard.pieces[FROMSQ(Move)] * BRD_SQ_NUM + TOSQ(Move)] += depth * depth;
      }
      alpha = Score;
      BestMove = Move;
    }
  }

  if (Legal == 0) {
    if (InCheck == true) {
      return -MATE + GameBoard.ply;
    } else {
      return 0;
    }
  }

  if (alpha != OldAlpha) {
    StorePvMove(BestMove);
  }

  return alpha;
}

function ClearForSearch() {
  var index = 0;
  var index2 = 0;

  for (index = 0; index < 14 * BRD_SQ_NUM; ++index) {
    GameBoard.searchHistory[index] = 0;
  }

  for (index = 0; index < 3 * MAXDEPTH; ++index) {
    GameBoard.searchKillers[index] = 0;
  }

  ClearPvTable();
  GameBoard.ply = 0;
  SearchController.nodes = 0;
  SearchController.fh = 0;
  SearchController.fhf = 0;
  SearchController.start = performance.now();
  SearchController.stop = false;
}

function SearchPosition() {
  var bestMove = NOMOVE;
  var bestScore = -INFINITE;
  var Score = -INFINITE;
  var currentDepth = 0;
  var line;
  var PvNum;
  var c;
  ClearForSearch();

  for (currentDepth = 1; currentDepth <= SearchController.depth; ++currentDepth) {
    Score = AlphaBeta(-INFINITE, INFINITE, currentDepth);

    if (SearchController.stop == true) {
      break;
    }

    bestScore = Score;
    bestMove = ProbePvTable();
    line = "D:" + currentDepth + " Best:" + PrMove(bestMove) + " Score:" + bestScore + " nodes:" + SearchController.nodes;

    PvNum = GetPvLine(currentDepth);
    line += " Pv:";
    for (c = 0; c < PvNum; ++c) {
      line += " " + PrMove(GameBoard.PvArray[c]);
    }
    if (currentDepth != 1) {
      line += " Ordering:" + ((SearchController.fhf / SearchController.fh) * 100).toFixed(2) + "%";
    }
    console.log(line);
  }

  SearchController.best = bestMove;
  SearchController.thinking = false;
  UpdateDOMStats(bestScore, currentDepth);
}

function UpdateDOMStats(dom_score, dom_depth) {
  var scoreText = "Score: " + (dom_score / 100).toFixed(2);
  if (Math.abs(dom_score) > MATE - MAXDEPTH) {
    scoreText = "Score: Mate In " + (MATE - Math.abs(dom_score) - 1) + " moves";
  }

  document.querySelector("#OrderingOut").textContent = "Ordering: " + ((SearchController.fhf / SearchController.fh) * 100).toFixed(2) + "%";
  document.querySelector("#DepthOut").textContent = "Depth: " + dom_depth;
  document.querySelector("#ScoreOut").textContent = scoreText;
  document.querySelector("#NodesOut").textContent = "Nodes: " + SearchController.nodes;
  document.querySelector("#TimeOut").textContent = "Time: " + ((performance.now() - SearchController.start) / 1000).toFixed(1) + "s";
  document.querySelector("#BestOut").textContent = "BestMove: " + PrMove(SearchController.best);
}
