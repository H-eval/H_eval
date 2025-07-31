const mongoose = require('mongoose');

const HindiFileSchema = new mongoose.Schema({
  source: String, // Optional: e.g. "file1"
  language: { type: String, default: 'hindi' },
  lines: [String],
});

module.exports = mongoose.model('HindiFile', HindiFileSchema);
