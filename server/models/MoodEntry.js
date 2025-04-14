import mongoose from 'mongoose';

const { Schema } = mongoose;

const MoodEntrySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  mood: {
    type: String,
    enum: ['HAPPY', 'SAD', 'NEUTRAL'], 
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const MoodEntry = mongoose.model('MoodEntry', MoodEntrySchema);

export default MoodEntry;
