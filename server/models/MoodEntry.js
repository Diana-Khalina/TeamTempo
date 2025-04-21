import mongoose from 'mongoose';

const { Schema } = mongoose;

const MoodEntrySchema = new Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  date: { type: Date, default: new Date().setHours(0, 0, 0, 0), required: true },
  answers: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
});

MoodEntrySchema.index({ employeeId: 1, date: 1 }, { unique: true });

const MoodEntry = mongoose.model('MoodEntry', MoodEntrySchema);

export default MoodEntry;
