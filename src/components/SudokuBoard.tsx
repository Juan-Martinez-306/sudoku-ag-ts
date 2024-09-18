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
  } = useSudoku();
  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  function shouldHighlightAsWrong(boxNum: number) {
    return sudoku.showWrong.has(boxNum);
  }

  const onClickBox = useCallback(
    (boxNum: number) => {
      setSelectedBox(boxNum);
      clearHighlights();
      handleHighlightBoxes(Math.floor(boxNum / 9), boxNum % 9);
    },
    [clearHighlights, handleHighlightBoxes]
  );

  const onClickCell = useCallback(
    (cellValue: number, boxNum: number) => {
      setSelectedBox(boxNum);
      clearHighlights();
      handleHighlightBoxes(Math.floor(boxNum / 9), boxNum % 9);
      handleHighlightNumbers(cellValue);
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
              const isSelected = selectedBox === boxNum;
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
