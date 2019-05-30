"use strict";
import { Cell } from "./Cell.js";
import { calcNext } from "./solver.js";
import { boards } from "./boards.js";

let cells;
let sudokuTable = [];
let difficulty = "hard", generateBoard = false;

window.onload = () => {
  cells = document.querySelectorAll("td");
  setupEventHandlers();
};

function createSudoku(startRow = 0, startCol = 0) {
  // rowLoop:
  for (let row = 0; row < 9; row++) {
    // colLoop:
    for (let col = 0; col < 9; col++) {
      if (row >= startRow && col >= startCol) {
        startRow = 0;
        startCol = 0;
        if (!sudokuTable[row][col].randomize(sudokuTable)) {
          backTrack(row, col);
          return null;
        }
      }
		}
  }
  console.log("Done!");
}

function backTrack(row, col) {
  let bad = false;
  do {
		if (!sudokuTable[row][col].permanent) {
			sudokuTable[row][col] = new Cell(row, col);
		}
		col--;
		if (col < 0) {
			col = 8;
			row--;
		}
		if (row < 0) {
			console.error("No valid solution!");
			bad = true;
			break;
		}
		// console.log(row, col);
	} while (!sudokuTable[row][col].randomize(sudokuTable) || sudokuTable[row][col].permanent);
  col++;
  if (col > 8) {
    col = 0;
    row++;
  }
  if (!bad) {
    createSudoku(row, col);
  }
}

function checkForDuplicates(row, col) {
  row = parseInt(row);
  col = parseInt(col);
  console.log(sudokuTable);
  console.log("Checking " + sudokuTable[row][col].num);
  for (let i = 0; i < 9; i++) {
    if (sudokuTable[row][i].num === sudokuTable[row][col].num && col !== i) {
      // Set both cells to display numbers in red
      cells[row * 9 + i].classList.add("error");
      cells[row * 9 + col].classList.add("error");
      break;
    }
    else if (sudokuTable[i][col].num === sudokuTable[row][col].num && row !== i ) {
      // Set both cells to display numbers in red
      cells[i * 9 + col].classList.add("error");
      cells[row * 9 + col].classList.add("error");
      break;
    }
    else {
      cells[i * 9 + col].classList.remove("error");
      cells[row * 9 + i].classList.remove("error");
      
    }
  }
}

function reset() {
  cells.forEach((cell) => {
    cell.classList.remove("user-set", "error");
  })
  for (let row = 0; row < 9; row++){
    sudokuTable[row] = [];
    for (let col = 0; col < 9; col++) {
      sudokuTable[row][col] = new Cell(row, col);
    }
  }
  if (!generateBoard) {
    fakeNumbers();
  }
}

function fakeNumbers() {
  let index = 0,
    // numbers = boards[difficulty][Math.floor(Math.random() * boards[difficulty].length)];
    numbers = boards[difficulty][0];
  for (let row = 0; row <= 8; row++) {
    for (let col = 0; col <= 8; col++) {
      if (numbers[index] !== 0) {
        sudokuTable[row][col].num = numbers[index];
        sudokuTable[row][col].permanent = true;
      }
      index++;
    }
  }
}

function setupEventHandlers() {
  // Event handlers for all cells(highlights, click & input)
  cells.forEach((cell) => {
    cell.addEventListener("mouseover", (e) => {
      addHighlights(e.target);
    });
    cell.addEventListener("mouseout", removeHighlights);
    cell.addEventListener("click", (e) => {
      setNumber(e);
    });
    cell.addEventListener("input", input);
  })
  
  document.querySelector("#startButton").addEventListener("click", (e) => {
    let generateTimer = new Date();
    generateBoard = document.querySelector("#generate").checked;
    difficulty = document.querySelector("#difficulty").value;
    reset();
    if (generateBoard) {
      createSudoku();
      printTable(true);
    }
    else {
      printTable(false);
    }
    document.querySelector("#table-footer").innerHTML = `It took ${new Date() - generateTimer} milliseconds to generate the board.`;
  });
  document.querySelector("#calcButton").addEventListener("click", (e) => {
    calcNext(sudokuTable);
    printTable(false);
  });
}

function input(e) {
  // Get the input and set it to the table and cell data
  e.target.removeEventListener("blur", input);
  let col = e.target.parentElement.dataset.col,
    row = e.target.parentElement.dataset.row;
  if (e.data > 0 && e.data < 10) {
    e.target.parentElement.dataset.num = e.data;
    e.target.parentElement.innerHTML = e.data;
  }
  else if (e.type == "input") {
    delete e.target.parentElement.dataset.num;
    e.target.parentElement.innerHTML = "";
  }
  else if (e.type == "blur" && e.target.parentElement.dataset.num) {
    e.target.parentElement.innerHTML = e.target.parentElement.dataset.num;
  }
  else {
    delete e.target.parentElement.dataset.num ;
    e.target.parentElement.innerHTML = "";
  }
  // Set number in sudokuTable
  if (e.path[1].dataset.num) {
    sudokuTable[row][col] = new Cell(row, col);
    sudokuTable[e.path[1].dataset.row][e.path[1].dataset.col].num = parseInt(e.path[1].dataset.num);
    sudokuTable[e.path[1].dataset.row][e.path[1].dataset.col].permanent = true;
    checkForDuplicates(row, col);
  }
}

function setNumber(e) {
  // Create the input element and set it to recive input
  let element = document.createElement("input");
  element.type = "number";
  element.min = 0;
  element.max = 9;
  element.classList.add("user-set");
  e.target.appendChild(element);

  e.target.classList.add("user-set");
  element.value = e.target.dataset.num || "";
  element.style.display = "block";
  element.focus();
  element.addEventListener("blur", input);
}

function addHighlights(elem) {
  if (elem.tagName == "TD") {
    elem.classList.add("highlight2");
  }
  cells.forEach(cell => {
    if (elem.dataset.num !== undefined) {
      if (cell.dataset.num === elem.dataset.num) {
        cell.classList.add("highlight2");
      }
    }
    if (cell.dataset.col === elem.dataset.col ||
      cell.dataset.row === elem.dataset.row) {
        cell.classList.add("highlight");
      }
  })
}

function removeHighlights() {
  cells.forEach(cell => {
    cell.classList.remove("highlight");
    cell.classList.remove("highlight2");
  })
}

function printTable(showSolution) {
  cells.forEach((cell, index) => {
    let tmpNr = sudokuTable[Math.floor(index / 9)][index % 9];
    cell.innerHTML = "";
    delete cell.dataset.num;
    if (!tmpNr.permanent) {
      if (showSolution) {
        cell.innerHTML = tmpNr.num;
        cell.dataset.num = tmpNr.num;
        tmpNr.permanent = true;
      }
      else {
        cell.classList.add("user-set");
      }
    } else {
      cell.innerHTML = tmpNr.num;
      cell.dataset.num = tmpNr.num;
    }
    
	});
}