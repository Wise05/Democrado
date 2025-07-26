import * as Tone from "tone";
import { useState, useEffect, useRef } from "react";

// Holds the music play button and music playback logic
function MusicPlay({ song, segmentStates, instruments, beginning, setBeginning, tempo, volume, currentStep, setCurrentStep, setCurrentSegment, playing, setPlaying }) {
  // num cells to tone.js notation
  const lengthMap = {
    1: "16n",
    2: "8n",
    4: "4n",
    8: "2n",
    16: "1n"
  };

  // refs to keep current values
  const songRef = useRef(song);
  const segmentStatesRef = useRef(segmentStates);
  const synthsRef = useRef([]);
  const kickRef = useRef(null);
  const snareRef = useRef(null);
  const hihatRef = useRef(null);
  const sequenceRef = useRef(null);
  const pausePositionRef = useRef(0);

  // Keep songRef current
  useEffect(() => {
    songRef.current = song;
  }, [song]);

  // Keep segmentStates current
  useEffect(() => {
    segmentStatesRef.current = segmentStates;
  }, [segmentStates]);

  // Helper function to get active segments (segments with any value > 0 in segmentStates)
  const getActiveSegments = () => {
    const activeSegments = [];
    const maxSegments = Math.max(...segmentStatesRef.current.map(trackStates => trackStates.length));

    for (let segIndex = 0; segIndex < maxSegments; segIndex++) {
      // Check if any track has a value > 0 for this segment
      const hasActiveTrack = segmentStatesRef.current.some(trackStates =>
        segIndex < trackStates.length && trackStates[segIndex] > 0
      );

      if (hasActiveTrack) {
        activeSegments.push(segIndex);
      }
    }

    // If no active segments, default to segment 0
    return activeSegments.length > 0 ? activeSegments : [0];
  };

  // Initialize synths 
  useEffect(() => {
    if (synthsRef.current.length === 0) {
      instruments.forEach((inst) => {
        if (inst.name === "Drums") {
          if (inst.kick) kickRef.current = new Tone[inst.kick.type](Tone[inst.kick.synth], inst.kick.options).toDestination();
          if (inst.snare) snareRef.current = new Tone.Sampler(inst.snare.options).toDestination();
          if (inst.hihat) hihatRef.current = new Tone.Sampler(inst.hihat.options).toDestination();
        } else {
          const VoiceClass = Tone[inst.synth];
          const PolyClass = Tone[inst.type];
          const synth = new PolyClass(VoiceClass, inst.options).toDestination();
          synthsRef.current.push(synth);
        }
      });
    }

    return () => {
      synthsRef.current.forEach(s => s.dispose());
      if (kickRef.current) kickRef.current.dispose();
      if (snareRef.current) snareRef.current.dispose();
      if (hihatRef.current) hihatRef.current.dispose();
      synthsRef.current = [];
      kickRef.current = null;
      snareRef.current = null;
      hihatRef.current = null;
    };
  }, []);

  useEffect(() => {
    const applyVolume = () => {
      if (typeof volume === 'number') {
        Tone.Destination.volume.value = volume;
        if (volume === -20) {
          Tone.Destination.mute = true;
        } else {
          Tone.Destination.mute = false;
        }
      } else {
        console.warn('Volume prop is not a number:', volume);
      }
    };

    if (Tone.context.state === 'running' || Tone.context.state === 'suspended') {
      applyVolume();
    } else {
      const handleContextStateChange = () => {
        if (Tone.context.state === 'running' || Tone.context.state === 'suspended') {
          applyVolume();
          Tone.context.removeListener('statechange', handleContextStateChange);
        }
      };
      Tone.context.on('statechange', handleContextStateChange);

      return () => {
        Tone.context.removeListener('statechange', handleContextStateChange);
      };
    }
  }, [volume]);

  // make the sequence
  useEffect(() => {
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }

    Tone.Transport.bpm.value = tempo;

    const getTotalSteps = () => {
      const activeSegments = getActiveSegments();
      const stepsPerSegment = songRef.current[0][0][0].length || 64;
      return activeSegments.length * stepsPerSegment;
    };

    sequenceRef.current = new Tone.Sequence((time, step) => {
      const activeSegments = getActiveSegments();
      const stepsPerSegment = songRef.current[0][0][0].length || 64;

      // Calculate which active segment we're in and the step within that segment
      const activeSegmentIndex = Math.floor(step / stepsPerSegment) % activeSegments.length;
      const actualSegmentIndex = activeSegments[activeSegmentIndex];
      const stepInSegment = step % stepsPerSegment;

      setCurrentStep(step);
      setCurrentSegment(actualSegmentIndex);

      const currentSong = songRef.current;

      // Only play tracks that have segmentStates > 0 for this segment
      for (let track = 0; track < currentSong.length; track++) {
        // Check if this track should be active for this segment
        const trackStates = segmentStatesRef.current[track];
        const shouldPlayTrack = trackStates &&
          actualSegmentIndex < trackStates.length &&
          trackStates[actualSegmentIndex] > 0;

        if (!shouldPlayTrack) continue;
        if (actualSegmentIndex >= currentSong[track].length) continue;

        const segment = currentSong[track][actualSegmentIndex];

        for (let row = 0; row < segment.length; row++) {
          const cell = segment[row][stepInSegment];
          if (cell) {
            const duration = lengthMap[cell.length] || "16n";

            if (instruments[track].name === "Drums") {
              if (row === 0 && snareRef.current?.loaded) {
                snareRef.current.triggerAttackRelease("C2", duration, time);
              } else if (row === 1 && hihatRef.current?.loaded) {
                hihatRef.current.triggerAttackRelease("C2", duration, time);
              } else if (kickRef.current) {
                kickRef.current.triggerAttackRelease("C2", duration, time);
              }
            } else {
              const synth = synthsRef.current[track];
              if (synth) synth.triggerAttackRelease(cell.note, duration, time);
            }
          }
        }
      }
    }, Array.from({ length: getTotalSteps() }, (_, i) => i), "16n");

    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
    };
  }, [tempo, segmentStates]); // Added segmentStates as dependency

  // play or pause music
  const handleClick = async () => {
    await Tone.start();

    if (!playing) {
      Tone.Transport.start();
      if (sequenceRef.current) {
        // Resume from the saved pause position or start from beginning if reset
        const startStep = beginning ? 0 : pausePositionRef.current;
        sequenceRef.current.start(0, startStep);
        setCurrentStep(startStep);

        // Calculate the actual segment based on active segments
        const activeSegments = getActiveSegments();
        const stepsPerSegment = songRef.current[0][0][0].length || 64;
        const activeSegmentIndex = Math.floor(startStep / stepsPerSegment) % activeSegments.length;
        const actualSegmentIndex = activeSegments[activeSegmentIndex];
        setCurrentSegment(actualSegmentIndex);
      }
    } else {
      // Save the current position before stopping
      pausePositionRef.current = currentStep;
      Tone.Transport.stop();
      if (sequenceRef.current) {
        sequenceRef.current.stop();
      }
      if (beginning) {
        // Reset position only if beginning is true
        pausePositionRef.current = 0;
        setCurrentStep(0);
        const activeSegments = getActiveSegments();
        setCurrentSegment(activeSegments[0] || 0);
        setBeginning(false);
      }
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
