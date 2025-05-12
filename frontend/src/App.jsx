import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const token = localStorage.getItem('token');
  return (
    <div className="min-h-screen min-w-screen bg-midnight-100 text-midnight-600 dark:bg-midnight-50 dark:text-midnight-600 transition-colors">
      <Router>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
