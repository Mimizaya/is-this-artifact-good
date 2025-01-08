import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.tsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/is-this-artifact-good/:id" element={<Home />} />
        <Route path="/is-this-artifact-good" element={<Home />} />
      </Routes>
    </Router>
  );
};