import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; 
import moodRoutes from './routes/moodRoutes.js';
import userRoutes from './routes/userRoutes.js';
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

  app.use(cors({
    origin: 'http://localhost:3000',
  }));

app.use('/auth', authRoutes); 
app.use('/users', userRoutes);
app.use('/mood', moodRoutes);

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
