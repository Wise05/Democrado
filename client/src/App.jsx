import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/HomePage/Home";
import Wait from "./components/WaitRoom/Wait";
import Build from "./components/BuildRoom/Build";
import Voting from "./components/VotingStage/Voting";
import Podium from "./components/Results/Podium";
import Login from "./components/Profile/Login";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/waitroom' element={<Wait />} />
        <Route path='/build' element={<Build />} />
        <Route path='/voting' element={<Voting />} />
        <Route path='/podium' element={<Podium />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
