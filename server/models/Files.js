// models/File.js
const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  translatorId: { type: String, required: true },
  text: { type: String, required: true }
});

const sentenceSchema = new mongoose.Schema({
  sentenceId: { type: String, required: true },
  text: { type: String, required: true },
  translations: [translationSchema]
});

const fileSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true },
  filename: { type: String, required: true },
  sentences: [sentenceSchema],
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
