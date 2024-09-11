import React, { useState } from "react";
import { Sudoku, tupleEquals } from "../utility/Sudoku";
import SudokuBox from "./SudokuBox";
import "../SudokuBoard.css";
export interface SudokuBoardProps {
  sudokuObj: Sudoku;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ sudokuObj }) => {
  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(""))
  );
  const [selectedBox, setSelectedBox] = useState<number>(-1);
  const [noteMode, setNoteMode] = useState<boolean>(false);

  const handleBoxClick = (row: number, col: number) => {
    if (selectedBox === row * 9 + col) {
      setSelectedBox(-1);
    } else {
      setSelectedBox(row * 9 + col);
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
                <div key={colIndex} className="sudoku-cell">
                  {sudokuObj.board[rowIndex][colIndex]}
                </div>
              ) : (
                <SudokuBox
                  key={rowIndex * 9 + colIndex}
                  isSelected={selectedBox === rowIndex * 9 + colIndex}
                  onClick={() => handleBoxClick(rowIndex, colIndex)}
                  sudokuObj={sudokuObj}
                  boxNum={rowIndex * 9 + colIndex}
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
