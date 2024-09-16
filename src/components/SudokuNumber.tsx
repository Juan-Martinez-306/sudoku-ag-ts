import React from "react";
import "../SudokuCountTable.css";

interface SudokuCountTableProps {
  valueToAmountObj: { [key: number]: number };
}

const SudokuCountTable: React.FC<SudokuCountTableProps> = ({
  valueToAmountObj,
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
            <td>{Number(value)}</td>
            <td>{valueToAmountObj[Number(value)]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SudokuCountTable;
