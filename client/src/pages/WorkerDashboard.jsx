import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';
import DailyMoodForm from '../components/DailyMoodForm';
import logoOne from '../assets/Hero.jpg'; 

const WorkerDashboard = () => {
    const [showMoodForm, setShowMoodForm] = useState(false);
    const [showMoodEntries, setShowMoodEntries] = useState(false);
    const [moodEntries, setMoodEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch mood entries when the user clicks the "View Mood Entries" button
    const fetchMoodEntries = async () => {
        setLoading(true);
        setError('');
        try {
            const userId = localStorage.getItem('userId'); // Get userId from localStorage
            if (!userId) {
                setError('User ID is missing. Please log in again.');
                return;
              }
            const response = await axios.get(`https://teamtempo.onrender.com/users/${userId}`); // changed to the correct endpoint
            setMoodEntries(response.data.moodEntries); // Set mood entries from the response
        } catch (err) {
            console.error('Error fetching mood entries:', err); 
            setError('Failed to load mood entries. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleShowEntries = () => {
        setShowMoodEntries(!showMoodEntries);
        if (!showMoodEntries) {
            fetchMoodEntries(); // Fetch entries only when toggling to "show"
        }
    };

    return (
        <div className="container">
            <Navigation />

            <div className="d-flex flex-column align-items-center mt-5">

                <h1 className="text-success">Welcome to Worker Dashboard</h1>
                <img src={logoOne} alt="Logo" className="img-fluid mb-2 " />
            </div>
            <button
                className="btn btn-primary me-2"
                onClick={() => setShowMoodForm(!showMoodForm)}
            >
                {showMoodForm ? 'Close Daily Mood Check' : 'Open Daily Mood Check'}
            </button>
            <button
                className="btn btn-secondary"
                onClick={handleShowEntries}
            >
                {showMoodEntries ? 'Close Mood Entries' : 'View Mood Entries'}
            </button>

            {showMoodForm && <DailyMoodForm onClose={() => setShowMoodForm(false)} />}

            {showMoodEntries && (
                <div className="mt-4">
                    <h2>Your Mood Entries</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : moodEntries.length === 0 ? (
                        <p>No mood entries found.</p>
                    ) : (
                        <ul className="list-group">
                            {moodEntries.map((entry) => (
                                <li key={entry._id} className="list-group-item">
                                    <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}
                                    <ul>
                                        {entry.answers.map((answer, idx) => (
                                            <li key={idx}>
                                                <strong>{answer.question}:</strong> {answer.answer}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default WorkerDashboard;





















