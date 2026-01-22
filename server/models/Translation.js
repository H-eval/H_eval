const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    index: true,
  },
  S_ID: Number,
  T_ID: String,
  SuperId: String,
  Indian_Translation: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Translation", translationSchema);
