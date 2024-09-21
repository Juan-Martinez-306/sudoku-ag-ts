import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SudokuGamePage from "./pages/SudokuGamePage";
import SudokuStats from "./components/SudokuStats";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/sudokuBoard/:difficulty/:seed"
          element={<SudokuGamePage />}
        />
        <Route path="/stats" element={<SudokuStats />} />
      </Routes>
    </Router>
  );
};

export default App;
