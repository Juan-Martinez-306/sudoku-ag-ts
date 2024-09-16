import React, { memo, useEffect, useState, useCallback } from "react";
import { Sudoku } from "../utility/Sudoku";
import SudokuBox from "./SudokuBox";
import "../SudokuBoard.css";
import SudokuCell from "./SudokuCell";
import SudokuCountTable from "./SudokuNumber";

export interface SudokuBoardProps {
  sudokuObj: Sudoku;
  setSudokuObj: React.Dispatch<React.SetStateAction<Sudoku>>;
}

const getBoxNum = (row: number, col: number) => {
  return row * 9 + col;
};

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  sudokuObj,
  setSudokuObj,
}) => {
  const [board] = useState<string[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(""))
  );
  const [selectedBox, setSelectedBox] = useState<number>(-1);
  const [noteMode, setNoteMode] = useState<boolean>(false);

  const shouldHighlightAsWrong = useCallback(
    (boxNum: number) => {
      return sudokuObj.showWrong.has(boxNum);
    },
    [sudokuObj]
  );

  const handleBoxClick = useCallback((boxNum: number) => {
    setSelectedBox((prevSelectedBox) =>
      prevSelectedBox === boxNum ? -1 : boxNum
    );
  }, []);

  const handleHighlight = useCallback(
    (sudokuValue: number, boxNum: number) => {
      if (sudokuValue < 0 || sudokuValue > 9) {
        console.log("INVALID VALUE");
        return;
      }
      const newSudokuObj = new Sudoku(sudokuObj.difficulty);
      Object.assign(newSudokuObj, sudokuObj);
      newSudokuObj.highlightedNumbers.clear();
      newSudokuObj.highlightedBoxes.clear();
      // CLICK ON A CELL ONLY
      if (sudokuValue !== 0) {
        newSudokuObj.highlightNumbersEqualToValue(sudokuValue);
      }
      // EVERY TIME WHEN NORMAL BOX ( NOT ON SIMPLE)
      if (boxNum >= 0 && boxNum < 81) {
        const row = Math.floor(boxNum / 9);
        const col = boxNum % 9;
        newSudokuObj.highlightBoxesAdjacentToBoxes(row, col);
      }
      setSudokuObj(newSudokuObj);
      handleBoxClick(boxNum);
    },
    [sudokuObj, setSudokuObj, handleBoxClick]
  );

  const higlightNumbers = useCallback(
    (sudokuValue: number) => {
      if (sudokuValue < 0 || sudokuValue > 9) {
        console.log("INVALID VALUE");
        return;
      }
      const newSudokuObj = new Sudoku(sudokuObj.difficulty);
      Object.assign(newSudokuObj, sudokuObj);
      newSudokuObj.highlightedNumbers.clear();
      newSudokuObj.highlightNumbersEqualToValue(sudokuValue);
      setSudokuObj(newSudokuObj);
    },
    [sudokuObj, setSudokuObj]
  );

  return (
    <div>
      <div className="sudoku-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((value, colIndex) => {
              const boxNum = getBoxNum(rowIndex, colIndex);
              const isRevealed = sudokuObj.revealed.has(boxNum);
              const isBoxHighlight = sudokuObj.highlightedBoxes.has(boxNum);
              const isNumHighlight = sudokuObj.highlightedNumbers.has(boxNum);
              const wrongValue = shouldHighlightAsWrong(boxNum);
              const isSelected = selectedBox === boxNum;
              const cell_value = sudokuObj.board[rowIndex][colIndex];

              return isRevealed ? (
                <SudokuCell
                  key={boxNum}
                  isSelected={isSelected}
                  cell_value={cell_value}
                  wrongValue={wrongValue}
                  boxNum={boxNum}
                  highlightFunction={handleHighlight}
                  isBoxHighlight={isBoxHighlight}
                  isNumHighlight={isNumHighlight}
                />
              ) : (
                <SudokuBox
                  key={boxNum}
                  isSelected={isSelected}
                  sudokuObj={sudokuObj}
                  setSudokuObj={setSudokuObj}
                  boxNum={boxNum}
                  highlightFunction={handleHighlight}
                  noteMode={noteMode}
                  isBoxHighlight={isBoxHighlight}
                  isNumHighlight={isNumHighlight}
                />
              );
            })}
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          setNoteMode(!noteMode);
        }}
      >
        Change Note Mode - {String(noteMode)}
      </button>
      <div>
        <span>{"Lives = " + String(sudokuObj.lives)}</span>
      </div>
      <div>
        <span>{"Values Left "}</span>
        <div className="horizontal-row">
          <SudokuCountTable valueToAmountObj={sudokuObj.valueToAmountLeft} />
        </div>
        <span>
          {"Total Values Left = " + String(sudokuObj.amountOfBoxesLeft)}
        </span>
      </div>
    </div>
  );
};

export default React.memo(SudokuBoard);
