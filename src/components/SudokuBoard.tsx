import React, { useState } from "react";
import { Sudoku, tupleEquals } from "../utility/Sudoku";
import SudokuBox from "./SudokuBox";
import "../SudokuBoard.css";
export interface SudokuBoardProps {
  sudokuObj: Sudoku;
  setSudokuObj: React.Dispatch<React.SetStateAction<Sudoku>>;
}

const rowsColsToBoxNum = (row: number, col: number) => {
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
    console.log("HERE");
    return sudokuObj.showWrong.has(boxNum);
  };

  const handleBoxClick = (row: number, col: number) => {
    if (selectedBox === rowsColsToBoxNum(row, col)) {
      setSelectedBox(-1);
    } else {
      setSelectedBox(rowsColsToBoxNum(row, col));
    }
  };
  return (
    <div>
      <div className="sudoku-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((value, colIndex) =>
              sudokuObj.revealed.find((tuple) =>
                tupleEquals(tuple, [rowIndex, colIndex])
              ) ? (
                <div
                  key={colIndex}
                  className={`sudoku-cell ${
                    shouldHighlightAsWrong(rowsColsToBoxNum(rowIndex, colIndex))
                      ? "wrong-highlight"
                      : ""
                  }`}
                >
                  {sudokuObj.board[rowIndex][colIndex]}
                </div>
              ) : (
                <SudokuBox
                  key={rowsColsToBoxNum(rowIndex, colIndex)}
                  isSelected={
                    selectedBox === rowsColsToBoxNum(rowIndex, colIndex)
                  }
                  onClick={() => handleBoxClick(rowIndex, colIndex)}
                  sudokuObj={sudokuObj}
                  setSudokuObj={setSudokuObj}
                  boxNum={rowsColsToBoxNum(rowIndex, colIndex)}
                  noteMode={noteMode}
                />
              )
            )}
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
    </div>
  );
};

export default SudokuBoard;
