const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  transcription: { type: String },
  keywords: [{ type: String }],
  audioFileUrl: { type: String },
});

// Check if the model already exists before defining it
module.exports = mongoose.models.User || mongoose.model('User', userSchema);