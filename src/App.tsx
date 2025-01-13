import { HashRouter, Route, Routes } from 'react-router-dom';
// Return to BrowserRouter at later time. 
// HashBrowser currently in use because of github-pages hosting limitations

import Home from './Home.tsx';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Home />} />

        {/* Old BrowserRouter paths

        <Route path="/is-this-artifact-good/" element={<Home />} />
        <Route path="/is-this-artifact-good/:id" element={<Home />} />
        */}

      </Routes>
    </HashRouter>
  );
};