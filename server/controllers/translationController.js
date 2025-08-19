// controllers/translationController.js
const Sentence = require("../models/Sentence");
const Translation = require("../models/Translation");

const getAllSequences = async (req, res) => {
  try {
    const sentences = await Sentence.find().lean();

    const translations = await Translation.find()
      .populate("TID", "code name")
      .lean();

    const grouped = {};
    translations.forEach((t) => {
      const sid = t.SID?.toString();
      if (!sid) return;
      if (!grouped[sid]) grouped[sid] = [];
      grouped[sid].push({
        translator: t.TID,
        translatedText: t.translatedText,
        evaluated: t.evaluated,
      });
    });

    const response = sentences.map((s) => ({
      sentenceId: s._id,
      text: s.text,
      translations: grouped[s._id.toString()] || [],
    }));

    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching sequences:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Make sure it’s exported as an object
module.exports = { getAllSequences };
