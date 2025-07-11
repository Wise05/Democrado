import { useState } from "react";
import Options from "./Options";
import Grid from "./Grid";
import { Link } from "react-router-dom";
// Make sure to add await Tone.start();

function Composer() {
  const numTracks = 4;
  // No more than 16
  const [numSegments, setNumSegments] = useState(4);
  // number of steps in page. 64 means 4 bars with 16 steps (16th notes)
  const [numSteps, setNumSteps] = useState(64);
  // notes that can be played in the editor
  const [notes, setNotes] = useState(["C6", "B5", "A#5", "A5", "G#5", "G5", "F#5", "F5", "E5", "D#5", "D5", "C#5", "C5", "B4", "A#4", "A4", "G#4", "G4", "F#4", "F4", "E4", "D#4", "D4", "C#4", "C4"]);

  // Houses the entire song with all tracks
  // TODO: resizing from changing numSegments and time signature
  const [song, setSong] = useState(() =>
    Array.from({ length: numTracks }, () =>
      Array.from({ length: numSegments }, () =>
        Array.from({ length: notes.length }, () =>
          Array(numSteps).fill(null)
        )
      )
    )
  );

  // the current grid being shown to the user
  // Track is one of the four instruments
  // Segment is one of the grids
  const [trackSegment, setGridDim] = useState({ track: 0, segment: 0 });

  const setGrid = (newGrid) => {
    setSong(prev => {
      const newSong = [...prev];
      newSong[trackSegment.track] = [...prev[trackSegment.track]];
      newSong[trackSegment.track][trackSegment.segment] = newGrid;

      return newSong;
    })
  }

  const [noteLength, setNoteLength] = useState("8n");

  return (
    <div className="relative bg-neutral-800 text-amber-100 min-h-screen px-6 font-mono">
      <div>

        {/* Title */}
        <h1 className="text-center text-3xl font-pixel text-orange-400">ChipVote Sandbox</h1>
      </div>
      <Link to="/" className="absolute top-1 left-6 font-pixel border border-amber-100 px-2">Home</Link>
      <div className="flex justify-center border border-amber-100 py-2">

        {/* grid */}
        <Grid grid={song[trackSegment.track][trackSegment.segment]} setGrid={setGrid} numSteps={numSteps} notes={notes} noteLength={noteLength} />

        {/* Options */}
        <Options noteLength={noteLength} setNoteLength={setNoteLength} grid={song[trackSegment.track][trackSegment.segment]} />
      </div>
    </div >
  )
}

export default Composer;
