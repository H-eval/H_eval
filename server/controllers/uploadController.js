// controllers/uploadController.js
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // <-- add uuid
const xml2js = require("xml2js");
const Sentence = require("../models/Sentence");
const Translation = require("../models/Translation");
const Translator = require("../models/Translator");

// Parse XML → extract <sentence>
const parseXMLFile = async (filePath) => {
  const data = fs.readFileSync(filePath, "utf8");
  const result = await xml2js.parseStringPromise(data);

   const sentences =
    result?.["EILMT-Consortia"]
      ?.body?.[0]
      ?.p?.[0]
      ?.segment?.[0]
      ?.sentence || [];

  return sentences.map((s, index) => ({
    sentenceNumber: s.$?.sentencenumber || index + 1,
    text: typeof s === "string" ? s.trim() : s._?.trim() || "",
  }));
};

// Upload handler
const uploadFiles = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);
    const englishFile = req.files?.english?.[0];
    const translationFiles = req.files?.translations || [];

    if (!englishFile || translationFiles.length !== 3) {
      return res.status(400).json({
        message: "Upload 1 English file and exactly 3 translation files",
      });
    }

    // 1️⃣ Generate unique fileId
    const fileId = uuidv4();

    // 2️⃣ Parse English and insert into Sentence collection
    const englishSentences = await parseXMLFile(englishFile.path);
    const sentenceIdMap = {};

    for (const s of englishSentences) {
      if (!s.text) continue;
      const savedSentence = await Sentence.create({
        fileId, // link sentences to this upload
        text: s.text,
      });
      sentenceIdMap[s.sentenceNumber] = savedSentence._id;
    }

    // 3️⃣ Ensure translators exist
    const translators = [];
    for (let i = 0; i < 3; i++) {
      const code = `T0${i + 1}`;
      let translator = await Translator.findOne({ code });
      if (!translator) {
        translator = await Translator.create({
          code,
          name: `Translator ${code}`,
        });
      }
      translators.push(translator);
    }

    // 4️⃣ Parse and insert Hindi translations
    for (let i = 0; i < translationFiles.length; i++) {
      const translator = translators[i];
      const hindiSentences = await parseXMLFile(translationFiles[i].path);

      for (const s of hindiSentences) {
        if (!s.text) continue;
        const sentenceObjectId = sentenceIdMap[s.sentenceNumber];
        if (!sentenceObjectId) continue;

        await Translation.create({
          fileId, // link translations to this upload
          SID: sentenceObjectId,
          TID: translator._id,
          translatedText: s.text,
        });
      }
    }

    // ✅ Send fileId back to frontend
    res.json({
      message: "✅ Files uploaded and saved successfully",
      fileId,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { uploadFiles };




// const mongoose = require("mongoose");

// const uploadSchema = new mongoose.Schema({
//   files: [String],   // xml/json paths
//   parsedSentences: [
//     {
//       text: String,
//       translations: [
//         {
//           translatedText: String,
//           translator: String
//         }
//       ]
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Upload", uploadSchema);
