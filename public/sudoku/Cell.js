export class Cell {
	constructor(row, col, num = 0) {
		this.row = parseInt(row);
		this.col = parseInt(col);
		this.num = num;
		this.validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		this.permanent = false;
	}

	// Get a random number for a cell
  randomize(sudokuTable) {
    if (!this.permanent) {
      if (this.validNumbers.length == 9) {
        let occupiedNumbers = this.findIllegalNumbers(sudokuTable);
        occupiedNumbers.forEach(num => {
          if (num !== 0) {
            this.validNumbers.splice(this.validNumbers.indexOf(num), 1);
          }
        });
      }
      if (this.validNumbers.length == 0) {
        return false;
      }
      let randomNumber = Math.floor(Math.random() * this.validNumbers.length);
      this.num = this.validNumbers[randomNumber];
      
      this.validNumbers.splice(this.validNumbers.indexOf(this.num), 1);
    }
    return true;
    // return false;
	}

	findIllegalNumbers(sudokuTable) {
		let numbers = new Set();

		// Find occupied numbers in the row
		for (let col = 0; col < 9; col++) {
			numbers.add(sudokuTable[this.row][col].num);
		}

		// Find occupied numbers in the column
		for (let row = 0; row < 9; row++) {
			numbers.add(sudokuTable[row][this.col].num);
		}

		// Find occupied numbers in the box
		let boxRowStart = Math.floor(this.row / 3);
		let boxColStart = Math.floor(this.col / 3);
		for (let row = boxRowStart * 3; row < boxRowStart * 3 + 3; row++) {
			for (let col = boxColStart * 3; col < boxColStart * 3 + 3; col++) {
				numbers.add(sudokuTable[row][col].num);
			}
		}
		return numbers;
	}
}
