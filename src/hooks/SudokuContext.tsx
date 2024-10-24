import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Sudoku, SudokuDifficulty } from "../utility/Sudoku";
import {
  clearContinueGame,
  getContinueSudokuBoard,
} from "../utility/ContinueSudokuBoard";

interface SudokuContextProps {
  sudoku: Sudoku;
  setSudoku: React.Dispatch<React.SetStateAction<Sudoku>>;
  handleHighlightNumbers: (value: number) => void;
  handleHighlightBoxes: (row: number, col: number) => void;
  clearHighlights: () => void;
  handleNoteAtBoxNum: (boxNum: number, note: string) => void;
  handleWrongGuess: (boxNum: number, value: string) => void;
  removeLife: () => void;
}

const SudokuContext = createContext<SudokuContextProps | undefined>(undefined);

interface SudokuProviderProps {
  difficulty: SudokuDifficulty;
  children: React.ReactNode;
  seed?: string;
  isContinued?: boolean;
}

export const SudokuProvider: React.FC<SudokuProviderProps> = ({
  children,
  difficulty,
  seed,
  isContinued,
}) => {
  const [sudoku, setSudoku] = useState(() => {
    const sudokuObject = new Sudoku(difficulty);
    if (isContinued) {
      const continueBoard = getContinueSudokuBoard();
      console.log("IMPORTED CONTINUE BOARD", continueBoard);
      if (continueBoard) {
        sudokuObject.import(continueBoard);
        console.log("RETURNING THIS BOARD", sudokuObject);
        return sudokuObject;
      } else {
        console.log("ERROR: No continue board found");
        clearContinueGame();
      }
    }
    if (seed) {
      sudokuObject.initializeSudokuFromSeed(seed);
    } else {
      sudokuObject.initializeSudokuFromScratch();
    }
    return sudokuObject;
  });

  useEffect(() => {
    const sudokuObject = new Sudoku(difficulty);
    if (seed && !isContinued) {
      sudokuObject.initializeSudokuFromSeed(seed);
    } else if (!isContinued) {
      sudokuObject.initializeSudokuFromScratch();
    } else if (isContinued) {
      const continueBoard = getContinueSudokuBoard();
      if (continueBoard) {
        sudokuObject.import(continueBoard);
      }
    }
    setSudoku(sudokuObject);
  }, [difficulty, seed]);

  const handleHighlightNumbers = useCallback(
    (value: number) => {
      const newSudoku = Object.assign(new Sudoku(sudoku.difficulty), sudoku);

      newSudoku.highlightedNumbers.clear();
      newSudoku.highlightNumbersEqualToValue(value);
      setSudoku(newSudoku);
    },
    [sudoku]
  );

  const handleHighlightBoxes = useCallback(
    (row: number, col: number) => {
      const newSudoku = Object.assign(new Sudoku(sudoku.difficulty), sudoku);
      newSudoku.selectedBoxNum = row * 9 + col;
      newSudoku.highlightedBoxes.clear();
      newSudoku.highlightBoxesAdjacentToBoxes(row, col);
      setSudoku(newSudoku);
    },
    [sudoku]
  );

  const clearHighlights = useCallback(() => {
    const newSudoku = Object.assign(new Sudoku(sudoku.difficulty), sudoku);
    newSudoku.highlightedBoxes.clear();
    newSudoku.highlightedNumbers.clear();
    setSudoku(newSudoku);
  }, []);
  const handleNoteAtBoxNum = useCallback(
    (boxNum: number, note: string) => {
      const newSudoku = Object.assign(new Sudoku(sudoku.difficulty), sudoku);
      newSudoku.handleNoteAtBoxNum(boxNum, note);
      setSudoku(newSudoku);
    },
    [sudoku]
  );

  const handleWrongGuess = useCallback(
    (boxNum: number, value: string) => {
      const newSudoku = Object.assign(new Sudoku(sudoku.difficulty), sudoku);
      newSudoku.handleWrongGuess(boxNum, value);
      setSudoku(newSudoku);
    },
    [sudoku]
  );

  const removeLife = useCallback(() => {
    const newSudoku = Object.assign(new Sudoku(sudoku.difficulty), sudoku);
    newSudoku.removeLife();
    setSudoku(newSudoku);
  }, [sudoku.lives]);

  return (
    <SudokuContext.Provider
      value={{
        sudoku,
        setSudoku,
        handleHighlightNumbers,
        handleHighlightBoxes,
        clearHighlights,
        handleNoteAtBoxNum,
        handleWrongGuess,
        removeLife,
      }}
    >
      {children}
    </SudokuContext.Provider>
  );
};

export const useSudoku = (): SudokuContextProps => {
  const context = useContext(SudokuContext);
  if (!context) {
    throw new Error("useSudoku must be used within a SudokuProvider");
  }
  return context;
};
