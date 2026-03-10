const mongoose = require("mongoose");

const referenceSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  S_ID: { type: String, required: true },
  ReferenceSentence: { type: String, required: true }
});

module.exports = mongoose.model("Reference", referenceSchema);