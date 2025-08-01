

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); // ✅ important



const Line = require('../models/Line');

const hindiFiles = [
  'Tr_0008_Hi_E1',
  'Tr_0008_Hi_E2',
  'Tr_0008_Hi_R1'
];

const parseXMLFile = async (fileId) => {
  const filePath = path.join(__dirname, '..', 'hindi_files', `${fileId}.xml`);
  const xmlContent = fs.readFileSync(filePath, 'utf-8');

  const parsed = await xml2js.parseStringPromise(xmlContent);

  console.log(`Parsed structure for ${fileId}:`, JSON.stringify(parsed, null, 2));

  const body = parsed['EILMT-Consortia']?.['body'];
  const paragraphs = body?.[0]?.p;
  if (!paragraphs || !Array.isArray(paragraphs)) {
    throw new Error(`Invalid XML structure in file ${fileId}`);
  }

  const sentences = [];

  paragraphs.forEach((para) => {
    const segments = para.segment || [];
    segments.forEach((segment) => {
      const sentenceList = segment.sentence || [];
      sentenceList.forEach((sentence) => {
        if (typeof sentence === 'object' && sentence._) {
          sentences.push({
            fileId,
            sentenceNumber: parseInt(sentence.$?.sentencenumber) || sentences.length + 1,
            text: sentence._.trim(),
            subdomain: sentence.$?.subdomain || ''
          });
        }
      });
    });
  });

  return sentences;
};

const preloadHindiData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const fileId of hindiFiles) {
      const lines = await parseXMLFile(fileId);

      await Line.deleteMany({ fileId }); // Clear old data if needed
      await Line.insertMany(lines); // Insert new data

      console.log(`✅ Preloaded ${lines.length} lines for ${fileId}`);
    }

    console.log('✅ All Hindi files preloaded');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error preloading Hindi files:', error.message);
    process.exit(1);
  }
};

preloadHindiData();
