import * as Tone from "tone";
import { useState } from "react";
// Make sure to add await Tone.start();

function Composer() {
  // notes that can be played in the editor
  const notes = ["C5", "B#4", "B4", "A#4", "A4", "G4", "F#4", "F4", "E4", "D#4", "D4", "C#4", "C4"]
  // number of steps in page. 64 means 4 bars with 16 steps (16th notes)
  let numSteps = 64;

  // The grid keeps the state of the current page the user is editing.
  // each cell's first dimension is notes, the second is the step.
  // grid[note][step]
  // cell states: null = no note, {length: 3, first: true} note is 3 steps long and this is the first step in the note
  const [grid, setGrid] = useState(() =>
    Array.from({ length: notes.length }, () =>
      Array(numSteps).fill(null)
    )
  );

  // converts tone.js notation to number of cells in grid
  // e.g. 16n = 1 cell, 2n = 8 cells
  const lengthToCells = (noteLength) => {
    let num = noteLength.match(/\d+/);
    const map = {
      "16": "1",
      "8": "2",
      "4": "4",
      "2": "8",
      "1": "16"
    }
    return map[num];
  }

  // add note to grid
  const addNote = (row, col, noteLength = "16n") => {
    noteLength = lengthToCells(noteLength);

    setGrid(prev => {
      const newGrid = prev.map((r) => [...r]);

      // clear notes that would overlap
      for (let i = 0; i < noteLength; i++) {
        if (col + i < numSteps && prev[row][col + i] != null) {
          for (let j = 0; j < prev[row][col + i]; j++) {
            prev[row][col + i + j] = null;
          }
        }
      }

      newGrid[row][col] = { length: noteLength, first: true };
      for (let i = 1; i < noteLength; i++) {
        newGrid[row][col + i] = { length: noteLength, first: false };
      }

      return newGrid;
    });
  }

  // remove note to grid
  const removeNote = (row, col) => {
    setGrid(prev => {
      const newGrid = prev.map((r) => [...r]);

      while (prev[row][col].first == false) {
        col--;
      }

      for (let i = 0; i < prev[row][col].length; i++) {
        newGrid[row][col + i] = null;
      }

      return newGrid;
    });
  }

  return (
    <div className="bg-neutral-800 text-amber-100 h-min-screen p-6 font-mono">
      <div className="flex">
        {/* Grid note lables  */}
        <div>
          {notes.map((note, index) => (
            <div key={index} className="text-[0.5rem] w-5 h-3 my-0.25">{note[1] === "#" ? "" : note}</div>
          ))}
        </div>
        {/* Grid */}
        <div>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex my-0.25">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  onClick={() => {
                    grid[rowIndex][colIndex] == null ?
                      addNote(rowIndex, colIndex) : removeNote(rowIndex, colIndex)
                  }}
                  className={`
            w-3 h-3 m-0 cursor-pointer hover:bg-black ${cell ? "bg-blue-500" : "bg-white"}
            border border-white hover:border-blue-500 ${((colIndex) % 4 == 0) ? "border-l-black" : ""}
          `}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Composer;
