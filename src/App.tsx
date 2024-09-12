import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./overlay.css";
import SudokuBoard from "./components/SudokuBoard";
import { Sudoku, SudokuDifficulty } from "./utility/Sudoku";

function App() {
  const [sudokuObj, setSodukuObj] = useState<Sudoku>(
    new Sudoku(SudokuDifficulty.Hard)
  );

  const continueGame = () => {
    const newSudokuObj = new Sudoku(sudokuObj.difficulty);
    Object.assign(newSudokuObj, sudokuObj);
    newSudokuObj.lives = 5 - newSudokuObj.difficulty * 2;
    setSodukuObj(newSudokuObj);
    setGameOver(false);
  };

  const revealBoard = () => {
    const newSudokuObj = new Sudoku(sudokuObj.difficulty);
    Object.assign(newSudokuObj, sudokuObj);
    newSudokuObj.revealed = [];
    for (let i = 0; i < 9; ++i) {
      for (let k = 0; k < 9; ++k) {
        newSudokuObj.revealed.push([i, k]);
      }
    }
    setSodukuObj(newSudokuObj);
    setGameOver(false);
  };
  const [gameOver, setGameOver] = useState<boolean>(false);
  return (
    <div className="App">
      {gameOver && (
        <div className="overlay">
          <div className="overlay-content">
            <h1>You Lost!</h1>
            <button onClick={() => window.location.reload()}>Restart</button>
            <button onClick={continueGame}>Continue</button>
            <button onClick={revealBoard}>Reveal Board</button>
          </div>
        </div>
      )}
      <SudokuBoard
        sudokuObj={sudokuObj}
        setSudokuObj={setSodukuObj}
        setGameOver={setGameOver}
      />
    </div>
  );
}

export default App;
