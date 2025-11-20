import {Route, Routes} from 'react-router-dom';

import Home from './pages/home/Home';
import AnimeDetails from './pages/anime-details/AnimeDetails';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/anime-details" element={<AnimeDetails/>}/>
    </Routes>
  )
}

export default App
