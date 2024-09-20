import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sudoku, createSeed } from "../utility/Sudoku";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string>("easy");
  const generateGameURL = () => {
    const sudokuDiff =
      difficulty === "easy" ? 0 : difficulty === "medium" ? 1 : 2;
    const sudokuState = new Sudoku(sudokuDiff);
    sudokuState.initializeSudokuFromScratch();
    const seedPath = createSeed(sudokuState.board, sudokuState.revealed);
    return `/sudokuBoard/seed?${seedPath}`;
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
        </label>
      </div>
      <Link to={generateGameURL()}>
        <button>Start Game</button>
      </Link>
    </div>
  );
};

export default HomePage;
