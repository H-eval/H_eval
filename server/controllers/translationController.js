// controllers/translationController.js
const Sentence = require("../models/Sentence");
const Translation = require("../models/Translation");
const Translator = require("../models/Translator");

const getAllSequences = async (req, res) => {
  try {
    // 1️⃣ get most recent batch
    const latestSentence = await Sentence.findOne().sort({ createdAt: -1 });

    if (!latestSentence) {
      return res.json([]);
    }

    const batchId = latestSentence.batchId;

    // 2️⃣ fetch all sentences
    const sentences = await Sentence.find({ batchId }).lean();

    // 3️⃣ fetch translations
    const translations = await Translation.find({ batchId }).lean();

    // 4️⃣ group translations by S_ID
    const map = {};
    translations.forEach(t => {
      if (!map[t.S_ID]) map[t.S_ID] = [];
      map[t.S_ID].push({
        translator: t.T_ID,
        translatedText: t.Indian_Translation,
        _id: t._id
      });
    });

    // 5️⃣ build response
    const response = sentences.map(s => ({
      sentenceId: s._id,
      text: s.SourceSentence,
      translations: map[s.S_ID] || []
    }));

    res.json(response);
  } catch (err) {
    console.error("❌ Translation fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllSequences };
