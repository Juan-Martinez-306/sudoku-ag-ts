// Definition of the Sudoku class and utility functions

export function tupleEquals(a: number[], b: number[]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}
function isValid(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  for (let i = 0; i < 9; i++) {
    // Check if either row and column is invalid
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }
  const boxRow = 3 * Math.floor(row / 3);
  const boxColumn = 3 * Math.floor(col / 3);
  // Check if valid in box
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxColumn; j < boxColumn + 3; j++) {
      if (board[i][j] === num) {
        return false;
      }
    }
  }
  return true;
}

function solveSudoku(board: number[][]): boolean {
  const empty = findEmptyLocation(board);
  if (!empty) {
    return true; // No empty space left, puzzle solved
  }
  const [row, col] = empty;
  const numbers = shuffleArray(Array.from({ length: 9 }, (_, i) => i + 1));
  for (const num of numbers) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      // See if will be valid for a full sudokuBoard
      if (solveSudoku(board)) {
        return true;
      }
      board[row][col] = 0; // Backtrack if placing num doesn't lead to a solution
    }
  }
  return false;
}

function findEmptyLocation(board: number[][]): [number, number] | null {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
}

function fillDiagonalBoxes(board: number[][]): void {
  for (let i = 0; i < 9; i += 3) {
    fillBox(board, i, i);
  }
}

function fillBox(board: number[][], row: number, col: number): void {
  const numbers = shuffleArray(Array.from({ length: 9 }, (_, i) => i + 1));
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[row + i][col + j] = numbers.pop()!;
    }
  }
}

function generateSudoku(): number[][] {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillDiagonalBoxes(board); // Fill diagonal boxes first
  solveSudoku(board); // Solve the rest of the board
  return board;
}

function printBoard(board: number[][]): void {
  for (const row of board) {
    console.log(row.join(" "));
  }
}

function shuffleArray(array: number[]): number[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
const getRowCol = (boxNum: number) => {
  const row = Math.floor(boxNum / 9);
  const col = boxNum % 9;
  return { row, col };
};
const getCorner = (boxNum: number) => {
  const cord = getRowCol(boxNum);
  const boxRow = Math.floor(cord.row / 3) * 3;
  const boxCol = Math.floor(cord.col / 3) * 3;
  return { boxRow, boxCol };
};
const areInSameSudokuBox = (bx1: number, bx2: number) => {
  const box1Corner = getCorner(bx1);
  const box2Corner = getCorner(bx2);

  return (
    box1Corner.boxRow === box2Corner.boxRow &&
    box1Corner.boxCol === box2Corner.boxCol
  );
};

const areInSameSudokuRowOrCol = (bx1: number, bx2: number) => {
  const sameRow = Math.floor(bx1 / 9) === Math.floor(bx2 / 9);
  const sameCol = bx1 % 9 === bx2 % 9;
  return sameRow || sameCol;
};
function randomSelectionFromBox(
  boxRow: number,
  boxColumn: number,
  randomAmount: number,
  randomSelection: Set<number>
) {
  let randomRow: number;
  let randomCol: number;
  let randomCordinate: number;
  for (let i = 0; i < randomAmount; ++i) {
    do {
      randomRow = shuffleArray([boxRow, boxRow + 1, boxRow + 2])[0];
      randomCol = shuffleArray([boxColumn, boxColumn + 1, boxColumn + 2])[0];
      randomCordinate = randomRow * 9 + randomCol;
    } while (
      // eslint-disable-next-line no-loop-func
      randomSelection.has(randomCordinate)
    );
    randomSelection.add(randomCordinate);
  }
}

export enum SudokuDifficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
  Debug = -1,
}
export function createSeed(board: number[][], revealed: Set<number>): string {
  const boardString = board.flat().join("");
  const revealedString = Array.from(revealed)
    .sort((a, b) => a - b)
    .join(",");
  const seed = `${boardString}|${revealedString}`;
  return btoa(seed);
}

export function createBoardFromSeed(seed: string): {
  board: number[][];
  revealed: Set<number>;
} {
  if (seed === "") {
    console.log("Seed is empty");
  }
  const decodedSeed = atob(seed);
  const [boardString, revealedString] = decodedSeed.split("|");
  const board = Array.from({ length: 9 }, (_, i) =>
    boardString
      .slice(i * 9, i * 9 + 9)
      .split("")
      .map(Number)
  );
  const revealed = new Set(revealedString.split(",").map(Number));
  return { board, revealed };
}
export class Sudoku {
  board: number[][];
  revealed: Set<number>;
  notes: {
    [key: string]: Set<string>;
  };
  showWrong: Set<number>;
  difficulty: SudokuDifficulty;
  lives: number;
  amountOfBoxesLeft: number;
  valueToAmountLeft: { [key: number]: number };
  highlightedNumbers: Set<number>;
  highlightedBoxes: Set<number>;
  selectedBoxNum: number;

  constructor(difficulty: SudokuDifficulty) {
    this.board = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.revealed = new Set<number>();
    this.difficulty = difficulty;
    this.notes = {};
    for (let i = 0; i < 81; ++i) {
      this.notes[JSON.stringify(i)] = new Set<string>();
    }
    this.showWrong = new Set<number>();
    this.lives = 5 - this.difficulty * 2;
    this.amountOfBoxesLeft = 81;
    this.valueToAmountLeft = {
      1: 9,
      2: 9,
      3: 9,
      4: 9,
      5: 9,
      6: 9,
      7: 9,
      8: 9,
      9: 9,
    };
    this.highlightedBoxes = new Set<number>();
    this.highlightedNumbers = new Set<number>();
    this.selectedBoxNum = -1;
  }
  initializeSudokuFromScratch() {
    this.board = generateSudoku();
    this.revealed = this.randomRevealed();
    // inital values left
    this.determineValuesLeft();
  }
  initializeSudokuFromSeed(seed: string) {
    const { board, revealed } = createBoardFromSeed(seed);
    this.board = board;
    this.revealed = revealed;
    this.determineValuesLeft();
  }

