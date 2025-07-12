import * as Tone from "tone";
import { useState, useEffect, useRef } from "react";

// Holds the music play button and music playback logic
function MusicPlay({ grid }) {
  // num cells to tone.js notation
  const lengthMap = {
    1: "16n",
    2: "8n",
    4: "4n",
    8: "2n",
    16: "1n"
  };

  // tells whether the music is played or paused
  const [playing, setPlaying] = useState(false);

  // used to keep the grid from restarting when note is added
  const gridRef = useRef(grid);
  const synthRef = useRef(null);

  // Keep gridRef current
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Play based on current grid
  useEffect(() => {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synthRef.current = synth;

    Tone.Transport.bpm.value = 120; // TODO: change later

    let currentStep = 0;

    const repeatId = Tone.Transport.scheduleRepeat((time) => {
      const currentGrid = gridRef.current;
      const numSteps = currentGrid[0].length;

      for (let row = 0; row < currentGrid.length; row++) {
        const cell = currentGrid[row][currentStep];
        if (cell) {
          const duration = lengthMap[cell.length] || "16n";
          synth.triggerAttackRelease(cell.note, duration, time);
        }
      }

      currentStep = (currentStep + 1) % numSteps;
    }, "16n");

    return () => {
      Tone.Transport.clear(repeatId);
    };
  }, []); // <-- only runs once

  // play or pause music
  const handleClick = async () => {
    await Tone.start();
    if (!playing) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      Tone.Transport.position = 0;
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={handleClick}
      className="w-25 flex justify-center items-center gap-1 h-7 px-1 border border-amber-100">
      {playing ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
      </svg> :
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
          <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
        </svg>
      }
      {playing ? ("Pause") : "Play"}
    </button>
  )
}

export default MusicPlay
