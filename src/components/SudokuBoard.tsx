import React, { useState } from "react";
import { Sudoku, tupleEquals } from "../utility/Sudoku";
import "../SudokuBoard.css";
export interface SudokuBoardProps {
  sudokuObj: Sudoku;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ sudokuObj }) => {
  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(""))
  );
  const [noteMode, setNoteMode] = useState<boolean>(false);
  const handleChange = (row: number, col: number, value: string) => {
    if (value === "0") {
      return;
    }
    if (!noteMode && sudokuObj.board[row][col] !== Number(value)) {
      alert("WRONG PLACE");
      return;
    } else if (!noteMode) {
      alert("CORRECT PLACE");
    }
    const newGrid = board.map((r, rowIndex) =>
      r.map((c, colIndex) => (rowIndex === row && colIndex === col ? value : c))
    );
    setBoard(newGrid);
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
                <input
                  key={colIndex}
                  type="text"
                  maxLength={noteMode ? 9 : 1}
                  value={value}
                  onChange={(e) =>
                    handleChange(rowIndex, colIndex, e.target.value)
                  }
                  className={`sudoku-cell ${noteMode ? "note-mode" : ""}`}
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
        Set Node Mode - {String(!noteMode)}
      </button>
    </div>
  );
};

export default SudokuBoard;
