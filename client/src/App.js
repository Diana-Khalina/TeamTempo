import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('/api/test')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="App">
      <h1>Team Tempo</h1>
    </div>
  );
}

export default App;
