var gameRunning = false;
var currentRotation = 0;
var currentBlock = null;
var level = 1;
var score = 0;
var nextBlock = null;
var linesCleared = 0;
var step = 40;
var dropping = false;
var startX = 3;
var startY = -1;
var locked = false;


function init() {
    score = 0;
    level = 1;
    currentBlock = null;
    currentRotation = 0;
    linesCleared = 0;
    clarField(document.getElementById('playfield'));
    clarField(document.getElementById('nextDiv'));
    document.getElementById('score').innerHTML = score;
    document.getElementById('levelDiv').innerHTML = level;
    document.getElementById('gameOverContainer').style.visibility = 'hidden';
    setBlocks();
    runGame();
    cells = new Array(10);
    var i = 0;
    for (i = 0; i < cells.length; i++) {
        cells[i] = new Array(20);
    }
}

function clarField(element) {
    if (element.hasChildNodes) {
        while (element.childNodes.length >= 1) {
            element.removeChild(element.firstChild);
        }
    }
}

function captureKey(charCode) {
    // 37 = Left arrow; 39 = Right arrow; 38 = Up arrow; 40 = Down arrow; 32 = Spacebar, 80 = p
    if (charCode == 32) {
        if (gameRunning == false && !dropping && !locked) {
            init();
            generateNextBlock();
            gameRunning = true;
            gameEngine = setInterval('runGame()', 500 - ((level - 1) * 50));
        }
        else if (gameRunning == true && !locked) {
            dropping = true;
            drop();
        };
    }
    // Rotate
    else if (charCode == 38) {
        if (mayRotate() && gameRunning) {
            currentRotation++;
            if (currentRotation > block[currentBlock].rotations.length - 1) { currentRotation = 0 }
            clearBlock();
            drawBlock();
        }
    }
    // Move left
    else if (charCode == 37) {
        if (mayMove(-1) && gameRunning) {
            clearBlock();
            block[currentBlock].xPos -= 1;
            drawBlock();
        }
    }
    // Move right
    else if (charCode == 39) {
        if (mayMove(1) && gameRunning) {
            clearBlock();
            block[currentBlock].xPos += 1;
            drawBlock();
        }
    }
    // Pause
    else if (charCode == 80) {
        if (gameRunning) {
            gameRunning = false;
            clearInterval(gameEngine);
        }
        else {
            gameRunning = true;
            gameEngine = setInterval('runGame()', 500 - ((level - 1) * 50));
        };
    }
    // Move down
    else if (charCode == 40) {
        block[currentBlock].yPos += 1;
        if (mayMove(0)) {
            clearBlock();
            drawBlock();
            score = score + level * 1;
            updateScore();
        }
        else {
            block[currentBlock].yPos -= 1;
        }
    };
}

function clearBlock() {
    element = document.getElementById('playfield');
    if (element.hasChildNodes) {
        var i = 0;
        for (i = 0; i <= 3; i++) {
            element.removeChild(element.lastChild);
        }
    }
}

function mayRotate() {
    var temp = new Array();
    var nextRotation = 1 + currentRotation;
    if (nextRotation > block[currentBlock].rotations.length - 1) { nextRotation = 0 }
    temp = block[currentBlock].rotations[nextRotation];
    var i = 0;
    for (i = 0; i <= 3; i++) {
        if (temp[i][0] + block[currentBlock].xPos < 0 || temp[i][0] + block[currentBlock].xPos > 9) { return false };
        if (temp[i][1] + block[currentBlock].yPos < 0 || temp[i][1] + block[currentBlock].yPos > 19 || cells[block[currentBlock].xPos + temp[i][0]][block[currentBlock].yPos + temp[i][1]] != undefined) { return false };
    };
    return true;
}

function mayMove(direction) {
    var temp = new Array();
    temp = block[currentBlock].rotations[currentRotation];
    var i = 0;
    for (i = 0; i <= 3; i++) {
        if (block[currentBlock].xPos + temp[i][0] + direction < 0 || block[currentBlock].xPos + temp[i][0] + direction > 9) { return false };
        if (block[currentBlock].yPos + temp[i][1] > 19 || cells[block[currentBlock].xPos + direction + temp[i][0]][block[currentBlock].yPos + temp[i][1]] != undefined) { return false };
    };
    return true;
}

function runGame() {
    if (currentBlock != null) {
        var temp = new Array();
        var landed = false;
        block[currentBlock].yPos += 1;
        temp = block[currentBlock].rotations[currentRotation];
        for (i = 0; i <= 3; i++) {
            if (block[currentBlock].yPos + temp[2][1] >= 20 || cells[block[currentBlock].xPos + temp[i][0]][block[currentBlock].yPos + temp[i][1]] != undefined) { landed = true };
        };
        if (landed == false) {
            clearBlock();
            drawBlock();
        }
        else if (landed) {
            block[currentBlock].yPos = block[currentBlock].yPos - 1;
            if (block[currentBlock].yPos <= 0) {
                gameOver();
            }
            else {
                if (dropping) {
                    dropping = false;
                    drop();
                }
                collision();
            };
        };
    };
    if (dropping) { drop() }
}

