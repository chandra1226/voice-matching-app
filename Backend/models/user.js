const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    transcription: { type: String },
    keywords: [{ type: String }],
    audioFileUrl: { type: String },
  });
  
  module.exports = mongoose.model('User', userSchema);