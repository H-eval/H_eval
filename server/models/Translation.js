const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  fileId: String,
  sentenceNumber: Number,
  english: String,
  hindi1: String,
  hindi2: String,
  hindi3: String,
}, { timestamps: true });

module.exports = mongoose.model('Translation', translationSchema);
