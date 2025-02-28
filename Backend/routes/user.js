const express = require('express');
const router = express.Router();
const User = require('../models/user');
const cosineSimilarity = require('cosine-similarity');

// Route to find matching users based on keywords
router.get('/match/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure user.keywords is defined and is an array
    if (!user.keywords || !Array.isArray(user.keywords)) {
      return res.status(400).json({ message: 'User keywords are invalid' });
    }

    // Get all users except the current one
    const users = await User.find({ _id: { $ne: userId } });

    // Calculate cosine similarity between users
    const matchingUsers = users
      .filter((otherUser) => otherUser.keywords && Array.isArray(otherUser.keywords)) // Filter out users without keywords
      .map((otherUser) => {
        const similarity = cosineSimilarity(user.keywords, otherUser.keywords);
        return { ...otherUser._doc, similarity };
      });

    // Sort by similarity (highest first)
    matchingUsers.sort((a, b) => b.similarity - a.similarity);

    // Optionally, limit the number of matching users (e.g., top 10)
    const topMatchingUsers = matchingUsers.slice(0, 10);

    res.status(200).json(topMatchingUsers);
  } catch (error) {
    console.error('Error finding matching users:', error);
    res.status(500).json({ message: 'Error finding matching users', error: error.message });
  }
});

// Route to fetch user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

module.exports = router; // Ensure this line is present