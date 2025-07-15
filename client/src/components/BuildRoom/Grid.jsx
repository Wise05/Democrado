import * as Tone from "tone";

function Grid({ grid, setGrid, numSteps, notes, noteLength, trackSegment, state }) {
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

  const colorMap = ["bg-teal-500", "bg-green-600", "bg-purple-600", "bg-orange-600"];

  const synth = new Tone.Synth().toDestination();

  // add note to grid
  const addNote = (row, col) => {
    // make sure that the segment state is not 0
    if (state == 0) return null

    let numCells = lengthToCells(noteLength);

    synth.triggerAttackRelease(notes[row], "8n");

    const newGrid = [...grid];

    // clear notes that would overlap
    for (let i = 0; i < numCells && i + col < numSteps; i++) {
      if (col + i < numSteps && grid[row][col + i] != null) {
        let len = grid[row][col + i].length;
        for (let j = 0; j < len; j++) {
          newGrid[row][col + i + j] = null;
        }
      }
    }

    let ajusted = numCells;
    if (col + numCells > numSteps)
      ajusted = numSteps - col;
    newGrid[row][col] = { note: notes[row], length: ajusted };

    setGrid(newGrid);
  }

  // remove note to grid
  const removeNote = (row, col) => {
    const newGrid = [...grid];

    newGrid[row][col] = null;

    setGrid(newGrid);
  }

  // Calculate how much to scale cell divs based on the note they represent
  // This is all just kinda whatever works and looks good, no real logic
  const calcScaleValue = (startCol, size) => {
    let measureGapSize = 0.6;
    let noteGapSize = 0.3;
    const endCol = startCol + size;
    let measureGaps = 0;
    let noteGaps = 0;
    let scale = size;

    if (size == 1) return 1;

    if (startCol % 4 == 0 && (size == 16 || size == 8)) noteGapSize = 0.45;

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
    <>
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
            ${cell ? colorMap[trackSegment["track"]] : "bg-neutral-700"}
          `}
                  style={cell ? { transform: `scaleX(${calcScaleValue(colIndex, cell.length)})` } : {}}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default Grid
