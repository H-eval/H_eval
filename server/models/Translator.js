const mongoose = require("mongoose");

const translatorSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g. "T01"
  name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Translator", translatorSchema);
