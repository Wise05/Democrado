import { useMemo, useRef, useEffect } from "react";
import * as Tone from "tone";
import majorData from "./majorScales.json";
import minorData from "./minorScales.json";

function Grid({ grid, setGrid, numSteps, instruments, noteLength, trackSegment, state, scale, playing, currentStep, tempo }) {
  const synthRef = useRef(null);
  const snareRef = useRef(null);
  const hihatRef = useRef(null);
  const playbackBarRef = useRef(null);

  const scales = majorData.concat(minorData);

  const lengthToCells = (length = noteLength) => {
    const num = length.match(/\d+/)[0];
    const map = {
      "16": 1,
      "8": 2,
      "4": 4,
      "2": 8,
      "1": 16,
    };
    return map[num];
  };

  const colorMap = ["bg-teal-400", "bg-sky-700", "bg-purple-600", "bg-orange-600"];

  const disposeSynths = () => {
    [synthRef, snareRef, hihatRef].forEach(ref => {
      if (ref.current) {
        ref.current.dispose();
        ref.current = null;
      }
    });
  };

  const { notes, drumConfig } = useMemo(() => {
    const instrument = instruments[trackSegment.track];
    let kickConfig = instrument;
    let snareConfig = null;
    let hihatConfig = null;

    // Extract drum configurations if this is a drum kit
    if (instrument.name === "Drums") {
      kickConfig = instrument.kick;
      snareConfig = instrument.snare;
      hihatConfig = instrument.hihat;
    }

    // Dispose existing synths
    disposeSynths();

    // Create helper function
    const createInstrument = (config) => {
      const SynthClass = Tone[config.synth];

      if (config.synth === "Sampler") {
        return new SynthClass(config.options).toDestination();
      } else {
        const WrapperClass = Tone[config.type];
        return new WrapperClass(SynthClass, config.options).toDestination();
      }
    };

    // Create kick/main synth
    synthRef.current = createInstrument(kickConfig);

    if (kickConfig.synth !== "MembraneSynth") {
      synthRef.current.maxPolyphony = kickConfig.numNotes || 16;
    }

    // Create snare and hihat synths or samplers
    if (snareConfig && hihatConfig) {
      snareRef.current = createInstrument(snareConfig);
      hihatRef.current = createInstrument(hihatConfig);
    }

    return {
      notes: kickConfig.noteRange,
      drumConfig: {
        isDrumKit: instrument.name === "Drums",
        snare: snareConfig,
        hihat: hihatConfig
      }
    };
  }, [instruments, trackSegment.track]);

  // Calculate playback bar position
  const calculateBarPosition = () => {
    const stepInCurrentGrid = currentStep % numSteps;
    const cellWidth = 16; // w-4 = 1rem = 16px
    const basePosition = stepInCurrentGrid * cellWidth;

    // Add spacing for measure and beat gaps
    let additionalSpacing = 0;
    for (let i = 1; i <= stepInCurrentGrid; i++) {
      if (i % 16 === 0) {
        additionalSpacing += 4; // ml-1 = 0.25rem = 4px
      } else if (i % 4 === 0) {
        additionalSpacing += 2; // ml-0.5 = 0.125rem = 2px
      }
    }

    return basePosition + additionalSpacing;
  };

  // Update playback bar position
  useEffect(() => {
    if (playbackBarRef.current && playing) {
      const position = calculateBarPosition();
      const duration = (60 / tempo / 4) * 1000; // Duration for one 16th note in ms

      playbackBarRef.current.style.transition = `left ${duration}ms linear`;
      playbackBarRef.current.style.left = `${position}px`;
    }
  }, [currentStep, tempo, playing, numSteps]);

  // Reset bar position when playback stops
  useEffect(() => {
    if (!playing && playbackBarRef.current) {
      playbackBarRef.current.style.transition = 'none';
      playbackBarRef.current.style.left = '0px';
    }
  }, [playing]);

  const playDrumSound = (row) => {
    if (row === 0 && snareRef.current) {
      if (snareRef.current.loaded !== false) {
        snareRef.current.triggerAttackRelease("C2", "16n");
      }
    } else if (row === 1 && hihatRef.current) {
      if (hihatRef.current.loaded !== false) {
        hihatRef.current.triggerAttackRelease("C2", "16n");
      }
    } else if (synthRef.current) {
      synthRef.current.triggerAttackRelease(notes[row], "16n");
    } else {
      console.error("Drum synth is not initialized");
    }
  };

  const playInstrumentSound = (row) => {
    if (synthRef.current) {
      synthRef.current.triggerAttackRelease(notes[row], "8n");
    } else {
      console.error("Synth is not initialized");
    }
  };

  const addNote = async (row, col) => {
    await Tone.start();
    if (state === 0) return;

    const numCells = lengthToCells(noteLength);

    // Play sound feedback
    if (drumConfig.isDrumKit) {
      playDrumSound(row);
    } else {
      playInstrumentSound(row);
    }

    // Clear overlapping notes
    const newGrid = [...grid];
    for (let i = 0; i < numCells && i + col < numSteps; i++) {
      if (col + i < numSteps && grid[row][col + i] != null) {
        const len = grid[row][col + i].length;
        for (let j = 0; j < len; j++) {
          newGrid[row][col + i + j] = null;
        }
      }
    }

    // Add new note
    const adjusted = Math.min(numCells, numSteps - col);
    newGrid[row][col] = { note: notes[row], length: adjusted };

    setGrid(newGrid);
  };

  const removeNote = (row, col) => {
    const newGrid = [...grid];
    newGrid[row][col] = null;
    setGrid(newGrid);
  };

  const calcScaleValue = (startCol, size) => {
    if (size === 1) return 1;

    const measureGapSize = 0.6;
    let noteGapSize = 0.3;
    const endCol = startCol + size;
    let measureGaps = 0;
    let noteGaps = 0;

    if (startCol % 4 === 0 && (size === 16 || size === 8)) {
      noteGapSize = 0.45;
    }

    for (let i = startCol + 1; i < endCol; i++) {
      if (i % 16 === 0) {
        measureGaps += 1;
      } else if (i % 4 === 0) {
        noteGaps += 1;
      }
    }

    return size + measureGaps * measureGapSize + noteGaps * noteGapSize;
  };

  const containedInScale = (note) => {
    let scaleNotes;
    for (let i = 0; i < scales.length; i++) {
      if (scales[i].scaleName == scale) {
        scaleNotes = scales[i].notes;
      }
    }

    const noteName = note.replace(/\d+$/, '');

    return scaleNotes.includes(noteName);
  }

  return (
    <>
      <div>
        {notes.map((note, index) => (
          <div key={index} className="text-[0.75rem] w-4 h-4 my-0.5 font-bold">
            {note[1] === "#" ? "" : note}
          </div>
        ))}
      </div>
      <div className="relative overflow-hidden">
        {/* Playback Bar */}
        <div
          ref={playbackBarRef}
          className={`absolute top-0 w-0.5 bg-red-500 z-10 opacity-80 shadow-lg ${playing ? "visible" : "invisible"}`}
          style={{
            height: `${notes.length * 20}px`, // 20px = h-4 + my-0.5
            left: '0px',
            transition: playing ? undefined : 'none'
          }}
        />

        {/* Grid */}
        <div>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex my-0.5">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`relative w-4 h-4 border-l-1 border-l-neutral-800
                      ${colIndex % 4 === 0 ? "ml-0.5" : ""}
                      ${colIndex % 16 === 0 ? "ml-1" : ""}`}
                >
                  <div
                    onMouseDown={() => {
                      cell == null
                        ? addNote(rowIndex, colIndex)
                        : removeNote(rowIndex, colIndex);
                    }}
                    className={`
                      absolute left-0 w-full h-full cursor-pointer hover:border hover:border-amber-100 hover:z-2
                      ${cell ? `origin-left z-3` : ""}
                      ${cell ? colorMap[trackSegment.track] : ""}
                      ${containedInScale(notes[rowIndex]) ? "bg-neutral-700" : "bg-neutral-800"}
                    `}
                    style={cell ? { transform: `scaleX(${calcScaleValue(colIndex, cell.length)})` } : {}}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Grid;
