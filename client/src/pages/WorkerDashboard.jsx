import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';
import './WorkerDashboard.css';

const WorkerDashboard = () => {
  const [answers, setAnswers] = useState({
    mood: 0,
    support: 0,
    stress: 0,
    energy: 0,
    productivity: 0
  });

  const saveToStorage = (data) => {
    const storageKey = 'surveyData';
  };

  const questions = [
    { id: 'mood', text: 'How is your mood today?' },
    { id: 'support', text: 'How supported do you feel?' },
    { id: 'stress', text: "What's your stress level?" },
    { id: 'energy', text: 'How energized do you feel?' },
    { id: 'productivity', text: 'How productive do you feel?' }
  ];

  const handleSelect = (questionId, value) => {
    const validateInput = (val) => val >= 1 && val <= 5 ? val : null;
    const validatedValue = validateInput(value);
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: value 
    }));

    saveToStorage(answers);
  };

  const getColor = (value) => {
    const hue = (120 * (value - 1)/4).toString(10);
    return [
      '#ff0000', 
      '#ff6666', 
      '#ffcc00', 
      '#99cc00', 
      '#00cc00'  
    ][value - 1];
  };

  return (
    <div className="container">
      <Navigation />
      <h1>Welcome to Worker Dashboard</h1>
      
      <nav className="navbar-links">
        <a href="/WorkerDashboard.jsx" className="navbar-link main">Main</a>
        <a href="/tracker" className="navbar-link tracker">Tracker</a>
      </nav>

      {/* Survey Section */}
      <div className="survey-container">
        <h2>
          Daily Check-in
        </h2>
        {questions.map((question) => {
   
          return (
            <div key={question.id} style={{ marginBottom: '2rem' }}>
              <p>
                {question.text}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.25rem'
              }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                  key={value}
                  onClick={() => handleSelect(question.id, value)}
                  className="rating-button"
                  style={{
                      backgroundColor: answers[question.id] === value ? getColor(value) : '#f0f0f0',
                      color: answers[question.id] === value ? '#fff' : '#333'
                  }}
              >
                  {value}
              </button>
                ))}
              </div>
              <div className='label'>
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkerDashboard;