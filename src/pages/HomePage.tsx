import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sudoku, createSeed } from "../utility/Sudoku";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [seed, setSeed] = useState<string>("");
  const generateGameURL = () => {
    const sudokuDiff =
      difficulty === "easy" ? 0 : difficulty === "medium" ? 1 : 2;
    const sudokuState = new Sudoku(sudokuDiff);
    sudokuState.initializeSudokuFromScratch();
    let seedPath = seed;
    if (!seed) {
      seedPath = createSeed(sudokuState.board, sudokuState.revealed);
    }
    return `/sudokuBoard/${difficulty}/${seedPath}`;
  };

  return (
    <div className="home-page">
      <h1>Sudoku Game</h1>
      <div className="difficulty-selection">
        <label>
          Select Difficulty:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <p>(OPTIONAL): Import Seed</p>
          <input
            type="text"
            onChange={(e) => setSeed((e.target as HTMLInputElement).value)}
          />
        </label>
      </div>
      <Link to={generateGameURL()}>
        <button>Start Game</button>
      </Link>
      <br />
      <Link to="/stats">
        <button>Go to Stats</button>
      </Link>
    </div>
  );
};

export default HomePage;
