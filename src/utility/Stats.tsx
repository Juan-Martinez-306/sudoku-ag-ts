interface SudokuStats {
  wins: { easy: number; medium: number; hard: number };
  bestTime: { easy: number | null; medium: number | null; hard: number | null };
  totalWins: number;
  losses: number;
  continues: number;
}

export const getStats = (): SudokuStats => {
  const stats = localStorage.getItem("sudokuStats");
  return stats
    ? JSON.parse(stats)
    : {
        wins: { easy: 0, medium: 0, hard: 0 },
        bestTime: { easy: null, medium: null, hard: null },
        totalWins: 0,
        losses: 0,
        continues: 0,
      };
};

const setStats = (stats: SudokuStats) => {
  localStorage.setItem("sudokuStats", JSON.stringify(stats));
};

export const updateWins = (difficulty: "easy" | "medium" | "hard") => {
  const stats = getStats();
  stats.wins[difficulty]++;
  stats.totalWins++;
  setStats(stats);
};

export const updateLosses = () => {
  const stats = getStats();
  stats.losses++;
  setStats(stats);
};

export const updateContinues = () => {
  const stats = getStats();
  stats.continues++;
  setStats(stats);
};

export const updateBestTime = (
  difficulty: "easy" | "medium" | "hard",
  time: number
) => {
  const stats = getStats();

  // Empty or better time
  if (
    stats.bestTime[difficulty] === null ||
    time < stats.bestTime[difficulty]!
  ) {
    stats.bestTime[difficulty] = time;
  }
  setStats(stats);
};
