const cosineSimilarity = require('cosine-similarity');

router.get('/match/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all users except the current one
    const users = await User.find({ _id: { $ne: userId } });

    // Calculate cosine similarity between users
    const matchingUsers = users.map((otherUser) => {
      const similarity = cosineSimilarity(user.keywords, otherUser.keywords);
      return { ...otherUser._doc, similarity };
    });

    // Sort by similarity (highest first)
    matchingUsers.sort((a, b) => b.similarity - a.similarity);

    res.status(200).json(matchingUsers);
  } catch (error) {
    console.error('Error finding matching users:', error);
    res.status(500).json({ message: 'Error finding matching users', error: error.message });
  }
});
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