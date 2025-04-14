import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import logo from '../assets/logo2.png';
import { useMutation } from '@apollo/client';
import { ADDUSER } from '../graphql/mutations'; 

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const [addUser, { loading }] = useMutation(ADDUSER, {
    onError: (err) => {
      setError(err.message);
    },
    onCompleted: (data) => {
      if (data.addUser) {
        navigate('/login');  
      }
    },
  });

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !role) {
      setError('All fields are required.');
      return;
    }

    const roleEnum = role.toUpperCase(); 

    addUser({
      variables: {
        username,
        email,
        password,
        role: roleEnum,
        inviteCode: role === 'manager' ? inviteCode : null, 
      },
    });
  };

  return (
    <div className="container text-center my-5">
      <img src={logo} alt="TeamTempo Logo"  style={{ width: '250px' }} />
      <form className="text-start mx-auto" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" value={role} onChange={handleRoleChange} required>
            <option value="">Select role</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        {role === 'manager' && (
          <div className="mb-3">
            <label className="form-label">Invite Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default SignupPage;
