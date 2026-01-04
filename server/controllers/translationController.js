 const Sentence = require("../models/Sentence");
const Translation = require("../models/Translation");

const getAllSequences = async (req, res) => {
  try {
    const { fileId } = req.query;
    console.log("FILE ID FROM QUERY:", fileId);

    if (!fileId) {
      return res.status(400).json({ message: "fileId missing" });
    }

    // 1️⃣ Fetch all English sentences for this upload
    const sentences = await Sentence.find({ fileId }).lean();

    if (!sentences.length) {
      return res.json([]); // LineViewer will show "No lines found"
    }

    // 2️⃣ Fetch all translations linked to these sentences
    const sentenceIds = sentences.map(s => s._id);

    const translations = await Translation.find({
      SID: { $in: sentenceIds }
    })
      .populate("TID", "code")
      .lean();

    // 3️⃣ Group translations by sentence ID
    const translationMap = {};
    translations.forEach(t => {
      const sid = t.SID.toString();
      if (!translationMap[sid]) translationMap[sid] = [];
      translationMap[sid].push({
        translator: t.TID?.code || "UNKNOWN",
        translatedText: t.translatedText
      });
    });

    // 4️⃣ Build final response exactly how LineViewer wants
    const response = sentences.map(s => ({
      sentenceId: s._id,
      text: s.text,
      translations: translationMap[s._id.toString()] || []
    }));

    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching sequences:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllSequences };
