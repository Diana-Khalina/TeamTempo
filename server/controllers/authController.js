import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
import dotenv from 'dotenv';

dotenv.config();
// registration user
export const signup = async (req, res) => {
  const { username, email, password, role, inviteCode } = req.body;

  try {
    // Verifying the invite code for a role MANAGER
    if (role === 'MANAGER' && inviteCode !== process.env.MANAGER_INVITE_CODE) {
      return res.status(400).json({ message: 'Invalid invite code' });
    }

    // Checking if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new user
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

    // Return token and user information
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Search for a user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Password verification
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      // Test logic for token validation
      try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
      } catch (error) {
        console.error('Token verification error:', error.message);
      }
  
      // Return token and user information
      res.status(200).json({ token, user });
    } catch (err) {
      console.error(err); 
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };