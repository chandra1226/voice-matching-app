const express = require('express');
const router = express.Router();
const multer = require('multer');
const { OpenAI } = require('openai');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const natural = require('natural');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to extract keywords (basic example)
function extractKeywords(text) {
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(text);
  return tfidf.listTerms(0).slice(0, 5).map((term) => term.term);
}

// Route for audio upload and transcription
router.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    const audioPath = req.file.path;

    // Transcribe audio using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
    });

    const transcribedText = transcription.text;

    // Extract keywords from transcription
    const keywords = extractKeywords(transcribedText);

    // Save transcription and keywords to MongoDB
    const newUser = new User({
      username: `user-${Date.now()}`, // Temporary username
      transcription: transcribedText,
      keywords: keywords,
      audioFileUrl: req.file.path,
    });

    await newUser.save();

    // Clean up the uploaded file (optional)
    fs.unlinkSync(audioPath);

    res.status(200).json({
      message: 'Audio uploaded and transcribed successfully',
      transcription: transcribedText,
      keywords: keywords,
      userId: newUser._id, // Return the user ID for frontend use
    });

  } catch (error) {
    console.error('Error during audio processing:', error);
    res.status(500).json({ message: 'Error processing audio', error: error.message });
  }
});

module.exports = router; // Ensure this line is present