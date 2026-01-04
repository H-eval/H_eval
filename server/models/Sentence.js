 const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema(
  {
    fileId: { type: String, required: true }, // 🔑 upload identifier
    sentenceNumber: { type: Number },         // from XML
    text: { type: String, required: true }    // English sentence
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sentence", sentenceSchema);
