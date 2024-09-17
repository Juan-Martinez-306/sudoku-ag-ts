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
    <table className="sudoku-count-table">
      <thead>
        <tr>
          <th>Number</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(valueToAmountObj).map((value, index) => (
          <tr key={value} className={index % 2 === 0 ? "active-row" : ""}>
            <td onClick={() => onClickNum(Number(value))}>{Number(value)}</td>
            <td>{valueToAmountObj[Number(value)]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SudokuCountTable;
