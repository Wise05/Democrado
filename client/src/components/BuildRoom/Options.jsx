import { useState } from "react";
import PlayButton from "./MusicPlay";
import majorData from "./majorScales.json";
import minorData from "./minorScales.json";

// Composer options for all things
function Options({ song, noteLength, setNoteLength, segmentStates, instruments, scale, setScale }) {
  const noteLengths = { "whole note": "1n", "half note": "2n", "quarter note": "4n", "eigth note": "8n", "sixteenth note": "16n" };

  const [beginning, setBeginning] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [majorMinor, setMajorMinor] = useState(null);
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(0);

  const majorScales = majorData;
  const minorScales = minorData;

  return (
    <div className="ml-2">
      <div className="flex gap-1">

        {/* play */}
        <PlayButton song={song} segmentStates={segmentStates} instruments={instruments} beginning={beginning} setBeginning={setBeginning} tempo={tempo} volume={volume} />

        {/* beginning */}
        <button
          className="px-2 border border-amber-100"
          onClick={() => { setBeginning(true); }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="2" height="14" fill="white" />
            <path d="M7 12L17 5V19L7 12Z" fill="white" />
          </svg>
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center py-0.5 border border-amber-100 w-50 my-1 px-2">
        {volume === -10 ?
          (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path d="M10.047 3.062a.75.75 0 0 1 .453.688v12.5a.75.75 0 0 1-1.264.546L5.203 13H2.667a.75.75 0 0 1-.7-.48A6.985 6.985 0 0 1 1.5 10c0-.887.165-1.737.468-2.52a.75.75 0 0 1 .7-.48h2.535l4.033-3.796a.75.75 0 0 1 .811-.142ZM13.78 7.22a.75.75 0 1 0-1.06 1.06L14.44 10l-1.72 1.72a.75.75 0 0 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L16.56 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L15.5 8.94l-1.72-1.72Z" />
            </svg>
          ) :
          (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path d="M10.5 3.75a.75.75 0 0 0-1.264-.546L5.203 7H2.667a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 1.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 0 0 1.264-.546V3.75ZM16.45 5.05a.75.75 0 0 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 0 0 1.06 1.06 7 7 0 0 0 0-9.899Z" />
              <path d="M14.329 7.172a.75.75 0 0 0-1.061 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 0 0 1.06 1.06 4 4 0 0 0 0-5.656Z" />
            </svg>
          )
        }
        <input
          type="range"
          min="-10"
          max="10"
          value={volume}
          onChange={e => {
            const newVolume = Number(e.target.value);
            setVolume(newVolume);
          }}
          className="w-full h-1 ml-1 bg-amber-100 appearance-none cursor-pointer range-thumb-netural"
        />

      </div>

      {/* note length */}
      <div className="relative border border-amber-100 w-50 my-1 px-2">
        <button onClick={() => { openDropdown == null ? setOpenDropdown("noteLength") : setOpenDropdown(null) }}
          className="flex w-full">
          <p>NoteLength: {noteLength}</p>
          <div className="mr-0 ml-auto">
            {openDropdown === "noteLength" ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
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
      <div className="relative border border-amber-100 w-50 my-1 px-2">
        <button onClick={() => { openDropdown == null ? setOpenDropdown("scale") : setOpenDropdown(null) }}
          className="flex w-full">
          <p>Key: {scale}</p>
          <div className="mr-0 ml-auto">
            {openDropdown == "scale" ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            }
          </div>
        </button>
        <div className={`w-full absolute left-0 top-7 border border-amber-100 z-10 bg-neutral-800
          ${(openDropdown == "scale" ? "visible" : "invisible")}`}>
          {majorMinor == null ? (
            <div>
              <button
                className="w-full px-2 hover:border hover:border-amber-100"
                onClick={() => { setMajorMinor("major") }}
              >Major</button>
              <button
                className="w-full px-2 hover:border hover:border-amber-100"
                onClick={() => { setMajorMinor("minor") }}
              >Minor</button>
            </div>
          ) : null}
          {majorMinor === "major" ? (
            <div>
              {majorScales.map((scaleObject) => (
                <button
                  onClick={() => {
                    setScale(scaleObject.scaleName);
                    setOpenDropdown(null);
                    setMajorMinor(null);
                  }}
                  className={`w-full px-2 hover:border hover:border-amber-100
      ${scale === scaleObject.notes ? "bg-neutral-700" : null}
    `}
                  key={scaleObject.scaleName}
                >
                  {scaleObject.scaleName}
                </button>
              ))}
            </div>
          ) : null}
          {majorMinor === "minor" ? (
            <div>
              {minorScales.map((scaleObject) => (
                <button
                  onClick={() => {
                    setScale(scaleObject.scaleName);
                    setOpenDropdown(null);
                    setMajorMinor(null);
                  }}
                  className={`w-full px-2 hover:border hover:border-amber-100
      ${scale === scaleObject.notes ? "bg-neutral-700" : ""}
    `}
                  key={scaleObject.scaleName}
                >
                  {scaleObject.scaleName}
                </button>
              ))}
            </div>
          ) : ""}
        </div>
      </div>

      {/* Tempo */}
      <div className="flex border border-amber-100 w-50 my-1 px-2">
        <p>Tempo:</p>
        <input
          value={tempo}
          onChange={e => { setTempo(e.target.value) }}
          className="w-full appearance-none bg-transparent border-none outline-none p-0 mx-2"
          type="text"
          placeholder={tempo} />
      </div>


      <div className="relative border border-amber-100 w-50 my-1 px-2">Instrument:</div>
    </div >
  )
}

export default Options
