import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; 
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/Resolvers.js';

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? 'https://your-production-domain.com' // Дозволяємо лише продакшн-домен
      : 'http://localhost:3002', // Локальний фронтенд у режимі розробки
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
  })
);

app.use('/auth', authRoutes); 

// ApolloServer
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      token: req.headers.authorization, 
    }), 
  });

  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer().then(() => {
  console.log('Apollo Server started successfully');
});


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
