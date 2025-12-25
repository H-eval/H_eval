const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  files: [String],   // xml/json paths
  parsedSentences: [
    {
      text: String,
      translations: [
        {
          translatedText: String,
          translator: String
        }
      ]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Upload", uploadSchema);
