// models/Translation.js
const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  Super_ID: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Primary Key
  SID: { type: mongoose.Schema.Types.ObjectId, ref: "Sentence", required: true }, // Foreign Key
  TID: { type: mongoose.Schema.Types.ObjectId, ref: "Translator", required: true }, // Foreign Key
  translatedText: { type: String, required: true },
  evaluated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Translation", translationSchema);
