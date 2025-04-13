// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 5005;

// app.get('/', (req, res) => {
//   res.send('Сервер працює!');
// });

// app.listen(PORT, () => {
//   console.log(`Сервер запущено на порту ${PORT}`);

  
// });

// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Сервер працює!' });
// });


const express = import('express');
const { ApolloServer } = import('apollo-server-express');
const path = import('path');
const db = import('./config/connection');
const { typeDefs, resolvers } = import('./schemas');
const { authMiddleware } = import('./utils/auth');

const PORT = process.env.PORT || 5005;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
}

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startApolloServer();
