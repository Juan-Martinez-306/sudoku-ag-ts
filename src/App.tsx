import React, { useEffect, useMemo, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./overlay.css";
import SudokuBoard from "./components/SudokuBoard";
import { Sudoku, SudokuDifficulty } from "./utility/Sudoku";

function App() {
  const [sudokuObj, setSodukuObj] = useState<Sudoku>(
    new Sudoku(SudokuDifficulty.Easy)
  );
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Start  timer
    timerRef.current = window.setInterval(() => {
      setTimerSeconds((prevTime) => prevTime + 1);
    }, 1000);

    // clear after done
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const timerDisplay = useMemo(() => {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, [timerSeconds]);

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
    newSudokuObj.revealed = new Set<number>();
    for (let i = 0; i < 9; ++i) {
      for (let k = 0; k < 9; ++k) {
        newSudokuObj.revealed.add(i * 9 + k);
      }
    }
    setSodukuObj(newSudokuObj);
    setGameOver(false);
  };

  useEffect(() => {
    if (sudokuObj.lives <= 0) {
      setGameOver(true);
    }
  }, [sudokuObj.lives, setGameOver]);
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
      <span>Time Elasped: {timerDisplay}</span>
    </div>
  );
}

export default App;
