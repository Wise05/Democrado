import React from "react";
import RecentRuns from "./RecentRuns";
import ChartWigit from "./ChartWigit";
import Typewriter from "../SpecialEffects/Typewriter"
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-neutral-800 text-amber-100 h-full p-6 font-mono">
      <div className="flex gap-4">
        <div>
          <h1 className="text-7xl font-pixel font-normal text-orange-400">Democrado</h1>
          <div className="bg-green-600 h-2 w-150 mu-3 mb-5"></div>
          <div className="border-amber-100 border-1 p-3 h-18.5">
            <Typewriter text="Welcome to Democrado, the game where the winner is decided by democracy, but improvization is king.
" />
          </div>
        </div>
        <div className="border-amber-100 border-1 w-full h-43.5">
          Shared work
          <RecentRuns />
        </div>
      </div>
      <div className="flex gap-4 my-4">
        <Link
          to="/waitroom"
          className="border-amber-100 border-1 w-120 h-50 overflow-hidden"
        >
          <div className="w-full h-full font-pixel text-3xl flex justify-center items-center no-underline transition delay-100 duration-200 ease-in-out hover:bg-green-600 hover:scale-110">
            <h2>Multiplayer</h2>
          </div>
        </Link>
        <Link
          to="/"
          className="border-amber-100 border-1 w-120 h-50 overflow-hidden"
        >
          <div className="w-full h-full font-pixel text-3xl flex justify-center items-center no-underline transition delay-100 duration-200 ease-in-out hover:bg-orange-400 hover:scale-110">
            <h2>Sandbox</h2>
          </div>
        </Link>
        <Link
          to="/"
          className="border-amber-100 border-1 w-120 h-50 overflow-hidden"
        >
          <div className="w-full h-full font-pixel text-3xl flex justify-center items-center no-underline transition delay-100 duration-200 ease-in-out hover:bg-purple-600 hover:scale-110">
            <h2>Tutorial</h2>
          </div>
        </Link>
      </div>
      <div className="flex gap-4 justify-center">
        <div className="border-amber-100 border-1 w-full h-50 font-pixel text-3xl flex justify-center items-center no-underline">
          Games in session
          <ChartWigit />
        </div>
        <div>
          <Link to="/" className="border-amber-100 mb-4 border-1 w-120 h-23 flex justify-center items-center overflow-hidden">
            <div className="w-full h-full font-pixel text-3xl flex jutify-center items-center transition delay-100 duration-200 ease-in-out hover:bg-red-600 hover:scale-110">
              <h2 className="mx-auto">About</h2>
            </div>
          </Link>
          <Link to="/" className="border-amber-100 border-1 w-120 h-23 flex justify-center items-center overflow-hidden">
            <div className="w-full h-full font-pixel text-3xl flex jutify-center items-center transition delay-100 duration-200 ease-in-out hover:bg-teal-600 hover:scale-110">
              <h2 className="mx-auto">Donate</h2>
            </div>
          </Link>
        </div>
      </div>
    </div >
  );
}

export default Home;
