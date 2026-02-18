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
    const englishFile = req.files?.english?.[0];
    const translationFiles = req.files?.translations || [];

    if (!englishFile || translationFiles.length === 0) {
      return res.status(400).json({
        message: "English file and at least one translation file required",
      });
    }

    const batchId = uuidv4();

    // 1️⃣ Parse English file
    const englishSentences = await parseFile(englishFile.path);

    if (!englishSentences.length) {
      throw new Error("English file contains no sentences");
    }

    // 2️⃣ Insert English sentences (bulk)
    const sentenceDocs = englishSentences.map((s) => ({
      batchId,
      S_ID: s.S_ID,
      SourceSentence: s.text,
    }));

    await Sentence.insertMany(sentenceDocs, { session });

    let translatorCounter = 0;

    // 3️⃣ Process translations
    for (const file of translationFiles) {
      const translatedSentences = await parseFile(file.path);

      // 🔎 Strict alignment check by S_ID
      if (
        translatedSentences.length !== englishSentences.length ||
        !translatedSentences.every(
          (s, index) => s.S_ID === englishSentences[index].S_ID
        )
      ) {
        console.warn(
          `Skipping ${file.originalname}: structural mismatch`
        );
        continue;
      }

      translatorCounter++;
      const T_ID = `T${translatorCounter}`;

      await Translator.create(
        [
          {
            T_ID,
            TName: `Translator ${translatorCounter}`,
          },
        ],
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

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 4️⃣ Run auto evaluation (after commit)
    try {
      await runAutoEvaluation(batchId);
      console.log("Auto evaluation completed.");
    } catch (err) {
      console.error("Auto evaluation failed:", err.message);
    }

    // 5️⃣ Delete uploaded files
    try {
      fs.unlinkSync(englishFile.path);
      translationFiles.forEach((file) => {
        fs.unlinkSync(file.path);
      });
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
