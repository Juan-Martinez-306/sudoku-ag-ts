import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import logo from "./logo.svg";
import "./App.css";
import "./overlay.css";
import SudokuBoard from "./components/SudokuBoard";
import { SudokuProvider, useSudoku } from "./hooks/SudokuContext";
import { createSeed, Sudoku, SudokuDifficulty } from "./utility/Sudoku";
import SudokuCountTable from "./components/SudokuNumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import SudokuControls from "./components/SudokuControl";

const AppContent: React.FC = () => {
  const { sudoku, setSudoku, handleHighlightNumbers } = useSudoku();
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [noteMode, setNoteMode] = useState<boolean>(false);
  const seed = createSeed(sudoku.board, sudoku.revealed);

  const [winScreen, setWinScreen] = useState<boolean>(false);
  const [showCount, setShowCount] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const [showFullSeed, setShowFullSeed] = useState<boolean>(false);

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
    if (sudoku.lives <= 0 && gameOver === false) {
      setGameOver(true);
    }
  }, [sudoku.lives]);

  useEffect(() => {
    if (sudoku.amountOfBoxesLeft === 0 && sudoku.lives > 0) {
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
            <p>{seed}</p>
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

const App: React.FC = () => {
  return (
    <SudokuProvider difficulty={SudokuDifficulty.Hard}>
      <AppContent />
    </SudokuProvider>
  );
};

export default App;
