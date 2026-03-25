import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import HistoryPortal from './pages/HistoryPortal';
import Intake from './pages/Intake';
import ShareHub from './pages/ShareHub';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<HistoryPortal />} />
        <Route path="/intake" element={<Intake />} />
        <Route path="/share" element={<ShareHub />} />
      </Routes>
    </Router>
  );
}

export default App;
