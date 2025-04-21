import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('moodEntries'); 
    console.log('Mood Entries:', user.moodEntries.map(entry => entry.date)); 
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
});

export default router;
