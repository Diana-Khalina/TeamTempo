import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.png';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/auth/login', { email, password }); // Змінено URL на правильний endpoint

      const { token, user } = response.data; 

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId', user._id);
      
      if (user.role === 'EMPLOYEE') {
        navigate('/worker-dashboard');
      } else if (user.role === 'MANAGER') {
        navigate('/manager-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="container text-center">
      <img src={logo} alt="TeamTempo Logo" style={{ width: '200px' }} className="mb-2" />
      <form className="mb-3" onSubmit={handleLogin}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <Link to="/signup" className="btn btn-outline-secondary w-100 mb-2">Sign Up</Link>
    </div>
  );
}

export default LoginPage;
