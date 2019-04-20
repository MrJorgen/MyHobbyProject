let filledNumbers = 0, passes = 0, oldFilledNumbers = 0;
export function calcNext(sudokuTable) {
  do {
    oldFilledNumbers = filledNumbers;
    findValidNumbers(sudokuTable);
    checkRow(sudokuTable);
    checkCol(sudokuTable);
    checkBox(sudokuTable);
    console.log(filledNumbers);
    passes++;
  }
  while (filledNumbers > oldFilledNumbers);
  console.log(filledNumbers, passes);
}

function checkRow(sudokuTable) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      
      if (!sudokuTable[row][col].permanent) {
        let tmpArray = Array.from(sudokuTable[row][col].validNumbers);
        if (tmpArray.length !== 1) {
          for (let num of sudokuTable[row][col].validNumbers) {
            for (let i = 0; i < 9; i++) {
              if (sudokuTable[row][i].permanent || col == i) {
                continue;
              }
              if (sudokuTable[row][i].validNumbers.includes(num)) {
                tmpArray.splice(tmpArray.indexOf(num), 1);
                break;
              }
            }
          }
        }
				if (tmpArray.length == 1) {
          sudokuTable[row][col].num = tmpArray[0];
          sudokuTable[row][col].permanent = true;
          findValidNumbers(sudokuTable);
          filledNumbers++;
				}
      }
      
		}
	}
}

function checkCol(sudokuTable) {
  for (let col = 0; col < 9; col++) {
    for (let row = 0; row < 9; row++) {
      if (!sudokuTable[row][col].permanent) {
        let tmpArray = Array.from(sudokuTable[row][col].validNumbers);
        if (tmpArray.length !== 1) {
          for (let num of sudokuTable[row][col].validNumbers) {
            for (let i = 0; i < 9; i++) {
              if (sudokuTable[i][col].permanent || col == i) {
                continue;
              }
              if (sudokuTable[i][col].validNumbers.includes(num)) {
                tmpArray.splice(tmpArray.indexOf(num), 1);
                break;
              }
            }
          }
        }
				if (tmpArray.length == 1) {
          sudokuTable[row][col].num = tmpArray[0];
					sudokuTable[row][col].permanent = true;
          filledNumbers++;
          findValidNumbers(sudokuTable);
				}
			}
		}
	}
}

function checkBox(sudokuTable) {
  let boxes = [
    { boxNr: 1, col: 0, row: 0 },
		{ boxNr: 2, col: 3, row: 0 },
		{ boxNr: 3, col: 6, row: 0 },
		{ boxNr: 4, col: 0, row: 3 },
		{ boxNr: 5, col: 3, row: 3 },
		{ boxNr: 6, col: 6, row: 3 },
		{ boxNr: 7, col: 0, row: 6 },
		{ boxNr: 8, col: 3, row: 6 },
		{ boxNr: 9, col: 6, row: 6 }
	];
	boxes.forEach(box => {
    for (let row = box.row; row < box.row + 3; row++) {
      for (let col = box.col; col < box.col + 3; col++) {
        if (!sudokuTable[row][col].permanent) {
          let tmpArray = Array.from(sudokuTable[row][col].validNumbers);
          if (tmpArray.length !== 1) {
            for (let num of sudokuTable[row][col].validNumbers) {
              for (let i = box.row; i < box.row + 3; i++) {
                for (let j = box.col; j < box.col + 3; j++) {
                  if (sudokuTable[i][j].permanent || (row === i && col === j)) {
                    continue;
                  }
                  if (sudokuTable[i][j].validNumbers.includes(num)) {
                    let index = tmpArray.indexOf(num);
                    if (index >= 0) {
                      tmpArray.splice(index, 1);
                      break;
                    }
                  }
                }
              }
            }
          }
					if (tmpArray.length == 1) {
            sudokuTable[row][col].num = tmpArray[0];
						sudokuTable[row][col].permanent = true;
            filledNumbers++;
            findValidNumbers(sudokuTable);
					}
				}
			}
		}
	});
}

function findValidNumbers(sudokuTable) {
	for (let row = 0; row <= 8; row++) {
		for (let col = 0; col <= 8; col++) {
			let currentCell = sudokuTable[row][col];
			if (!currentCell.permanent) {
				currentCell.validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				let occupiedNumbers = currentCell.findIllegalNumbers(sudokuTable);
				occupiedNumbers.forEach(num => {
					if (num !== 0) {
						currentCell.validNumbers.splice(currentCell.validNumbers.indexOf(num), 1);
					}
				});
			}
		}
	}
}
