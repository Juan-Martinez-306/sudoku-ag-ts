import React, { useEffect, useMemo, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./overlay.css";
import SudokuBoard from "./components/SudokuBoard";
import { SudokuProvider, useSudoku } from "./hooks/SudokuContext";
import { Sudoku, SudokuDifficulty } from "./utility/Sudoku";

const AppContent: React.FC = () => {
  const { sudoku, setSudoku } = useSudoku();
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winScreen, setWinScreen] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Start timer
    timerRef.current = window.setInterval(() => {
      setTimerSeconds((prevTime) => prevTime + 1);
    }, 1000);

    // Clear after done
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
    const newSudoku = new Sudoku(sudoku.difficulty);
    Object.assign(newSudoku, sudoku);
    newSudoku.lives = 5 - newSudoku.difficulty * 2;
    setSudoku(newSudoku);
    setGameOver(false);
  };

  const revealBoard = () => {
    const newSudoku = new Sudoku(sudoku.difficulty);
    Object.assign(newSudoku, sudoku);
    newSudoku.revealed = new Set<number>();
    for (let i = 0; i < 9; ++i) {
      for (let k = 0; k < 9; ++k) {
        newSudoku.revealed.add(i * 9 + k);
      }
    }
    setSudoku(newSudoku);
    setGameOver(false);
  };

  useEffect(() => {
    if (sudoku.lives <= 0) {
      setGameOver(true);
    }
  }, [sudoku.lives]);

  useEffect(() => {
    if (sudoku.amountOfBoxesLeft === 0) {
      setWinScreen(true);
    }
  }, [sudoku.amountOfBoxesLeft]);

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
      {winScreen && (
        <div className="overlay">
          <div className="overlay-content">
            <h1>You Won!</h1>
          </div>
        </div>
      )}
      <SudokuBoard />
      <span>Time Elapsed: {timerDisplay}</span>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SudokuProvider difficulty={SudokuDifficulty.Debug}>
      <AppContent />
    </SudokuProvider>
  );
};

export default App;
