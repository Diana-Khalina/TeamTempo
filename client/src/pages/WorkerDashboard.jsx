import React from 'react';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';
import './WorkerDashboard.css'; // <- Import the styles

const WorkerDashboard = () => {
  return (
    <div class="container">
      <Navigation />
      <h1>Welcome to Worker Dashboard</h1>
      
      <nav className="navbar-links">
      <a href="/WorkerDashboard.jsx" className="navbar-link main">Main</a>
      <a href="/tracker" className="navbar-link tracker">Tracker</a>
      </nav>

    </div>
  );
};

export default WorkerDashboard;
