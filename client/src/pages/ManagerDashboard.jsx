import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../graphql/queries';
import useMoodEntries from '../hooks/useMoodEntries'; // Import custom hook
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


const ManagerDashboard = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { loading: loadingMoodEntries, error: errorMoodEntries, moodEntries } = useMoodEntries(selectedUser);

  const handleViewMoodEntries = (userId) => {
    setSelectedUser(userId);
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
        <ul className="list-group">
          {data.getUsers.map((user) => (
            <li key={user._id} className="list-group-item">
              <strong>{user.username}</strong> - {user.email} ({user.role})
              <Button
                variant="secondary"
                className="ms-3"
                onClick={() => handleViewMoodEntries(user._id)}
              >
                View Mood Entries
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && (
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Mood Entries for {selectedUser}</Modal.Title>
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
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ManagerDashboard;









