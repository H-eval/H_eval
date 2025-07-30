const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true },
  originalName: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);
