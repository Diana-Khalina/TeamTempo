import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import MoodEntry from '../models/MoodEntry.js';
import dotenv from 'dotenv';

dotenv.config();

const resolvers = {
  Query: {
    getUsers: async (_, __, { token }) => {
      try {
        console.log('Received token:', token);

        if (!token) {
          throw new Error('No token provided');
        }

        const strippedToken = token.replace('Bearer ', '');
        const decoded = jwt.verify(strippedToken, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'MANAGER') {
          throw new Error('Access denied. Only managers can view user list.');
        }

        const employees = await User.find({ role: 'EMPLOYEE' });
        return employees;
      } catch (error) {
        console.error('Error in getUsers:', error.message);
        throw new Error('Failed to fetch users. Please try again.');
      }
    },

    getUserMoodEntries: async (_, { id }) => {
      try {
        const user = await User.findById(id).populate('moodEntries'); 
        if (!user) {
          throw new Error('User not found.');
        }
        return user.moodEntries; 
      } catch (error) {
        console.error('Error in getUserMoodEntries:', error.message);
        throw new Error('Failed to fetch mood entries.');
      }
    },

    me: async (_, __, { token }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
          throw new Error('User not found.');
        }

        return user;
      } catch (error) {
        console.error('Error in me:', error.message);
        throw new Error('Failed to fetch user details. Please try again.');
      }
    },
  },

  Mutation: {
    addUser: async (_, { username, email, password, role, inviteCode }) => {
      try {
        if (role === 'MANAGER' && inviteCode !== process.env.MANAGER_INVITE_CODE) {
          throw new Error('Invalid invite code for manager registration.');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          role,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        return { token, user: newUser };
      } catch (error) {
        console.error('Error in addUser:', error.message);
        throw new Error('Failed to register user. Please try again.');
      }
    },

    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error('User not found.');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid email or password.');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        return { token, user };
      } catch (error) {
        console.error('Error in login:', error.message);
        throw new Error('Login failed. Please check your credentials.');
      }
    },

    signup: async (_, { input }) => {
      try {
        const { username, email, password, role, inviteCode } = input;

        if (role === 'MANAGER' && inviteCode !== process.env.MANAGER_INVITE_CODE) {
          throw new Error('Invalid invite code for manager registration.');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          role,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        return { token, user: newUser };
      } catch (error) {
        console.error('Error in signup:', error.message);
        throw new Error('Signup failed. Please try again.');
      }
    },
  },
};

export default resolvers;
