const mongoose = require('mongoose');

const lineSchema = new mongoose.Schema({
  fileId: { type: String, required: true },
  sentenceNumber: { type: Number, required: true },
  subdomain: { type: String },
  text: { type: String, required: true },
});

module.exports = mongoose.model('Line', lineSchema);
