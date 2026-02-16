import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IncidentList from './pages/IncidentList';
import IncidentDetail from './pages/IncidentDetail';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/">
            <h1>Incident Tracker</h1>
          </Link>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<IncidentList />} />
            <Route path="/incidents/:id" element={<IncidentDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
