const mongoose = require('mongoose');

const LineSchema = new mongoose.Schema({
  fileId: { type: String, required: true },
  english: { type: String, required: true },
  translation: { type: String, required: true }
});

module.exports = mongoose.model('Line', LineSchema);
