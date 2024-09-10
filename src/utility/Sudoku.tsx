import { Map } from "typescript";
type NumToNumMap = {
  [key: number]: number;
};

export type tuple = [number, number];
export function tupleEquals(a: tuple, b: tuple): boolean {
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

function randomSelectionFromBox(
  boxRow: number,
  boxColumn: number,
  randomAmount: number,
  randomSelection: tuple[]
) {
  let randomRow: number;
  let randomCol: number;
  let randomCordinate: tuple;
  for (let i = 0; i < randomAmount; ++i) {
    do {
      randomRow = shuffleArray([boxRow, boxRow + 1, boxRow + 2])[0];
      randomCol = shuffleArray([boxColumn, boxColumn + 1, boxColumn + 2])[0];
      randomCordinate = [randomRow, randomCol];
    } while (
      // eslint-disable-next-line no-loop-func
      randomSelection.find((tuple) => tupleEquals(tuple, randomCordinate))
    );
    randomSelection.push(randomCordinate);
  }
}

export enum SudokuDifficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
}

export class Sudoku {
  board: number[][];
  revealed: tuple[];
  filledIn: NumToNumMap;
  difficulty: SudokuDifficulty;

  constructor(diffuculty: SudokuDifficulty) {
    this.board = generateSudoku();
    this.difficulty = diffuculty;
    this.revealed = this.randomRevealed();
    this.filledIn = {};
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
    }

    const randomNumbers = shuffleArray(
      Array.from({ length: 9 }, (_, i) => i + 1)
    );
    let randomSelections: tuple[] = [];
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
}
