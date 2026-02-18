const path = require("path");

const parseXML = require("./xmlParser");
const parseTXT = require("./txtParser");
const parseJSON = require("./jsonParser");

const parsers = {
  ".xml": parseXML,
  ".txt": parseTXT,
  ".json": parseJSON,
};

const parseFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  const parser = parsers[ext];

  if (!parser) {
    throw new Error(`Unsupported file type: ${ext}`);
  }

  return await parser(filePath);
};

module.exports = parseFile;
