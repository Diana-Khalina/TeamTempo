import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['EMPLOYEE', 'MANAGER'], 
    required: true,
  },
  moodEntries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MoodEntry', 
    },
  ],
});

const User = mongoose.model('User', UserSchema);

export default User;









