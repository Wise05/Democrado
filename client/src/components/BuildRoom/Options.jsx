import { useState } from "react";
import PlayButton from "./MusicPlay";

// Composer options for all things
function Options({ song, noteLength, setNoteLength, segmentStates, instruments }) {
  const noteLengths = { "whole note": "1n", "half note": "2n", "quarter note": "4n", "eigth note": "8n", "sixteenth note": "16n" };

  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="ml-2">
      <div className="flex gap-1">

        {/* play */}
        <PlayButton song={song} segmentStates={segmentStates} instruments={instruments} />
        <button className="px-2 border border-amber-100">
          {/* prev */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
          </svg>
        </button>
        {/* next */}
        <button className="px-2 border border-amber-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
          </svg>
        </button>
      </div>

      {/* Volume */}
      <div className="relative border border-amber-100 w-50 my-1 px-2">Volume:</div>

      {/* note length */}
      <div className="relative border border-amber-100 w-50 my-1 px-2">
        <button onClick={() => { openDropdown == null ? setOpenDropdown("noteLength") : setOpenDropdown(null) }}
          className="flex w-full">
          <p>NoteLength: {noteLength}</p>
          <div className="mr-0 ml-auto">
            {openDropdown ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            }
          </div>
        </button>
        <div className={`w-full absolute left-0 top-7 border border-amber-100 z-10 bg-neutral-800
${(openDropdown === "noteLength" ? "visible" : "invisible")}`}>
          {Object.keys(noteLengths).map((length) => (
            < button
              onClick={() => { setNoteLength(noteLengths[length]); setOpenDropdown(null) }}
              className={`w-full px-2 hover:border hover:border-amber-100 
                  ${noteLength == noteLengths[length] ? "bg-neutral-700" : ""}
                  `}
              key={noteLengths[length]}
            >{length}</button>
          ))}
        </div>
      </div>

      {/* Key */}
      <div className="relative border border-amber-100 w-50 my-1 px-2">Key:</div>

      {/* Tempo */}
      <div className="relative border border-amber-100 w-50 my-1 px-2">Tempo:</div>


      <div className="relative border border-amber-100 w-50 my-1 px-2">Instrument:</div>
    </div >
  )
}

export default Options
