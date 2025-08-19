// models/Sentence.js
const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema({
  SID: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Primary Key
  text: { type: String, required: true } // English sentence
}, { timestamps: true });

module.exports = mongoose.model("Sentence", sentenceSchema);