function drop() {
    if (dropping) {
        score = score + level * 2;
        gameRunning = false;
        clearInterval(gameEngine);
        dropTimer = setTimeout('runGame()', 20);
    }
    else {
        clearTimeout(dropTimer);
        gameRunning = true;
        gameEngine = setInterval('runGame()', 500 - ((level - 1) * 50));
    };
}

function gameOver() {
    clearInterval(gameEngine);
    locked = true;
    gameRunning = false;
    dropping = false;
    delay = setTimeout('locked = false', 3000);
    document.getElementById('gameOverContainer').style.visibility = 'visible';
}

function collision() {
    var i = 0;
    var temp = new Array();
    temp = block[currentBlock].rotations[currentRotation];
    for (i = 0; i <= 3; i++) {
        cells[block[currentBlock].xPos + temp[i][0]][block[currentBlock].yPos + temp[i][1]] = currentBlock;
    };
    score = score + level * 3 + 3
    checkLineFull();
    currentRotation = 0;
    generateNextBlock();
    updateScore();
}

function generateNextBlock() {
    var temp = new Array();
    var nextDiv = document.getElementById('nextDiv');
    var tilePos = new Array();
    var newTile = "";
    if (nextBlock == null) { nextBlock = Math.floor(Math.random() * 7) };
    currentBlock = nextBlock;
    nextBlock = Math.floor(Math.random() * 7);
    block[currentBlock].xPos = startX;
    block[currentBlock].yPos = startY;
    drawBlock();
    clarField(nextDiv);
    temp = block[nextBlock].rotations[0];
    var i = 0;
    for (i = 0; i <= 3; i++) {
        var xPos = temp[i][0];
        var yPos = temp[i][1];
        xPos = xPos * step;
        yPos = yPos * step + 18;
        if (nextBlock == 1) {
            xPos += 20;
            yPos += 20;
        };
        if (nextBlock == 0) {
            xPos += 20;
        };
        xPos = 'left: ' + xPos + 'px; ';
        yPos = 'top: ' + yPos + 'px; ';
        var backColor = 'background-color: ' + block[nextBlock].color + "; ";
        var style = xPos + yPos + backColor;
        newTile = document.createElement('div');
        newTile.setAttribute('style', style);
        newTile.setAttribute('class', 'block');
        newTile.setAttribute('className', 'block');
        nextDiv.appendChild(newTile);
    }

}

function checkLineFull() {
    var bonus = -1;
    var lineFull = true;
    var i = 0;
    var j = 0;
    for (i = 0; i <= 19; i++) {
        for (j = 0; j <= 9; j++) {
            if (cells[j][i] == undefined) {
                lineFull = false;
                break;
            };
        };
        if (lineFull) {
            removeLine(i);
            bonus++;
            score = score + 400 + (bonus * 200);
            linesCleared++;
        };
        lineFull = true;
    };
}

function removeLine(lineNr) {
    var i = 0;
    var j = 0;
    for (j = lineNr; j >= 0; j--) {
        for (i = 0; i <= 9; i++) {
            if (j >= 1) {
                cells[i][j] = cells[i][j - 1];
            }
            else {
                cells[i][j] = undefined;
            };
        };
    };
    redrawPlayfield();
    if (linesCleared % 10 == 0 && level < 10) {
        level++;
        document.getElementById('levelDiv').innerHTML = level;
        clearInterval(gameEngine);
        gameEngine = setInterval('runGame()', 500 - ((level - 1) * 50));
    };
}

function redrawPlayfield() {
    var playField = document.getElementById('playfield');
    clarField(playField);
    var xPos = 0;
    var yPos = 0;
    var i = 0;
    var j = 0;
    for (j = 0; j <= 19; j++) {
        for (i = 0; i <= 9; i++) {
            if (cells[i][j] != undefined) {
                xPos = i * step;
                yPos = j * step;
                xPos = 'left: ' + xPos + 'px; ';
                yPos = 'top: ' + yPos + 'px; ';
                var backColor = 'background-color: ' + block[cells[i][j]].color + "; ";
                var style = xPos + yPos + backColor;
                newTile = document.createElement('div');
                newTile.setAttribute('style', style);
                newTile.setAttribute('class', 'block');
                newTile.setAttribute('className', 'block');
                playField.appendChild(newTile);
            }
        }
    }
}

function drawBlock() {
    var playField = document.getElementById('playfield');
    var temp = new Array();
    var tilePos = new Array();
    var newTile = "";
    temp = block[currentBlock].rotations[currentRotation];
    var i = 0;
    for (i = 0; i <= 3; i++) {
            var xPos = temp[i][0];
            var yPos = temp[i][1];
            xPos = (xPos + block[currentBlock].xPos) * step;
            yPos = (yPos + block[currentBlock].yPos) * step;
            xPos = 'left: ' + xPos + 'px; ';
            yPos = 'top: ' + yPos + 'px; ';
            var backColor = 'background-color: ' + block[currentBlock].color + "; ";
            var style = xPos + yPos + backColor;
            newTile = document.createElement('div');
            newTile.setAttribute('style', style);
            newTile.setAttribute('class', 'block');
            newTile.setAttribute('className', 'block');
            playField.appendChild(newTile);
    }
}

function updateScore() {
    document.getElementById('score').innerHTML = score;
}