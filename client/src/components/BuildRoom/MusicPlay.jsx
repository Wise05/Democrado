import * as Tone from "tone";
import { useState, useEffect, useRef } from "react";

// Holds the music play button and music playback logic
function MusicPlay({ song, segmentStates, onStepChange, onSegmentChange }) {
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
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(0);

  // refs to keep current values
  const songRef = useRef(song);
  const segmentStatesRef = useRef(segmentStates);
  const synthsRef = useRef([]);
  const sequenceRef = useRef(null);

  // Keep songRef current
  useEffect(() => {
    songRef.current = song;
  }, [song]);

  // Keep segment current
  useEffect(() => {
    segmentStatesRef.current = segmentStates;
  }, [segmentStates]);

  // Initialize synths once and keep them
  useEffect(() => {
    // Create synths only once
    synthsRef.current = [
      new Tone.PolySynth(Tone.Synth).toDestination(),
      new Tone.PolySynth(Tone.Synth).toDestination(),
      new Tone.PolySynth(Tone.Synth).toDestination(),
      new Tone.PolySynth(Tone.Synth).toDestination(),
    ];

    // Clean up synths on unmount
    return () => {
      synthsRef.current.forEach(synth => {
        synth.dispose();
      });
    };
  }, []); // Empty dependency array - only run once

  // Set up transport and sequence
  useEffect(() => {
    // Clean up previous sequence
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }

    Tone.Transport.bpm.value = 120;

    // Calculate total steps across all segments
    const getNumSegments = () => {
      return Math.max(...segmentStatesRef.current.map(trackStates => trackStates.length));
    };

    const getTotalSteps = () => {
      const numSegments = getNumSegments();
      const stepsPerSegment = songRef.current?.[0]?.[0]?.[0]?.length || 64;
      return numSegments * stepsPerSegment;
    };

    // Create sequence that plays all segments
    sequenceRef.current = new Tone.Sequence((time, step) => {
      setCurrentStep(step);

      const stepsPerSegment = songRef.current?.[0]?.[0]?.[0]?.length || 64;
      const numSegments = getNumSegments();

      // Calculate current segment and step within segment
      const segmentIndex = Math.floor(step / stepsPerSegment) % numSegments;
      const stepInSegment = step % stepsPerSegment;

      setCurrentSegment(segmentIndex);

      // Notify parent components of step and segment changes
      if (onStepChange) onStepChange(stepInSegment);
      if (onSegmentChange) onSegmentChange(segmentIndex);

      const currentSong = songRef.current;

      // Play notes for each track simultaneously
      for (let track = 0; track < currentSong.length; track++) {
        // Check if this segment exists for this track
        if (segmentIndex >= currentSong[track].length) continue;

        const segment = currentSong[track][segmentIndex];

        for (let row = 0; row < segment.length; row++) {
          const cell = segment[row][stepInSegment];
          if (cell && synthsRef.current[track]) {
            const duration = lengthMap[cell.length] || "16n";
            // Use the persistent synths
            synthsRef.current[track].triggerAttackRelease(cell.note, duration, time);
          }
        }
      }
    }, Array.from({ length: getTotalSteps() }, (_, i) => i), "16n");

    return () => {
      // Clean up sequence when dependencies change
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
    };
  }, [song, segmentStates, onStepChange, onSegmentChange]);

  // play or pause music
  const handleClick = async () => {
    await Tone.start();

    if (!playing) {
      Tone.Transport.start();
      if (sequenceRef.current) {
        sequenceRef.current.start();
      }
    } else {
      Tone.Transport.stop();
      if (sequenceRef.current) {
        sequenceRef.current.stop();
      }
      // Reset position
      setCurrentStep(0);
      setCurrentSegment(0);
    }
    setPlaying(!playing);
  };

  // Stop everything when component unmounts
  useEffect(() => {
    return () => {
      if (playing) {
        Tone.Transport.stop();
      }
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleClick}
        className="w-25 flex justify-center items-center gap-1 h-7 px-1 border border-amber-100">
        {playing ?
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
          </svg> :
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
          </svg>
        }
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}

export default MusicPlay;
