import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import SudokuBoard from "./components/SudokuBoard";
import { Sudoku, SudokuDifficulty } from "./utility/Sudoku";

function App() {
  const [sudokuObj, setSodukuObj] = useState<Sudoku>(
    new Sudoku(SudokuDifficulty.Easy)
  );
  return (
    <div className="App">
      <SudokuBoard sudokuObj={sudokuObj} setSudokuObj={setSodukuObj} />
    </div>
  );
}

export default App;
