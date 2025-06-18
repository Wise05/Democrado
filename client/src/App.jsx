import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/HomePage/Home";
import Wait from "./components/WaitRoom/Wait";
import Build from "./components/BuildRoom/Build";
import Voting from "./components/VotingStage/Voting";
import Podium from "./components/Results/Podium";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/waitroom' element={<Wait />} />
        <Route path='/build' element={<Build />} />
        <Route path='/voting' element={<Voting />} />
        <Route path='/podium' element={<Podium />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
