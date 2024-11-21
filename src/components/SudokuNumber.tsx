import React from "react";
import "../SudokuCountTable.css";

interface SudokuCountTableProps {
  valueToAmountObj: { [key: number]: number };
  onClickNum: (value: number) => void;
}

const SudokuCountTable: React.FC<SudokuCountTableProps> = ({
  valueToAmountObj,
  onClickNum,
}) => {
  const entries = Object.entries(valueToAmountObj);

  return (
    <div className="sudoku-count-table-container">
      <label className="sudoku-count-table-label">Sudoku Count Table</label>
      <div className="sudoku-count-table">
        {entries.map(([value, count]) => {
          if (count === 0) return null;
          return (
            <div key={value} className="sudoku-count">
              <div
                className="clickable-number"
                onClick={() => onClickNum(Number(value))}
              >
                {Number(value)}
              </div>
              <div className="count">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SudokuCountTable;
