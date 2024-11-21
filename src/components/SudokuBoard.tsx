import React, { memo, useEffect, useState, useCallback } from "react";
import SudokuBox from "./SudokuBox";
import "../SudokuBoard.css";
import SudokuCell from "./SudokuCell";
import { useSudoku } from "../hooks/SudokuContext";

export interface SudokuBoardProps {
  noteMode: boolean;
}

const getBoxNum = (row: number, col: number) => {
  return row * 9 + col;
};

const SudokuBoard: React.FC<SudokuBoardProps> = ({ noteMode }) => {
  const {
    sudoku,
    handleHighlightNumbers,
    handleHighlightBoxes,
    clearHighlights,
    deselectBox,
  } = useSudoku();

  function shouldHighlightAsWrong(boxNum: number) {
    return sudoku.showWrong.has(boxNum);
  }

  const onClickBox = useCallback(
    (boxNum: number) => {
      if (sudoku.selectedBoxNum === boxNum) {
        deselectBox();
      } else {
        clearHighlights();
        handleHighlightBoxes(Math.floor(boxNum / 9), boxNum % 9);
      }
    },
    [clearHighlights, handleHighlightBoxes]
  );

  const onClickCell = useCallback(
    (cellValue: number, boxNum: number) => {
      if (sudoku.selectedBoxNum === boxNum) {
        deselectBox();
      } else {
        clearHighlights();
        // HAVE HIGHLIGHT NUMBERS FIRST BECAUSE OTHERWISE IT WONT REGISTER THE SELECTED BOX FROM HIGHLIGHETED BOXES
        // WHY? BECAUSE THE SELECTED BOX IS SET IN THE HIGHLIGHTED BOXES FUNCTION AND SET ASYNC USING SETSUDOKU
        // WHICH MEANS THAT THE SELECTED BOX IS NOT SET UNTIL THE NEXT RENDER AND THUS HIGHLIGHT NUMBERS WILL ESSENTIALLY GET
        // PRERENDER VALUE AND REWRITE SETSUDOKU WITH PRERENDER VALUE
        handleHighlightNumbers(cellValue);
        handleHighlightBoxes(Math.floor(boxNum / 9), boxNum % 9);
      }
    },
    [clearHighlights, handleHighlightBoxes, handleHighlightNumbers]
  );

  return (
    <div>
      <div className="sudoku-grid">
        {sudoku.board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((_, colIndex) => {
              const boxNum = getBoxNum(rowIndex, colIndex);
              const isRevealed = sudoku.revealed.has(boxNum);
              const isBoxHighlight = sudoku.highlightedBoxes.has(boxNum);
              const isNumHighlight = sudoku.highlightedNumbers.has(boxNum);
              const wrongValue = shouldHighlightAsWrong(boxNum);
              const isSelected = sudoku.selectedBoxNum === boxNum;
              const cell_value = sudoku.board[rowIndex][colIndex];

              return isRevealed ? (
                <SudokuCell
                  key={`cell-${boxNum}`}
                  isSelected={isSelected}
                  cell_value={cell_value}
                  wrongValue={wrongValue}
                  boxNum={boxNum}
                  onClickCell={onClickCell}
                  isBoxHighlight={isBoxHighlight}
                  isNumHighlight={isNumHighlight}
                />
              ) : (
                <SudokuBox
                  key={`box-${boxNum}`}
                  isSelected={isSelected}
                  boxNum={boxNum}
                  onClickBox={onClickBox}
                  noteMode={noteMode}
                  isBoxHighlight={isBoxHighlight}
                  isNumHighlight={isNumHighlight}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(SudokuBoard);
