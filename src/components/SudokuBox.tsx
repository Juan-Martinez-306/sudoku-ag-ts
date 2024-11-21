import React, { useEffect, useCallback } from "react";
import { useSudoku } from "../hooks/SudokuContext";
import "../SudokuBox.css";
import "../SudokuBoard.css";
import { Sudoku } from "../utility/Sudoku";

interface SudokuBoxProps {
  isSelected: boolean;
  boxNum: number;
  noteMode: boolean;
  onClickBox: (boxNum: number) => void;
  isBoxHighlight: boolean;
  isNumHighlight: boolean;
}

const SudokuBox: React.FC<SudokuBoxProps> = ({
  isSelected,
  boxNum,
  noteMode,
  onClickBox,
  isBoxHighlight,
  isNumHighlight,
}) => {
  const { sudoku, setSudoku } = useSudoku();

  useEffect(() => {
    sudoku.showWrong = new Set<number>();
  }, [isSelected]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key >= "1" && event.key <= "9") {
        const newSudoku = new Sudoku(sudoku.difficulty);
        Object.assign(newSudoku, sudoku);

        if (noteMode) {
          newSudoku.handleNoteAtBoxNum(boxNum, event.key);
        } else {
          newSudoku.notes[JSON.stringify(boxNum)] = new Set<string>();
          if (String(newSudoku.getElementAtBoxNum(boxNum)) === event.key) {
            //alert("RIGHT ONE!");
            newSudoku.addToRevealed(boxNum, event.key);
            newSudoku.highlightNumbersEqualToValue(Number(event.key));
            newSudoku.highlightBoxesAdjacentToBoxes(
              Math.floor(boxNum / 9),
              boxNum % 9
            );
          } else {
            //alert("WRONG ONE");
            newSudoku.handleWrongGuess(boxNum, event.key);
          }
        }

        setSudoku(newSudoku);
      }
    },
    [noteMode, sudoku, setSudoku, boxNum]
  );

  useEffect(() => {
    if (!isSelected) {
      return;
    }
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isSelected, handleKeyPress]);

  if (!(JSON.stringify(boxNum) in sudoku.notes)) {
    sudoku.notes[JSON.stringify(boxNum)] = new Set<string>();
  }
  const noteSet = sudoku.notes[JSON.stringify(boxNum)];
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
    <button className={classNames} onClick={() => onClickBox(boxNum)}>
      {showNotes ? (
        Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="sudoku-note">
            {noteSet.has(String(i + 1)) ? String(i + 1) : ""}
          </div>
        ))
      ) : (
        <div className="sudoku-number">{}</div>
      )}
    </button>
  );
};

export default React.memo(SudokuBox);
