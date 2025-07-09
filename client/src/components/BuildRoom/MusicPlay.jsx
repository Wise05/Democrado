import * as Tone from "tone";
import { useState, useEffect, useRef } from "react";

function MusicPlay({ grid }) {
  const lengthMap = {
    1: "16n",
    2: "8n",
    4: "4n",
    8: "2n",
    16: "1n"
  };

  const [playing, setPlaying] = useState(false);
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

    Tone.Transport.bpm.value = 120;

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
      className="flex justify-center items-center gap-1 h-7 px-1 border border-amber-100">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M15 6.75a.75.75 0 0 0-.75.75V18a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75H15ZM20.25 6.75a.75.75 0 0 0-.75.75V18c0 .414.336.75.75.75H21a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75h-.75ZM5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L5.055 7.061Z" />
      </svg>
      {playing ? "Pause" : "Play"}
    </button>
  )
}

export default MusicPlay
