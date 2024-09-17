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
  return (
    <div className="sudoku-count-table">
      {Object.keys(valueToAmountObj).map((value, index) => (
        <div key={value} className="sudoku-count">
          <div
            className="clickable-number"
            onClick={() => onClickNum(Number(value))}
          >
            {Number(value)}
          </div>
          <div className="count">{valueToAmountObj[Number(value)]}</div>
        </div>
      ))}
    </div>
  );
};

export default SudokuCountTable;
