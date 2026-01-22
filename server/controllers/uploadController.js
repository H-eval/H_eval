const { v4: uuidv4 } = require("uuid");
const Sentence = require("../models/Sentence");
const Translator = require("../models/Translator");
const Translation = require("../models/Translation");
const parseXML = require("../utils/xmlParser");

const uploadFiles = async (req, res) => {
  try {
    const englishFile = req.files?.english?.[0];
    const translationFiles = req.files?.translations || [];

    if (!englishFile || translationFiles.length === 0) {
      return res.status(400).json({
        message: "English file and at least one translation file required",
      });
    }

    // 🔑 One batchId per upload (THIS is what enables “most recent file”)
    const batchId = uuidv4();

    // 1️⃣ Parse English XML
    const englishSentences = await parseXML(englishFile.path);

    if (!englishSentences.length) {
      return res.status(400).json({
        message: "English file contains no sentences",
      });
    }

    // 2️⃣ Store English sentences
    for (const s of englishSentences) {
      await Sentence.create({
        batchId,
        S_ID: s.S_ID,
        SourceSentence: s.text,
      });
    }

    // 3️⃣ Process translation files
    let translatorCounter = 0;

    for (const file of translationFiles) {
      const translatedSentences = await parseXML(file.path);

      // ❌ Reject files that do not align structurally
      if (translatedSentences.length !== englishSentences.length) {
        console.warn(
          `Skipping ${file.originalname}: sentence count mismatch`
        );
        continue;
      }

      // Create a translator dynamically
      translatorCounter++;
      const T_ID = `T${translatorCounter}`;

      await Translator.create({
        T_ID,
        TName: `Translator ${translatorCounter}`,
      });

      // Store translations
      for (const s of translatedSentences) {
        await Translation.create({
          batchId,
          S_ID: s.S_ID,
          T_ID,
          SuperId: "SUP001",
          Indian_Translation: s.text,
        });
      }
    }

    res.json({
      message: "Upload parsed successfully",
      batchId,
      translatorsProcessed: translatorCounter,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { uploadFiles };
