import React from 'react';
import Navigation from '../components/Navigation';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../graphql/queries';

const ManagerDashboard = () => {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
      <Navigation /> { }

      <h1>Welcome to Manager Dashboard</h1>
      <div className="container mt-4">
        <h2>Employee List</h2>
        <ul className="list-group">
          {data.getUsers.map((user) => (
            <li key={user._id} className="list-group-item">
              <strong>{user.username}</strong> - {user.email} ({user.role})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManagerDashboard;
