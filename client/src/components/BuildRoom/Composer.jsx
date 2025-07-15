import { useState } from "react";
import Options from "./Options";
import Grid from "./Grid";
import TrackControl from "./TrackControl";
import { Link } from "react-router-dom";
// Make sure to add await Tone.start();

function Composer() {
  // number of tracks for 4 instruments total
  const numTracks = 4;

  // Number of grids that make up one track
  // Should be capped at like 16 prob
  const [numSegments, setNumSegments] = useState(4);

  const maxNumSegments = 16;

  // number of steps in grid. 64 means 4 bars with 16 steps (16th notes)
  const [numSteps, setNumSteps] = useState(64);

  // notes that can be played in the editor
  // changes with instrument selected
  const [notes, setNotes] = useState(["C6", "B5", "A#5", "A5", "G#5", "G5", "F#5", "F5", "E5", "D#5", "D5", "C#5", "C5", "B4", "A#4", "A4", "G#4", "G4", "F#4", "F4", "E4", "D#4", "D4", "C#4", "C4"]);

  const colorMap = ["text-teal-500", "text-green-600", "text-purple-600", "text-orange-600"];

  // Houses the entire song with all tracks
  // TODO: resizing from changing numSegments and time signature
  const [song, setSong] = useState(() =>
    Array.from({ length: numTracks }, () =>
      Array.from({ length: maxNumSegments }, () =>
        Array.from({ length: notes.length }, () =>
          Array(numSteps).fill(null)
        )
      )
    )
  );

  // the current grid being shown to the user
  // Track is one of the four instruments
  // Segment is one of the grids
  const [trackSegment, setTrackSegment] = useState({ "track": 0, "segment": 0 });

  // Length of note that will be placed when clicked
  // Uses tone.js notation
  const [noteLength, setNoteLength] = useState("8n");


  // Represents each grid with a number 
  // Allows for user to easily repeat segments
  const [segmentStates, setSegmentStates] = useState(() =>
    Array.from({ length: numTracks }, () =>
      Array(maxNumSegments).fill(0)
    )
  );

  // Takes one grid and applies it to the whole song structure
  // Also populates to segments that are the same
  const setGrid = (newGrid) => {
    setSong(prev => {
      const newSong = [...prev];
      newSong[trackSegment.track] = [...prev[trackSegment.track]];

      let segNum = segmentStates[trackSegment.track][trackSegment.segment];
      for (let i = 0; i < maxNumSegments; i++) {
        if (segmentStates[trackSegment.track][i] == segNum) {
          newSong[trackSegment.track][i] = newGrid;
        }
      }

      return newSong;
    })
  }

  const handleSegmentChange = (trackIndex, segmentIndex, change) => {
    // prevent going below 0
    if (segmentStates[trackIndex][segmentIndex] === 0 && change < 0) return;

    // Step 1: update segmentStates and extract new value
    const newSegStates = segmentStates.map(row => [...row]);
    newSegStates[trackIndex][segmentIndex] += change;
    const targetValue = newSegStates[trackIndex][segmentIndex];

    // Step 2: look for matching segment in the updated state
    let sameSeg = null;
    for (let i = 0; i < numTracks; i++) {
      for (let j = 0; j < maxNumSegments; j++) {
        if (i === trackIndex && j === segmentIndex) continue;
        if (newSegStates[i][j] === targetValue) {
          sameSeg = { track: i, segment: j };
          break;
        }
      }
      if (sameSeg) break;
    }

    // Step 3: determine the new grid to use
    let newGrid = null;
    if (sameSeg) {
      newGrid = song[sameSeg.track][sameSeg.segment].map(row => [...row]);
    } else {
      newGrid = Array.from({ length: notes.length }, () =>
        Array(numSteps).fill(null)
      );
    }

    // Step 4: apply to all matching segments in the same track
    const newSong = [...song];
    newSong[trackIndex] = [...song[trackIndex]];
    for (let i = 0; i < maxNumSegments; i++) {
      if (newSegStates[trackIndex][i] === targetValue) {
        newSong[trackIndex][i] = newGrid;
      }
    }

    // Final: set both states
    setSegmentStates(newSegStates);
    setSong(newSong);
  };

  return (
    <div className="relative bg-neutral-800 text-amber-100 min-h-screen px-6 font-mono">
      <div>

        {/* Title */}
        <h1 className="text-center text-3xl font-pixel text-orange-400">ChipVote Sandbox</h1>
      </div>
      <Link to="/" className="absolute top-1 left-6 font-pixel border border-amber-100 px-2">Home</Link>
      <div className="flex justify-center border border-amber-100 py-2">

        {/* grid */}
        <Grid grid={song[trackSegment.track][trackSegment.segment]} setGrid={setGrid} numSteps={numSteps} notes={notes} noteLength={noteLength} trackSegment={trackSegment} state={segmentStates[trackSegment.track][trackSegment.segment]} />

        {/* Options */}
        <Options noteLength={noteLength} setNoteLength={setNoteLength} grid={song[trackSegment.track][trackSegment.segment]} />
      </div>
      {/* Track control */}
      <div>
        <TrackControl numSegments={numSegments} colorMap={colorMap} trackSegment={trackSegment} setTrackSegment={setTrackSegment} segmentStates={segmentStates} setSegmentStates={setSegmentStates} handleSegmentChange={handleSegmentChange} />
      </div>
    </div >
  )
}

export default Composer;
