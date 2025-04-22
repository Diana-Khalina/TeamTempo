import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorkerDashboard from './pages/WorkerDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Footer from './components/Footer';
import './App.css';

const httpLink = createHttpLink({
  uri: 'https://teamtempo.onrender.com/graphql', //changed to the correct endpoint
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/worker-dashboard" element={<WorkerDashboard />} />
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
