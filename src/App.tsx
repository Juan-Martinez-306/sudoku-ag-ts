import React from "react";
import logo from "./logo.svg";
import "./App.css";
import SudokuBoard from "./components/SudokuBoard";
import { Sudoku } from "./utility/Sudoku";

function App() {
  const sudokuObj = new Sudoku(0);
  return (
    <div className="App">
      <SudokuBoard sudokuObj={sudokuObj} />
    </div>
  );
}

export default App;
