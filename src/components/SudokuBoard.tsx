import React, { useEffect, useState } from "react";
import { Sudoku } from "../utility/Sudoku";
import SudokuBox from "./SudokuBox";
import "../SudokuBoard.css";
import SudokuCell from "./SudokuCell";
export interface SudokuBoardProps {
  sudokuObj: Sudoku;
  setSudokuObj: React.Dispatch<React.SetStateAction<Sudoku>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}

const getBoxNum = (row: number, col: number) => {
  return row * 9 + col;
};

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  sudokuObj,
  setSudokuObj,
  setGameOver,
}) => {
  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(""))
  );
  const [selectedBox, setSelectedBox] = useState<number>(-1);
  const [noteMode, setNoteMode] = useState<boolean>(false);

  const shouldHighlightAsWrong = (boxNum: number) => {
    console.log("HERE");
    return sudokuObj.showWrong.has(boxNum);
  };

  useEffect(() => {
    if (sudokuObj.lives <= 0) {
      setGameOver(true);
    }
  }, [sudokuObj.lives, setGameOver]);

  const handleBoxClick = (row: number, col: number) => {
    if (selectedBox === getBoxNum(row, col)) {
      setSelectedBox(-1);
    } else {
      setSelectedBox(getBoxNum(row, col));
    }
  };

  const handleHighlight = (sudokuValue: number, boxNum: number) => {
    const newSudokuObj = new Sudoku(sudokuObj.difficulty);
    Object.assign(newSudokuObj, sudokuObj);
    newSudokuObj.highlightedNumbers.clear();
    newSudokuObj.highlightedBoxes.clear();
    if (sudokuValue < 1 || sudokuValue > 9) {
      console.log("INVALID VALUE");
      setSudokuObj(newSudokuObj);
      return;
    } else {
      const row = Math.floor(boxNum / 9);
      const col = boxNum % 9;
      handleBoxClick(row, col);
      for (const boxN of sudokuObj.revealed) {
        if (sudokuObj.getElementAtBoxNum(boxN) === sudokuValue) {
          newSudokuObj.highlightedNumbers.add(boxN);
        }
      }
      for (let i = 0; i < 9; i++) {
        newSudokuObj.highlightedBoxes.add(row * 9 + i);
        newSudokuObj.highlightedBoxes.add(i * 9 + col);
      }
      const boxRow = 3 * Math.floor(row / 3);
      const boxColumn = 3 * Math.floor(col / 3);
      for (let i = boxRow; i < boxRow + 3; i++) {
        for (let k = boxColumn; k < boxColumn + 3; k++) {
          newSudokuObj.highlightedBoxes.add(i * 9 + k);
        }
      }
      newSudokuObj.highlightedBoxes.delete(boxNum);
      newSudokuObj.highlightedNumbers.delete(boxNum);
      setSudokuObj(newSudokuObj);
    }
  };
  return (
    <div>
      <div className="sudoku-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((value, colIndex) => {
              const boxNum = getBoxNum(rowIndex, colIndex);
              const isRevealed = sudokuObj.revealed.has(boxNum);
              const isBoxHighlight = sudokuObj.highlightedBoxes.has(boxNum);
              const isNumHighlight = sudokuObj.highlightedNumbers.has(boxNum);
              const wrongValue = shouldHighlightAsWrong(boxNum);
              const isSelected = selectedBox === boxNum;
              const cell_value = sudokuObj.board[rowIndex][colIndex];

              return isRevealed ? (
                <SudokuCell
                  key={boxNum}
                  isSelected={isSelected}
                  cell_value={cell_value}
                  wrongValue={wrongValue}
                  boxNum={boxNum}
                  highlightFunction={handleHighlight}
                  isBoxHighlight={isBoxHighlight}
                  isNumHighlight={isNumHighlight}
                />
              ) : (
                <SudokuBox
                  key={boxNum}
                  isSelected={isSelected}
                  onClick={() => handleBoxClick(rowIndex, colIndex)}
                  sudokuObj={sudokuObj}
                  setSudokuObj={setSudokuObj}
                  boxNum={boxNum}
                  noteMode={noteMode}
                  isBoxHighlight={isBoxHighlight}
                  isNumHighlight={isNumHighlight}
                />
              );
            })}
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          setNoteMode(!noteMode);
        }}
      >
        Change Note Mode - {String(noteMode)}
      </button>
      <div>
        <span>{"Lives = " + String(sudokuObj.lives)}</span>
      </div>
      <div>
        <span>{"Values Left "}</span>
        <div className="horizontal-row">
          {Array.from({ length: 9 }).map((_, index) => (
            <div>
              {String(index + 1) +
                ":" +
                String(sudokuObj.valueToAmountLeft[index + 1])}
            </div>
          ))}
        </div>
        <span>
          {"Total Values Left = " + String(sudokuObj.amountOfBoxesLeft)}
        </span>
      </div>
    </div>
  );
};

export default SudokuBoard;
