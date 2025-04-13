const { Schema, model } = import('mongoose');

const moodEntrySchema = new Schema({
  mood: String,           // emoji or text
  energyLevel: Number,    // 1–5
  stressLevel: Number,    // 1–5
  supportLevel: Number,   // 1–5
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('MoodEntry', moodEntrySchema);
