 // models/Rank.js
const mongoose = require("mongoose");

const validScores = ["4", "3", "2", "1", "0", "NA"];

const rankSchema = new mongoose.Schema(
  {
    SID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sentence",
      required: true,
    },
    TID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Translation",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Criterions: [
      {
        name: { type: String, required: true },
        score: { type: String, enum: validScores, required: true },
        comment: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// 🔒 One evaluation per user per translation
rankSchema.index({ TID: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Rank", rankSchema);
