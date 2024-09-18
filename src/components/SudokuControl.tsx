import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStickyNote,
  faHeart,
  faEye,
  faEyeSlash,
  faE,
} from "@fortawesome/free-solid-svg-icons";
import { useSudoku } from "../hooks/SudokuContext";

interface SudokuControlsProps {
  noteMode: boolean;
  setNoteMode: (noteMode: boolean) => void;
  setShowCount: () => void;
  onClickSeed: () => void;
  showFullSeed: boolean;
}

const SudokuControls: React.FC<SudokuControlsProps> = ({
  noteMode,
  setNoteMode,
  setShowCount,
  onClickSeed,
  showFullSeed,
}) => {
  const { sudoku } = useSudoku();

  return (
    <div className="horizontal-align">
      <button
        onClick={() => {
          setNoteMode(!noteMode);
        }}
        className="note-mode-button"
      >
        <FontAwesomeIcon icon={faStickyNote} />
        <span>{noteMode ? "Note Mode On" : "Note Mode Off"}</span>
      </button>
      <span onClick={onClickSeed} className="number-count-button">
        Seed:
        <FontAwesomeIcon
          icon={showFullSeed ? faEyeSlash : faEye}
          style={{ marginLeft: "5px" }}
        />
      </span>
      <button onClick={setShowCount} className="number-count-button">
        Show Number Counts
      </button>
      <div className="lives">
        <FontAwesomeIcon icon={faHeart} className="heart-icon" />
        <span>{sudoku.lives}</span>
      </div>
    </div>
  );
};

export default SudokuControls;
