import React, { useState } from "react";
import "../SudokuBoard.css";

const SudokuBoard: React.FC = () => {
  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(""))
  );

  const handleChange = (row: number, col: number, value: string) => {
    if (value === "0") {
      return;
    }
    const newGrid = board.map((r, rowIndex) =>
      r.map((c, colIndex) => (rowIndex === row && colIndex === col ? value : c))
    );
    setBoard(newGrid);
  };

  return (
    <div className="sudoku-grid">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((value, colIndex) => (
            <input
              key={colIndex}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              className="sudoku-cell"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;
