const fs = require('fs');
const xml2js = require('xml2js');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');
const Line = require('../models/Line');

const uploadAndParseXML = async (req, res) => {
  try {
    const files = req.files;
    if (!files?.english || !files?.hindi) {
      return res.status(400).json({ message: 'Both English and Hindi XML files are required' });
    }

    const englishXML = fs.readFileSync(files.english[0].path, 'utf-8');
    const hindiXML = fs.readFileSync(files.hindi[0].path, 'utf-8');

    const fileId = uuidv4();

    await File.create({
      fileId,
      originalName: `${files.english[0].originalname} + ${files.hindi[0].originalname}`
    });

    const parser = new xml2js.Parser();

    parser.parseString(englishXML, (err, engResult) => {
      if (err) return res.status(500).json({ message: 'English XML parse error', err });

      parser.parseString(hindiXML, async (err2, hinResult) => {
        if (err2) return res.status(500).json({ message: 'Hindi XML parse error', err: err2 });

        const engSentences = engResult['EILMT-Consortia']?.body?.[0]?.p?.[0]?.segment?.[0]?.sentence || [];
        const hinSentences = hinResult['EILMT-Consortia']?.body?.[0]?.p?.[0]?.segment?.[0]?.sentence || [];

        if (engSentences.length !== hinSentences.length) {
          return res.status(400).json({ message: 'Sentence count mismatch' });
        }

        const lines = engSentences.map((eng, i) => ({
          fileId,
          english: eng._.trim(),
          translation: hinSentences[i]?._?.trim() || ''
        }));

        await Line.insertMany(lines);
        return res.json({ message: 'Upload & parse successful', fileId });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getTranslationsByFileId = async (req, res) => {
  try {
    const { fileId } = req.params;
    const lines = await Line.find({ fileId });
    res.json(lines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching translations', error });
  }
};

module.exports = { uploadAndParseXML, getTranslationsByFileId };
