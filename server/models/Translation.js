 const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema(
  {
    fileId: { type: String, required: true }, // 🔑 SAME upload identifier
    SID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sentence",
      required: true
    },
    TID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Translator",
      required: true
    },
    translatedText: { type: String, required: true },
    evaluated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Translation", translationSchema);
