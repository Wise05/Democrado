import { useEffect } from "react";

function TrackControl({ numSegments, colorMap, trackSegment, setTrackSegment, segmentStates, setSegmentStates, handleSegmentChange, currentSegment, playing }) {

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

  // swaps the grid to the one selected
  const handleSwitchSegment = (track, segment) => {
    setTrackSegment({ "track": track, "segment": segment })
  }

  useEffect(() => {
    if (trackSegment.segment != currentSegment) {
      setTrackSegment(prev => {
        return { "track": prev.track, "segment": currentSegment };
      });
    }
  }, [currentSegment, playing]);

  return (
    <div className="px-2 py-1 mt-3 border border-amber-100">
      {segmentStates.map((track, trackIndex) => (
        <div key={trackIndex} className="flex my-0.5 gap-0.5 font-pixel">
          {track.map((segment, segmentIndex) =>
            <div
              onClick={() => { handleSwitchSegment(trackIndex, segmentIndex) }}
              className={`h-7 w-10 relative flex justify-center items-center group
                ${colorMap[trackIndex]}
                ${(trackSegment.track === trackIndex && trackSegment.segment === segmentIndex)
                  ? "bg-neutral-600 border border-amber-100"
                  : (segmentStates[trackIndex][segmentIndex] === 0 ? "bg-neutral-800" : "bg-neutral-700")
                }`}
              key={segmentIndex}>
              {segment}
              <div className="invisible group-hover:visible">
                <button
                  onClick={() => { handleSegmentChange(trackIndex, segmentIndex, 1); }}
                  className="absolute right-0 top-0 hover:bg-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => { handleSegmentChange(trackIndex, segmentIndex, -1); }}
                  className="absolute right-0 bottom-0 hover:bg-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>)}
        </div>
      ))
      }
    </div >
  )
}

export default TrackControl
