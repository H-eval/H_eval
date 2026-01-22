const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    index: true,
  },
  S_ID: Number,
  SourceSentence: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Sentence", sentenceSchema);
