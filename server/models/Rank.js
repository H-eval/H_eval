// models/Rank.js
const mongoose = require("mongoose");

const validScores = ["4", "3", "2", "1", "0", "NA"]; // Allowed ranking values

const rankSchema = new mongoose.Schema({
  Super_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Translation",
    required: true
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  Criterions: [
    {
      name: { type: String, required: true }, // e.g., "Accuracy", "Fluency"
      score: { type: String, enum: validScores, required: true }, // Restricted to ranking scale
      comment: { type: String } // Optional explanation
    }
  ]
}, { timestamps: true });

// Composite unique index: one rating per user per translation (Super_ID)
rankSchema.index({ Super_ID: 1, UserId: 1 }, { unique: true });

module.exports = mongoose.model("Rank", rankSchema);
