import React, { memo, useEffect, useState } from "react";
import { Sudoku } from "../utility/Sudoku";
import SudokuBox from "./SudokuBox";
import "../SudokuBoard.css";
import SudokuCell from "./SudokuCell";
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
  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(""))
  );
  const [selectedBox, setSelectedBox] = useState<number>(-1);
  const [noteMode, setNoteMode] = useState<boolean>(false);

  const shouldHighlightAsWrong = (boxNum: number) => {
    //console.log("HERE");
    return sudokuObj.showWrong.has(boxNum);
  };

  const handleBoxClick = (boxNum: number) => {
    if (selectedBox === boxNum) {
      setSelectedBox(-1);
    } else {
      setSelectedBox(boxNum);
    }
  };

  const handleHighlight = (sudokuValue: number, boxNum: number) => {
    const newSudokuObj = new Sudoku(sudokuObj.difficulty);
    Object.assign(newSudokuObj, sudokuObj);
    newSudokuObj.highlightedNumbers.clear();
    newSudokuObj.highlightedBoxes.clear();
    if (sudokuValue < 0 || sudokuValue > 9) {
      console.log("INVALID VALUE");
      setSudokuObj(newSudokuObj);
      return;
    } else {
      // CLICK ON A CELL ONLY
      if (sudokuValue !== 0) {
        newSudokuObj.highlightNumbersEqualToValue(sudokuValue);
      }
      // EVERY TIME
      const row = Math.floor(boxNum / 9);
      const col = boxNum % 9;
      newSudokuObj.highlightBoxesAdjacentToBoxes(row, col);
      setSudokuObj(newSudokuObj);
      handleBoxClick(boxNum);
    }
  };
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
          {Array.from({ length: 9 }).map((_, index) => (
            <div>
              {String(index + 1) +
                ":" +
                String(sudokuObj.valueToAmountLeft[index + 1])}
            </div>
          ))}
        </div>
        <span>
          {"Total Values Left = " + String(sudokuObj.amountOfBoxesLeft)}
        </span>
      </div>
    </div>
  );
};

export default React.memo(SudokuBoard);
