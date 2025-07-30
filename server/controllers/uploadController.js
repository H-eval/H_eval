const fs = require('fs');
const xml2js = require('xml2js');
const Line = require('../models/Line'); // Hindi line model
const { v4: uuidv4 } = require('uuid');

const uploadAndParseEnglish = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read & parse uploaded XML
    const xmlContent = fs.readFileSync(file.path, 'utf-8');
    const parsed = await xml2js.parseStringPromise(xmlContent);

    const sentenceTags =
      parsed['EILMT-Consortia']?.body?.[0]?.p?.[0]?.segment?.[0]?.sentence;

    if (!sentenceTags || !sentenceTags.length) {
      return res
        .status(400)
        .json({ message: 'No <sentence> tags found in the uploaded file' });
    }

    const fileId = uuidv4();

    const results = [];

    for (let i = 0; i < sentenceTags.length; i++) {
      const sentenceNumber = parseInt(
        sentenceTags[i]['$']?.sentencenumber || i + 1
      );
      const englishText = sentenceTags[i]._ || sentenceTags[i];

      const hindiMatches = await Line.find({ sentenceNumber });

      results.push({
        fileId,
        sentenceNumber,
        english: englishText,
        hindi: hindiMatches.map((line) => ({
          fileId: line.fileId,
          text: line.text,
        })),
      });
    }

    console.log('✅ Matched Translation Lines:\n', results);

    // Send to frontend
    res.json({
      message: '✅ Matched Hindi lines fetched successfully',
      fileId,
      data: results,
    });
  } catch (error) {
    console.error('❌ Parsing error:', error.message);
    res.status(500).json({ message: 'Server error during file parsing' });
  }
};

module.exports = { uploadAndParseEnglish };
