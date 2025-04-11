import { useEffect } from 'react';
import Login from './pages/Login';

function App() {
  useEffect(() => {
    fetch('/api/test')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="App">
      <div className="container">
      <h1>Team Tempo</h1>
      <Login />
      </div>
    </div>
  );
}

export default App;