  getElementAtBoxNum(boxNum: number) {
    const cord = getRowCol(boxNum);
    return this.board[cord.row][cord.col];
  }

  addToRevealed(boxNum: number, value: string) {
    // Box at boxnum is now revealed
    this.revealed.add(boxNum);

    // Remove impossible notes
    for (const k in this.notes) {
      if (
        areInSameSudokuBox(boxNum, Number(k)) ||
        areInSameSudokuRowOrCol(boxNum, Number(k))
      ) {
        if (this.notes[k].has(value)) {
          this.notes[k].delete(value);
        }
      }
    }

    // Recalc value counts
    this.valueToAmountLeft[Number(value)] -= 1;
    this.amountOfBoxesLeft--;

    // If number added is part of highlightedNumbers, highlight the added value asWell
    if (this.highlightedNumbers.size > 0) {
      const values = Array.from(this.highlightedNumbers);

      const highlightedNum = this.getElementAtBoxNum(values[0]);
      if (this.getElementAtBoxNum(boxNum) === highlightedNum) {
        this.highlightedNumbers.add(boxNum);
      }
    }
  }

  handleUpdateShowWrong(boxNum: number, note: string) {
    const temp_wrong = new Set<number>();
    for (const boxNum2 of this.revealed) {
      if (
        areInSameSudokuBox(boxNum, boxNum2) ||
        areInSameSudokuRowOrCol(boxNum, boxNum2)
      ) {
        if (this.getElementAtBoxNum(boxNum2) === Number(note)) {
          temp_wrong.add(boxNum2);
        }
      }
    }
    this.showWrong = temp_wrong;
  }

  handleNoteAtBoxNum(boxNum: number, note: string) {
    // handle new showWrong
    this.handleUpdateShowWrong(boxNum, note);
    // If no conflicting numbers add or delete note
    if (this.showWrong.size === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.notes[JSON.stringify(boxNum)].has(note)
        ? this.notes[JSON.stringify(boxNum)].delete(note)
        : this.notes[JSON.stringify(boxNum)].add(note);
    }
  }
  determineValuesLeft() {
    for (const boxNum of this.revealed) {
      const valueAtPosition = this.getElementAtBoxNum(boxNum);
      this.valueToAmountLeft[valueAtPosition] -= 1;
      this.amountOfBoxesLeft--;
    }
  }

  highlightNumbersEqualToValue(value: number) {
    for (const boxN of this.revealed) {
      if (this.getElementAtBoxNum(boxN) === value) {
        this.highlightedNumbers.add(boxN);
      }
    }
  }
  clearHighlights() {
    this.highlightedBoxes.clear();
    this.highlightedNumbers.clear();
    this.showWrong.clear();
  }
  highlightBoxesAdjacentToBoxes(row: number, col: number) {
    this.selectedBoxNum = row * 9 + col;
    for (let i = 0; i < 9; i++) {
      this.highlightedBoxes.add(row * 9 + i);
      this.highlightedBoxes.add(i * 9 + col);
    }
    const boxRow = 3 * Math.floor(row / 3);
    const boxColumn = 3 * Math.floor(col / 3);
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let k = boxColumn; k < boxColumn + 3; k++) {
        this.highlightedBoxes.add(i * 9 + k);
      }
    }
  }
  handleWrongGuess(boxNum: number, value: string) {
    this.removeLife();
    this.handleUpdateShowWrong(boxNum, value);
  }

  removeLife() {
    this.lives--;
  }

  randomRevealed() {
    let revealAmounts: number[] = [0, 0, 0, 0, 0];

    switch (this.difficulty) {
      case SudokuDifficulty.Easy:
        revealAmounts = [1, 3, 4, 1, 0];
        break;
      case SudokuDifficulty.Medium:
        revealAmounts = [2, 2, 2, 3, 0];
        break;
      case SudokuDifficulty.Hard:
        revealAmounts = [0, 2, 2, 2, 3];
        break;
      case SudokuDifficulty.Debug:
        revealAmounts = [9, 0, 0, 0, 0];
        break;
    }

    const randomNumbers = shuffleArray(
      Array.from({ length: 9 }, (_, i) => i + 1)
    );
    let randomSelections: Set<number> = new Set<number>();
    let boxNumber = 0;
    let traversed = 0;
    for (let index = 0; index < 5; ++index) {
      const amount = revealAmounts[index];
      const revealAmount = 5 - index;
      for (let j = 0; j < amount; ++j) {
        boxNumber = randomNumbers[traversed] - 1;
        traversed++;
        const box_column = (boxNumber % 3) * 3;
        const box_row = Math.floor(boxNumber / 3) * 3;
        randomSelectionFromBox(
          box_row,
          box_column,
          revealAmount,
          randomSelections
        );
      }
    }
    return randomSelections;
  }

  import(state: Sudoku) {
    this.board = state.board;
    this.revealed = state.revealed;
    this.notes = state.notes;
    this.showWrong = state.showWrong;
    this.difficulty = state.difficulty;
    this.lives = state.lives;
    this.amountOfBoxesLeft = state.amountOfBoxesLeft;
    this.valueToAmountLeft = state.valueToAmountLeft;
    this.highlightedNumbers = state.highlightedNumbers;
    this.highlightedBoxes = state.highlightedBoxes;
    this.selectedBoxNum = state.selectedBoxNum;
  }
}
