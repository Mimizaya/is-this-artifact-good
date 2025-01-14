import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Return to BrowserRouter at later time. 
// HashBrowser currently in use because of github-pages hosting limitations

import Home from './Home.tsx';
import News from './News.tsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/is-this-artifact-good/" element={<Home />} />
        <Route path="/is-this-artifact-good/:id" element={<Home />} />
      </Routes>
    </Router>
  );
};