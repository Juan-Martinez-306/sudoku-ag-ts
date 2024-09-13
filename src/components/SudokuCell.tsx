import React, { useEffect, useState } from "react";
import "../SudokuBoard.css";

// Read Only so no set Sudoku
interface SudokuCellProps {
  isSelected: boolean;
  cell_value: number;
  wrongValue: boolean;
  boxNum: number;
  highlightFunction: (cv: number, bn: number) => void;
  isBoxHighlight: boolean;
  isNumHighlight: boolean;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  cell_value,
  wrongValue,
  isSelected,
  boxNum,
  highlightFunction,
  isBoxHighlight,
  isNumHighlight,
}) => {
  const classNames = [
    "sudoku-cell",
    isBoxHighlight && "box-highlight",
    wrongValue && "wrong-highlight",
    isNumHighlight && "num-highlight",
    isSelected && "active",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      key={boxNum}
      className={classNames}
      onClick={() => highlightFunction(cell_value, boxNum)}
    >
      {cell_value}
    </div>
  );
};

export default SudokuCell;
