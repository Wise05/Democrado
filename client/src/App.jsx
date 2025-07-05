import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/HomePage/Home";
import Wait from "./components/WaitRoom/Wait";
import Composer from "./components/BuildRoom/Composer";
import Voting from "./components/VotingStage/Voting";
import Podium from "./components/Results/Podium";
import Login from "./components/Profile/Login";
import Profile from "./components/Profile/Profile";
import SignUp from "./components/Profile/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/waitroom' element={<Wait />} />
        <Route path='/composer' element={<Composer />} />
        <Route path='/voting' element={<Voting />} />
        <Route path='/podium' element={<Podium />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
