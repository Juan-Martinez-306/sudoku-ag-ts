import React, { useState, useEffect } from "react";
import { Sudoku } from "../utility/Sudoku";
import "../SudokuBox.css";
import "../SudokuBoard.css";
import { stringify } from "querystring";

interface SudokuBoxProps {
  isSelected: boolean;
  onClick: () => void;
  sudokuObj: Sudoku;
  boxNum: number;
  noteMode: boolean;
}

const SudokuBox: React.FC<SudokuBoxProps> = ({
  isSelected,
  onClick,
  sudokuObj,
  boxNum,
  noteMode,
}) => {
  const [notes, setNotes] = useState<Set<string>>(new Set());
  const [filledIn, setFilled] = useState<string | null>(null);
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // only accept numerical key presses
      if (event.key >= "1" && event.key <= "9") {
        if (noteMode) {
          setNotes((prevNotes) => {
            const newSet = new Set(prevNotes);
            if (newSet.has(event.key)) {
              newSet.delete(event.key);
              sudokuObj.notes[JSON.stringify(boxNum)].delete(event.key);
            } else {
              newSet.add(event.key);
              sudokuObj.notes[JSON.stringify(boxNum)].add(event.key);
            }
            return newSet;
          });
        } else {
          // FILL IN NUMBER OR ERASE FILL IN NUMBER
          // clear
          setNotes(new Set());
          sudokuObj.notes[JSON.stringify(boxNum)] = new Set<String>();
          if (
            String(sudokuObj.board[Math.floor(boxNum / 9)][boxNum % 9]) ===
            event.key
          ) {
            alert("RIGHT ONE!");
            setFilled(event.key);
            sudokuObj.filledIn[JSON.stringify(boxNum)] = event.key;
          } else {
            alert("WRONG ONE");
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isSelected, notes, noteMode]);

  if (JSON.stringify(boxNum) in sudokuObj.notes !== true) {
    sudokuObj.notes[JSON.stringify(boxNum)] = new Set<String>();
  }
  if (JSON.stringify(boxNum) in sudokuObj.filledIn !== true) {
    sudokuObj.filledIn[JSON.stringify(boxNum)] = "";
  }
  let noteSet = sudokuObj.notes[JSON.stringify(boxNum)];
  let clsName = "";
  if (sudokuObj.filledIn[JSON.stringify(boxNum)] === "") {
    clsName = "sudoku-box";
  } else {
    clsName = "sudoku-cell";
  }
  const showNotes = (noteMode && filledIn === null) || noteSet.size > 0;
  return (
    <button
      className={`${clsName} ${isSelected ? "active" : ""}`}
      onClick={onClick}
    >
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
        <div className="sudoku-number">
          {sudokuObj.filledIn[JSON.stringify(boxNum)]}
        </div>
      )}
    </button>
  );
};

export default SudokuBox;
