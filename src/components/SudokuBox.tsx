import React, { useState, useEffect } from "react";
import { Sudoku } from "../utility/Sudoku";
import "../SudokuBox.css";
import "../SudokuBoard.css";
import { stringify } from "querystring";
import { BreakfastDiningOutlined } from "@mui/icons-material";

interface SudokuBoxProps {
  isSelected: boolean;
  onClick: () => void;
  sudokuObj: Sudoku;
  setSudokuObj: React.Dispatch<React.SetStateAction<Sudoku>>;
  boxNum: number;
  noteMode: boolean;
}

const SudokuBox: React.FC<SudokuBoxProps> = ({
  isSelected,
  onClick,
  sudokuObj,
  setSudokuObj,
  boxNum,
  noteMode,
}) => {
  const [notes, setNotes] = useState<Set<string>>(new Set());
  // const [filledIn, setFilled] = useState<string | null>(null);
  useEffect(() => {
    if (!isSelected) {
      sudokuObj.showWrong = new Set<number>();
      return;
    }
    const handleKeyPress = (event: KeyboardEvent) => {
      // only accept numerical key presses
      if (event.key >= "1" && event.key <= "9") {
        const newSudokuObj = new Sudoku(sudokuObj.difficulty);
        Object.assign(newSudokuObj, sudokuObj);

        if (noteMode) {
          setNotes((prevNotes) => {
            const newSet = new Set(prevNotes);
            if (newSet.has(event.key)) {
              newSet.delete(event.key);
              newSudokuObj.notes[JSON.stringify(boxNum)].delete(event.key);
            } else {
              newSet.add(event.key);
              newSudokuObj.notes[JSON.stringify(boxNum)].add(event.key);
            }
            setSudokuObj(newSudokuObj);
            return newSet;
          });
        } else {
          // FILL IN NUMBER OR ERASE FILL IN NUMBER
          // clear
          setNotes(new Set());
          newSudokuObj.notes[JSON.stringify(boxNum)] = new Set<String>();
          const row = Math.floor(boxNum / 9);
          const col = boxNum % 9;
          if (String(newSudokuObj.board[row][col]) === event.key) {
            alert("RIGHT ONE!");
            newSudokuObj.revealed.add(boxNum);
            newSudokuObj.valueToAmountLeft[Number(event.key)] -= 1;
            newSudokuObj.amountOfBoxesLeft--;
          } else {
            alert("WRONG ONE");
            newSudokuObj.removeLife();
            for (let i = 0; i < 9; ++i) {
              if (String(newSudokuObj.board[row][i]) === event.key) {
                newSudokuObj.showWrong.add(row * 9 + i);
              }
              if (String(newSudokuObj.board[i][col]) === event.key) {
                newSudokuObj.showWrong.add(i * 9 + col);
              }
            }
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(row / 3) * 3;
            const foundInBox = false;
            for (let j = boxRow; j < boxRow + 3; ++j) {
              for (let k = boxCol; k < boxCol + 3; ++k) {
                if (String(newSudokuObj.board[j][k]) === event.key) {
                  newSudokuObj.showWrong.add(j * 9 + k);
                }
              }
              if (foundInBox) {
                break;
              }
            }
          }
        }
        setSudokuObj(newSudokuObj);
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isSelected, notes, noteMode, sudokuObj, setSudokuObj, boxNum]);

  if (JSON.stringify(boxNum) in sudokuObj.notes !== true) {
    sudokuObj.notes[JSON.stringify(boxNum)] = new Set<String>();
  }
  let noteSet = sudokuObj.notes[JSON.stringify(boxNum)];
  const clsName = "sudoku-box";
  const showNotes = noteMode || noteSet.size > 0;
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
        <div className="sudoku-number ">{}</div>
      )}
    </button>
  );
};

export default SudokuBox;
