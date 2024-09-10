import React, { useState, useEffect } from "react";
import "../SudokuBox.css";
import "../SudokuBoard.css";

interface SudokuBoxProps {
  isSelected: boolean;
  onClick: () => void;
}

const SudokuBox: React.FC<SudokuBoxProps> = ({ isSelected, onClick }) => {
  const [keysPressed, setKeyPressed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isSelected) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // only accept numerical key presses
      if (event.key >= "1" && event.key <= "9") {
        setKeyPressed((prevKeysPressed) => {
          const newSet = new Set(prevKeysPressed);
          if (newSet.has(event.key)) {
            newSet.delete(event.key);
          } else {
            newSet.add(event.key);
          }
          return newSet;
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isSelected, keysPressed]);

  const clsName: string = "sudoku-box";
  return (
    <button
      className={`${clsName} ${isSelected ? "active" : ""}`}
      onClick={onClick}
    >
      {" "}
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="sudoku-item">
          {keysPressed.has(String(i + 1)) ? String(i + 1) : ""}
        </div>
      ))}
    </button>
  );
};

export default SudokuBox;
