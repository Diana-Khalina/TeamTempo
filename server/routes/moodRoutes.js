import express from 'express';
import MoodEntry from '../models/MoodEntry.js'; 
import User from '../models/User.js';

const router = express.Router();

router.post('/addMoodEntry', async (req, res) => {
  const { employeeId, answers } = req.body;

  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const existingEntry = await MoodEntry.findOne({ employeeId, date: today });

    if (existingEntry) {
      return res.status(400).json({ message: 'You have already submitted your mood for today.' });
    }

    const newMoodEntry = new MoodEntry({ employeeId, date: today, answers });
    await newMoodEntry.save();
    await User.findByIdAndUpdate(
        employeeId,
        { $push: { moodEntries: newMoodEntry._id } }, 
        { new: true }
      );

    res.status(201).json({ message: 'Mood entry saved successfully!', entry: newMoodEntry });
  } catch (error) {
    console.error('Error saving mood entry:', error);
    res.status(500).json({ message: 'Failed to save mood entry.' });
  }
});

router.get('/checkEntry/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const entryExists = await MoodEntry.findOne({ employeeId, date: today });
    res.json({ exists: !!entryExists });
  } catch (error) {
    console.error('Error checking mood entry:', error);
    res.status(500).json({ message: 'Failed to check mood entry.' });
  }
});

export default router;