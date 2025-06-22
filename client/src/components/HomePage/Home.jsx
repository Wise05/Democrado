import React from "react";
import SongOfTheWeek from "./SongOfTheWeek";
import ChartWigit from "./ChartWigit";
import About from "./About";

function Home() {
  return (
    <div className="bg-neutral-800 text-amber-100 h-full p-6 font-mono">
      <div className="flex">
        <div>
          <h1 className="text-5xl font-pixel font-normal text-orange-600">Democrado</h1>
          <div className="bg-lime-600 h-2 w-100 mu-3 mb-5"></div>
          <p className="border-amber-100 border-1 p-3">
            Welcome to Democrado, the game where the winner is decided by democracy.
          </p>
        </div>
        <div class>
          <SongOfTheWeek />
        </div>
      </div>
      <div className="flex">
        <div>Multi</div>
        <div>SandBox</div>
        <div>Tutorial</div>
      </div>
      <div className="flex">
        <ChartWigit />
        <About />
      </div>
    </div>
  );
}

export default Home;
