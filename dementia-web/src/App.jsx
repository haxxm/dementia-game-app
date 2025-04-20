import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Diagnosis from './pages/Diagnosis';
import Game from './pages/Games/Game';
import MyPage from './pages/MyPage';
import GameCard from './pages/Games/GameCard';
import GameWord from './pages/Games/GameWord';
import GameOX from './pages/Games/GameOX';
import GameRPS from './pages/Games/GameRPS';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/game" element={<Game />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/game/card" element={<GameCard />} />
        <Route path="/game/word" element={<GameWord />} />
        <Route path="/game/ox" element={<GameOX />} />
        <Route path="/game/rps" element={<GameRPS />} />
      </Routes>
    </Router>
  );
}

export default App;
