// Definition of functions to save and load the current sudoku board state to local storage.

import { Sudoku } from "../utility/Sudoku";

interface ContinueSudokuBoard {
  board: number[][];
  revealed: string;
  notes: string;
  showWrong: string;
  difficulty: number;
  lives: number;
  amountOfBoxesLeft: number;
  valueToAmountLeft: { [key: number]: number };
  highlightedNumbers: string;
  highlightedBoxes: string;
  selectedBoxNum: number;
}

export const getContinueSudokuBoard = (): Sudoku | null => {
  const board = localStorage.getItem("continueSudokuBoard");
  const continueBoard = board ? JSON.parse(board) : null;
  return continueBoard
    ? importSudokuFromContinueSudokuBoard(continueBoard!)
    : null;
};

export const setContinueGame = (
  board: Sudoku,
  timeSeconds: number,
  initalSeed: string
) => {
  setContinueSudokuBoard(board);
  setGameVariables(timeSeconds, initalSeed);
};

const setContinueSudokuBoard = (board: Sudoku) => {
  console.log("board", board);
  const continueBoard = saveSudokuIntoContinueSudokuBoard(board);
  console.log("continueBoard", continueBoard);
  console.log("string continueBoard", JSON.stringify(continueBoard));
  localStorage.setItem("continueSudokuBoard", JSON.stringify(continueBoard));
};

const setGameVariables = (timeSeconds: number, initialSeed: string) => {
  localStorage.setItem("continueTime", String(timeSeconds));
  localStorage.setItem("continueSeed", initialSeed);
};

export const clearContinueGame = () => {
  localStorage.removeItem("continueSudokuBoard");
  localStorage.removeItem("continueTime");
  localStorage.removeItem("continueSeed");
};

const saveSudokuIntoContinueSudokuBoard = (
  sudoku: Sudoku
): ContinueSudokuBoard => {
  const replacer = (key: string, value: any) => {
    if (value instanceof Set) {
      return [...value];
    }
    return value;
  };
  const continueBoard: ContinueSudokuBoard = {
    board: sudoku.board,
    revealed: JSON.stringify(Array.from(sudoku.revealed)),
    notes: JSON.stringify(sudoku.notes, replacer),
    showWrong: JSON.stringify(Array.from(sudoku.showWrong)),
    difficulty: sudoku.difficulty,
    lives: sudoku.lives,
    amountOfBoxesLeft: sudoku.amountOfBoxesLeft,
    valueToAmountLeft: sudoku.valueToAmountLeft,
    highlightedNumbers: JSON.stringify(Array.from(sudoku.highlightedNumbers)),
    highlightedBoxes: JSON.stringify(Array.from(sudoku.highlightedBoxes)),
    selectedBoxNum: sudoku.selectedBoxNum,
  };
  return continueBoard;
};

export const importSudokuFromContinueSudokuBoard = (
  board: ContinueSudokuBoard
): Sudoku => {
  const convertToSets = (obj: { [key: string]: any[] }) => {
    let result: { [key: string]: Set<string> } = {};

    for (const key in obj) {
      result[key] = new Set<string>(obj[key]);
    }
    return result;
  };
  const sudoku = new Sudoku(board.difficulty);
  sudoku.board = board.board;
  sudoku.revealed = new Set<number>(JSON.parse(board.revealed));
  sudoku.notes = convertToSets(JSON.parse(board.notes));
  sudoku.showWrong = new Set<number>(JSON.parse(board.showWrong));
  sudoku.lives = board.lives;
  sudoku.amountOfBoxesLeft = board.amountOfBoxesLeft;
  sudoku.valueToAmountLeft = board.valueToAmountLeft;
  sudoku.highlightedNumbers = new Set<number>(
    JSON.parse(board.highlightedNumbers)
  );
  sudoku.highlightedBoxes = new Set<number>(JSON.parse(board.highlightedBoxes));
  sudoku.selectedBoxNum = board.selectedBoxNum;
  return sudoku;
};
