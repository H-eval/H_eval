const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const mongoose = require("mongoose");

const Sentence = require("../models/Sentence");
const Translator = require("../models/Translator");
const Translation = require("../models/Translation");
const parseFile = require("../utils/fileParser");
const runAutoEvaluation = require("../scripts/autoEvaluation");

const uploadFiles = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const referenceFile = req.files?.reference?.[0];
    const englishFile = req.files?.english?.[0];
    const translationFiles = req.files?.translations || [];

    if (!referenceFile || !englishFile || translationFiles.length === 0) {
      return res.status(400).json({
        message: "Reference, English and at least one translation file required",
      });
    }

    const batchId = uuidv4();

    // ✅ Parse Reference
    const referenceSentences = await parseFile(referenceFile.path);

    if (!referenceSentences.length) {
      throw new Error("Reference file contains no sentences");
    }

    // ✅ Parse English
    const englishSentences = await parseFile(englishFile.path);

    if (!englishSentences.length) {
      throw new Error("English file contains no sentences");
    }

    // ✅ Alignment check (Reference vs English)
    if (
      referenceSentences.length !== englishSentences.length ||
      !referenceSentences.every(
        (s, index) => s.S_ID === englishSentences[index].S_ID
      )
    ) {
      throw new Error("Reference and English files are structurally misaligned");
    }

    // Insert English sentences
    const sentenceDocs = englishSentences.map((s) => ({
      batchId,
      S_ID: s.S_ID,
      SourceSentence: s.text,
    }));

    await Sentence.insertMany(sentenceDocs, { session });

    let translatorCounter = 0;

    for (const file of translationFiles) {
      const translatedSentences = await parseFile(file.path);

      if (
        translatedSentences.length !== englishSentences.length ||
        !translatedSentences.every(
          (s, index) => s.S_ID === englishSentences[index].S_ID
        )
      ) {
        console.warn(`Skipping ${file.originalname}: structural mismatch`);
        continue;
      }

      translatorCounter++;
      const T_ID = `T${translatorCounter}`;

      await Translator.create(
        [{ T_ID, TName: `Translator ${translatorCounter}` }],
        { session }
      );

      const translationDocs = translatedSentences.map((s) => ({
        batchId,
        S_ID: s.S_ID,
        T_ID,
        SuperId: "SUP001",
        Indian_Translation: s.text,
      }));

      await Translation.insertMany(translationDocs, { session });
    }

    await session.commitTransaction();
    session.endSession();

    await runAutoEvaluation(batchId);

    // ✅ Cleanup all files
    try {
      fs.unlinkSync(referenceFile.path);
      fs.unlinkSync(englishFile.path);
      translationFiles.forEach((file) =>
        fs.unlinkSync(file.path)
      );
    } catch (err) {
      console.warn("File cleanup failed:", err.message);
    }

    res.json({
      message: "Upload parsed successfully",
      batchId,
      translatorsProcessed: translatorCounter,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Upload error:", error);

    res.status(500).json({
      message: "Upload failed. Transaction rolled back.",
      error: error.message,
    });
  }
};

module.exports = { uploadFiles };
