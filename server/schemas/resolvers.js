const { AuthenticationError } = import('apollo-server-express');
const { User, MoodEntry } = import('../models');
const { signToken } = import('../utils/auth');

module.exports = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('You must be logged in.');
      return await User.findById(user._id).populate('entries');
    },
    entries: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('You must be logged in.');
      return await MoodEntry.find({ user: user._id }).sort({ date: -1 });
    }
  },
  Mutation: {
    signup: async (_, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    addMoodEntry: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError('Not logged in');
      const entry = await MoodEntry.create({ ...args, user: user._id });
      await User.findByIdAndUpdate(user._id, { $push: { entries: entry._id } });
      return entry;
    },
    deleteMoodEntry: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not logged in');
      return await MoodEntry.findOneAndDelete({ _id: id, user: user._id });
    }
  }
};
