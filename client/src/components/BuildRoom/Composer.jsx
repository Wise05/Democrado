import * as Tone from "tone";
import { useState } from "react";
import Options from "./Options"
import { Link } from "react-router-dom";
// Make sure to add await Tone.start();

function Composer() {
  // notes that can be played in the editor
  const notes = ["C6", "B5", "A#5", "A5", "G#5", "G5", "F#5", "F5", "E5", "D#5", "D5", "C#5", "C5", "B4", "A#4", "A4", "G#4", "G4", "F#4", "F4", "E4", "D#4", "D4", "C#4", "C4"]
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

  const [noteLength, setNoteLength] = useState("8n");

  // converts tone.js notation to number of cells in grid
  // e.g. 16n = 1 cell, 2n = 8 cells
  const lengthToCells = (length = noteLength) => {
    let num = length.match(/\d+/);
    const map = {
      "16": 1,
      "8": 2,
      "4": 4,
      "2": 8,
      "1": 16
    }
    return map[num];
  }

  const cellsToLength = (cells) => {
    const map = {
      1: "16n",
      2: "8n",
      4: "4n",
      8: "2n",
      16: "1n",
    }
    return map[cells];
  }

  const synth = new Tone.Synth().toDestination();
  // add note to grid
  const addNote = (row, col) => {
    let numCells = lengthToCells(noteLength);

    synth.triggerAttackRelease(notes[row], "8n");

    setGrid(prev => {
      const newGrid = prev.map((r) => [...r]);

      // clear notes that would overlap
      for (let i = 0; i < numCells && i + col < numSteps; i++) {
        if (col + i < numSteps && prev[row][col + i] != null) {
          let len = lengthToCells(prev[row][col + i]);
          for (let j = 0; j < len; j++) {
            newGrid[row][col + i + j] = null;
          }
        }
      }

      let ajusted = noteLength;
      if (col + numCells > numSteps)
        ajusted = cellsToLength(numSteps - col);
      newGrid[row][col] = ajusted;

      return newGrid;
    });
  }

  // remove note to grid
  const removeNote = (row, col) => {
    setGrid(prev => {
      const newGrid = prev.map((r) => [...r]);

      newGrid[row][col] = null;

      return newGrid;
    });
  }

  //add .25 for measures, add .125 for notes
  const calcScaleValue = (startCol, size) => {
    let measureGapSize = 0.6;
    let noteGapSize = 0.3;
    const base = lengthToCells(size);
    const endCol = startCol + base;
    let measureGaps = 0;
    let noteGaps = 0;
    let scale = base;

    if (base == 1) return 1;

    if (startCol % 4 == 0 && (base == 16 || base == 8)) noteGapSize = 0.45;

    // Count gaps that the note will cross over (not including the starting position)
    for (let i = startCol + 1; i < endCol; i++) {
      if (i % 16 == 0) {
        measureGaps += 1;
      }
      else if (i % 4 == 0) {
        noteGaps += 1;
      }
    }

    scale += (measureGaps * measureGapSize) + (noteGaps * noteGapSize);
    return scale;
  }

  return (
    <div className="relative bg-neutral-800 text-amber-100 min-h-screen px-6 font-mono">
      <div>
        <h1 className="text-center text-3xl font-pixel text-orange-400">ChipVote Sandbox</h1>
      </div>
      <Link to="/" className="absolute top-1 left-6 font-pixel border border-amber-100 px-2">Home</Link>
      <div className="flex justify-center border border-amber-100 py-2">
        {/* Grid note lables  */}
        <div>
          {notes.map((note, index) => (
            <div key={index} className="text-[0.75rem] w-4 h-4 my-0.5 font-bold">{note[1] === "#" ? "" : note}</div>
          ))}
        </div>
        {/* Grid */}
        <div>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex my-0.5">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`relative w-4 h-4 border-l-1 border-l-neutral-800
                    ${((colIndex) % 4 == 0) ? "ml-0.5" : ""}
                    ${((colIndex % 16) == 0) ? "ml-1" : ""}
                  `}>
                  <div
                    onMouseDown={() => {
                      grid[rowIndex][colIndex] == null ?
                        addNote(rowIndex, colIndex) : removeNote(rowIndex, colIndex)
                    }}
                    className={`
            absolute left-0 w-full h-full cursor-pointer hover:border-3 hover:border-green-600 hover:z-2
            ${cell ? `origin-left z-3` : ""}
            ${cell ? "bg-amber-100" : "bg-neutral-700"}
          `}
                    style={cell ? { transform: `scaleX(${calcScaleValue(colIndex, cell)})` } : {}}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <Options noteLength={noteLength} setNoteLength={setNoteLength} grid={grid} />
      </div>
    </div >
  )
}

export default Composer;
