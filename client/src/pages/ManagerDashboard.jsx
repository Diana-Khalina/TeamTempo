import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../graphql/queries';
import useMoodEntries from '../hooks/useMoodEntries';
import Modal from 'react-bootstrap/Modal';

const ManagerDashboard = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { loading: loadingMoodEntries, error: errorMoodEntries, moodEntries } = useMoodEntries(selectedUser?._id);

  const handleViewMoodEntries = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
      <Navigation />
      <h1>Welcome to Manager Dashboard</h1>
      <div className="container mt-4">
        <h2>Employee List</h2>
        <div className="row">
          {data.getUsers.map((user) => (
            <div
              key={user._id}
              className="col-md-4 mb-4"
              onClick={() => handleViewMoodEntries(user)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="card shadow-lg rounded-lg border-0 h-100 d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: '#FAF3C0', // Updated to light cream
                  transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#28A745'; // Green background on hover
                  e.currentTarget.style.color = '#FFFFFF'; // White text on hover
                  e.currentTarget.style.transform = 'scale(1.05)'; // Enlarge slightly on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF3C0'; // Revert to light cream
                  e.currentTarget.style.color = '#000000'; // Reset text to black
                  e.currentTarget.style.transform = 'scale(1)'; // Reset size
                }}
              >
                <div className="card-body text-center">
                  <h5 className="card-title" style={{ fontWeight: 'bold' }}>{user.username}</h5>
                  <p className="card-text">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Mood Entries for{' '}
              <span style={{ color: '#28A745', fontWeight: 'bold' }}>{selectedUser.username}</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingMoodEntries ? (
              <p>Loading...</p>
            ) : errorMoodEntries ? (
              <p>Error loading mood entries: {errorMoodEntries.message}</p>
            ) : moodEntries.length > 0 ? (
              <ul>
                {moodEntries.map((entry) => (
                  <li key={entry._id}>
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
            ) : (
              <p>No mood entries found for this user.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ManagerDashboard;
