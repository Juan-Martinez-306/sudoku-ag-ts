import React, { Fragment } from "react";
import { getStats } from "../utility/Stats";
import "../SudokuStats.css";

const SudokuStats: React.FC = () => {
  const stats = getStats();
  return (
    <Fragment>
      <div className="sudoku-stats">
        <h1>My Stats</h1>
        <div className="stats-section">
          <h2>Win/Loss</h2>
          <p>
            Total Wins: <span className="stat-value">{stats.totalWins}</span>
          </p>
          <p>
            Total Losses: <span className="stat-value">{stats.losses}</span>
          </p>
        </div>
        <div className="stats-section">
          <h2>By Difficulty</h2>
          <div className="difficulty-stats">
            <div>
              <p>
                Wins (Easy):{" "}
                <span className="stat-value">{stats.wins["easy"]}</span>
              </p>
              <p>
                Wins (Medium):{" "}
                <span className="stat-value">{stats.wins["medium"]}</span>
              </p>
              <p>
                Wins (Hard):{" "}
                <span className="stat-value">{stats.wins["hard"]}</span>
              </p>
            </div>
            <div>
              <p>
                Best Time (Easy):{" "}
                <span className="stat-value">
                  {stats.bestTime["easy"] ?? "None"}
                </span>
              </p>
              <p>
                Best Time (Medium):{" "}
                <span className="stat-value">
                  {stats.bestTime["medium"] ?? "None"}
                </span>
              </p>
              <p>
                Best Time (Hard):{" "}
                <span className="stat-value">
                  {stats.bestTime["hard"] ?? "None"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="stats-section">
          <h2>Continues</h2>
          <p>
            Total Continues:{" "}
            <span className="stat-value">{stats.continues}</span>
          </p>
        </div>
      </div>
    </Fragment>
  );
};

export default SudokuStats;
