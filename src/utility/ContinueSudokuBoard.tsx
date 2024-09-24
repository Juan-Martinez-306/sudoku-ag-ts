import { Sudoku } from "../utility/Sudoku";

interface ContinueSudokuBoard {
  board: number[][];
  revealed: Set<number>;
  notes: { [key: string]: Set<string> };
  showWrong: Set<number>;
  difficulty: number;
  lives: number;
  amountOfBoxesLeft: number;
  valueToAmountLeft: { [key: number]: number };
  highlightedNumbers: Set<number>;
  highlightedBoxes: Set<number>;
  selectedBoxNum: number;
}

export const getContinueSudokuBoard = (): Sudoku | null => {
  const board = localStorage.getItem("continueSudokuBoard");
  const continueBoard = board ? JSON.parse(board) : null;
  return continueBoard
    ? importSudokuFromContinueSudokuBoard(continueBoard!)
    : null;
};

export const setContinueSudokuBoard = (board: Sudoku) => {
  const continueBoard = saveSudokuIntoContinueSudokuBoard(board);
  localStorage.setItem("continueSudokuBoard", JSON.stringify(continueBoard));
};

export const clearContinueSudokuBoard = () => {
  localStorage.removeItem("continueSudokuBoard");
};

const saveSudokuIntoContinueSudokuBoard = (
  sudoku: Sudoku
): ContinueSudokuBoard => {
  return {
    board: sudoku.board,
    revealed: sudoku.revealed,
    notes: sudoku.notes,
    showWrong: sudoku.showWrong,
    difficulty: sudoku.difficulty,
    lives: sudoku.lives,
    amountOfBoxesLeft: sudoku.amountOfBoxesLeft,
    valueToAmountLeft: sudoku.valueToAmountLeft,
    highlightedNumbers: sudoku.highlightedNumbers,
    highlightedBoxes: sudoku.highlightedBoxes,
    selectedBoxNum: sudoku.selectedBoxNum,
  };
};

export const importSudokuFromContinueSudokuBoard = (
  board: ContinueSudokuBoard
): Sudoku => {
  const sudoku = new Sudoku(board.difficulty);
  sudoku.board = board.board;
  sudoku.revealed = board.revealed;
  sudoku.notes = board.notes;
  sudoku.showWrong = board.showWrong;
  sudoku.lives = board.lives;
  sudoku.amountOfBoxesLeft = board.amountOfBoxesLeft;
  sudoku.valueToAmountLeft = board.valueToAmountLeft;
  sudoku.highlightedNumbers = board.highlightedNumbers;
  sudoku.highlightedBoxes = board.highlightedBoxes;
  sudoku.selectedBoxNum = board.selectedBoxNum;
  return sudoku;
};
