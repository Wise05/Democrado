import { useState, useEffect } from "react";
import Options from "./Options";
import Grid from "./Grid";
import TrackControl from "./TrackControl";
import { Link } from "react-router-dom";
import instrumentData from "./instruments.json";
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

  const instruments = instrumentData;

  const colorMap = ["text-teal-400", "text-sky-700", "text-purple-600", "text-orange-600"];

  // Houses the entire song with all tracks
  // TODO: resizing from changing numSegments and time signature
  const [song, setSong] = useState([]);

  useEffect(() => {
    if (instruments.length > 0) {
      const initialSong = instruments.map(instrument =>
        Array.from({ length: maxNumSegments }, () =>
          Array.from({ length: instrument.numNotes }, () =>
            Array(numSteps).fill(null)
          )
        )
      );
      setSong(initialSong);
    }
  }, [instruments, maxNumSegments, numSteps]);

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

  // scale that will be highlighted in the grid
  const [scale, setScale] = useState("C Major");

  const [tempo, setTempo] = useState(120);

  // playing and position in the song used for playback and animation
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(0);

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
    for (let j = 0; j < maxNumSegments; j++) {
      if (j === segmentIndex) continue;
      if (newSegStates[trackIndex][j] === targetValue) {
        sameSeg = { "track": trackIndex, "segment": j };
        break;
      }
    }

    // Step 3: determine the new grid to use
    let newGrid = null;
    if (sameSeg) {
      newGrid = song[sameSeg.track][sameSeg.segment].map(row => [...row]);
    } else {
      newGrid = Array.from({ length: instruments[trackIndex].numNotes }, () =>
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

  const handleStartAudio = async () => {
    await Tone.start();
    console.log("Audio context started");
  };

  if (song.length === 0 || !song[trackSegment.track]) {
    return (
      <div className="relative bg-neutral-800 text-amber-100 min-h-screen px-6 font-mono">
        <p className="text-center text-xl">Loading song data...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-neutral-800 text-amber-100 min-h-screen px-6 font-mono">
      <div>

        {/* Title */}
        <h1 className="text-center text-3xl font-pixel text-orange-400">ChipVote Sandbox</h1>
      </div>
      <Link to="/" className="absolute top-1 left-6 font-pixel border border-amber-100 px-2">Home</Link>
      <div className="flex justify-center border border-amber-100 py-2">

        {/* grid */}
        <Grid grid={song[trackSegment.track][trackSegment.segment]} setGrid={setGrid} numSteps={numSteps} instruments={instruments} noteLength={noteLength} trackSegment={trackSegment} state={segmentStates[trackSegment.track][trackSegment.segment]} scale={scale} currentStep={currentStep} playing={playing} tempo={tempo} />

        {/* Options */}
        <Options noteLength={noteLength} setNoteLength={setNoteLength} song={song} segmentStates={segmentStates} instruments={instruments} scale={scale} setScale={setScale} currentStep={currentStep} setCurrentStep={setCurrentStep} setCurrentSegment={setCurrentSegment} playing={playing} setPlaying={setPlaying} tempo={tempo} setTempo={setTempo} />
      </div>
      {/* Track control */}
      <div>
        <TrackControl numSegments={numSegments} colorMap={colorMap} trackSegment={trackSegment} setTrackSegment={setTrackSegment} segmentStates={segmentStates} setSegmentStates={setSegmentStates} handleSegmentChange={handleSegmentChange} currentSegment={currentSegment} playing={playing} />
      </div>
    </div >
  )
}

export default Composer;
