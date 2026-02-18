const mongoose = require("mongoose");

const autoScoreSchema = new mongoose.Schema({
  TID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Translation",
    required: true,
  },
  metric: {
    type: String, // BLEU, COMET, etc.
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔒 Prevent duplicate metric per translation
autoScoreSchema.index({ TID: 1, metric: 1 }, { unique: true });

module.exports = mongoose.model("AutoScore", autoScoreSchema);

