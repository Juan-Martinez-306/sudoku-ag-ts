import React, { useState, useEffect } from "react";
import { Sudoku } from "../utility/Sudoku";
import "../SudokuBox.css";
import "../SudokuBoard.css";

interface SudokuBoxProps {
  isSelected: boolean;
  sudokuObj: Sudoku;
  setSudokuObj: React.Dispatch<React.SetStateAction<Sudoku>>;
  boxNum: number;
  highlightFunction: (cv: number, bn: number) => void;
  noteMode: boolean;
  isBoxHighlight: boolean;
  isNumHighlight: boolean;
}

const SudokuBox: React.FC<SudokuBoxProps> = ({
  isSelected,
  sudokuObj,
  setSudokuObj,
  boxNum,
  highlightFunction,
  noteMode,
  isBoxHighlight,
  isNumHighlight,
}) => {
  // const [filledIn, setFilled] = useState<string | null>(null);
  useEffect(() => {
    sudokuObj.showWrong = new Set<number>();
  }, [isSelected]);

  useEffect(() => {
    if (!isSelected) {
      return;
    }
    const handleKeyPress = (event: KeyboardEvent) => {
      // only accept numerical key presses
      if (event.key >= "1" && event.key <= "9") {
        const newSudokuObj = new Sudoku(sudokuObj.difficulty);
        Object.assign(newSudokuObj, sudokuObj);

        if (noteMode) {
          newSudokuObj.handleNoteAtBoxNum(boxNum, event.key);
        } else {
          // FILL IN NUMBER OR ERASE FILL IN NUMBER
          // clear
          newSudokuObj.notes[JSON.stringify(boxNum)] = new Set<String>();
          if (String(newSudokuObj.getElementAtBoxNum(boxNum)) === event.key) {
            alert("RIGHT ONE!");
            newSudokuObj.addToRevealed(boxNum, event.key);
          } else {
            alert("WRONG ONE");
            newSudokuObj.handleWrongGuess(boxNum, event.key);
          }
        }

        setSudokuObj(newSudokuObj);
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isSelected, noteMode, sudokuObj, setSudokuObj, boxNum]);

  //noteMode, sudokuObj, setSudokuObj, boxNum
  if (JSON.stringify(boxNum) in sudokuObj.notes !== true) {
    sudokuObj.notes[JSON.stringify(boxNum)] = new Set<String>();
  }
  const noteSet = sudokuObj.notes[JSON.stringify(boxNum)];
  const classNames = [
    "sudoku-box",
    isBoxHighlight && "box-highlight",
    isSelected && "active",
    isNumHighlight && "num-highlight",
  ]
    .filter(Boolean)
    .join(" ");
  const showNotes = noteMode || noteSet.size > 0;
  return (
    <button className={classNames} onClick={() => highlightFunction(0, boxNum)}>
      {" "}
      {showNotes ? (
        Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="sudoku-note">
            {sudokuObj.notes[JSON.stringify(boxNum)].has(String(i + 1))
              ? String(i + 1)
              : ""}
          </div>
        ))
      ) : (
        <div className="sudoku-number ">{}</div>
      )}
    </button>
  );
};

export default React.memo(SudokuBox);
