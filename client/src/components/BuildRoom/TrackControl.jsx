import { useState, useEffect } from "react";

function TrackControl({ song, numTracks, numSegments, colorMap, trackSegment, setTrackSegment }) {
  const maxNumSegments = 16;

  // Represents each grid with a number 
  // Allows for user to easily repeat segments
  const [segmentStates, setSegmentStates] = useState(() =>
    Array.from({ length: numTracks }, () =>
      Array(maxNumSegments).fill(0)
    )
  );

  // On initial render and when the number of 
  // segments changes, populate those new segments with 1
  useEffect(() => {
    setSegmentStates(prev =>
      prev.map(row =>
        row.map((val, colIndex) =>
          colIndex < numSegments && val === 0 ? 1 : val
        )
      )
    );
  }, [numSegments]);

  const handleSwitchSegment = (track, segment) => {
    setTrackSegment({ "track": track, "segment": segment })
  }

  return (
    <div className="px-2 py-1 mt-3 border border-amber-100">
      {segmentStates.map((track, trackIndex) => (
        <div key={trackIndex} className="flex my-0.5 gap-0.5 font-pixel">
          {track.map((segment, segmentIndex) =>
            <button
              onClick={() => { handleSwitchSegment(trackIndex, segmentIndex) }}
              className={`w-7 h-7 flex justify-center items-center
                ${colorMap[trackIndex]}
                ${(trackSegment["track"] == trackIndex && trackSegment["segment"] == segmentIndex) ?
                  "bg-neutral-600" : "bg-neutral-700"}
              `}
              key={segmentIndex}>{segment}</button>)}
        </div>
      ))
      }
    </div >
  )
}

export default TrackControl
