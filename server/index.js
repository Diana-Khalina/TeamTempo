const express = require('express');
const app = express();
const PORT = process.env.PORT || 5005;

app.get('/', (req, res) => {
  res.send('Сервер працює!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);

  
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер працює!' });
});