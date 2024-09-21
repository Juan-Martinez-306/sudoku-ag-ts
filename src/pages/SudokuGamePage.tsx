import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import SudokuBoard from "../components/SudokuBoard";
import { SudokuProvider, useSudoku } from "../hooks/SudokuContext";
import { createSeed, Sudoku } from "../utility/Sudoku";
import "./SudokuGame.css";
import SudokuControls from "../components/SudokuControl";
import SudokuCountTable from "../components/SudokuNumber";
import {
  updateBestTime,
  updateContinues,
  updateLosses,
  updateWins,
} from "../utility/Stats";

interface RouteParams extends Record<string, string | undefined> {
  difficulty: string;
  seed?: string;
}

const SudokuGame: React.FC = () => {
  const { sudoku, setSudoku, handleHighlightNumbers } = useSudoku();
  const [seed] = useState(createSeed(sudoku.board, sudoku.revealed));

  const [noteMode, setNoteMode] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winScreen, setWinScreen] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const [showFullSeed, setShowFullSeed] = useState<boolean>(false);
  const [showCount, setShowCount] = useState<boolean>(false);

  useEffect(() => {
    if (seed) {
      const newSudoku = new Sudoku(sudoku.difficulty);
      newSudoku.initializeSudokuFromSeed(seed);
      setSudoku(newSudoku);
    }
  }, [seed]);

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
    updateContinues();
  };

  const revealBoard = () => {
    const newSudoku = new Sudoku(sudoku.difficulty);
    Object.assign(newSudoku, sudoku);
    newSudoku.highlightedBoxes.clear();
    newSudoku.amountOfBoxesLeft = 0;
    newSudoku.highlightedNumbers.clear();
    newSudoku.showWrong.clear();
    newSudoku.revealed = new Set<number>();
    for (let i = 0; i < 9; ++i) {
      for (let k = 0; k < 9; ++k) {
        newSudoku.revealed.add(i * 9 + k);
      }
    }
    setSudoku(newSudoku);
    setGameOver(false);
  };

  const onClickNumber = useCallback((value: number) => {
    handleHighlightNumbers(value);
  }, []);
  const onClickSeed = () => {
    setShowFullSeed(!showFullSeed);
  };
  useEffect(() => {
    if (sudoku.lives <= 0) {
      setGameOver(true);
      updateLosses();
    }
  }, [sudoku.lives]);

  // Check if game is over if so update local storage
  useEffect(() => {
    if (sudoku.amountOfBoxesLeft === 0 && sudoku.lives > 0) {
      setWinScreen(true);
      const difString =
        sudoku.difficulty === 0
          ? "easy"
          : sudoku.difficulty === 1
          ? "medium"
          : "hard";
      updateWins(difString);
      updateBestTime(difString, timerSeconds);
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
            <button onClick={() => window.location.reload()}>Go Again!</button>
          </div>
        </div>
      )}
      <header className="header">
        <h1>Sudoku Game</h1>
      </header>
      <main className="main-content">
        <SudokuBoard noteMode={noteMode} />
        <SudokuControls
          setNoteMode={setNoteMode}
          noteMode={noteMode}
          setShowCount={() => {
            setShowCount(!showCount);
          }}
          onClickSeed={onClickSeed}
          showFullSeed={showFullSeed}
        />
        {showFullSeed && (
          <div className="seed-box">
            <p>{seed ?? "empty"}</p>
            <button
              className={"copy-button"}
              onClick={() => {
                if (seed) {
                  navigator.clipboard.writeText(seed);
                }
              }}
            >
              Copy
            </button>
          </div>
        )}
        {showCount && (
          <div>
            <div className="horizontal-row">
              <SudokuCountTable
                valueToAmountObj={sudoku.valueToAmountLeft}
                onClickNum={onClickNumber}
              />
            </div>
            {/* <span>
              {"Total Values Left = " + String(sudoku.amountOfBoxesLeft)}
            </span> */}
          </div>
        )}
        <span>Time Elapsed: {timerDisplay}</span>
        <br />
      </main>
      <footer className="footer">
        <span>Sudoku Game © 2024</span>
      </footer>
    </div>
  );
};

const SudokuGamePage: React.FC = () => {
  //   const { seed } = useParams<{ seed: string }>();
  const { difficulty, seed } = useParams<RouteParams>();
  const difNum = difficulty === "easy" ? 0 : difficulty === "medium" ? 1 : 2;
  console.log(difficulty, "Difficulty");
  console.log(seed, "Seed");

  return (
    <SudokuProvider difficulty={difNum} seed={seed ?? undefined}>
      <SudokuGame />
    </SudokuProvider>
  );
};

export default SudokuGamePage;
