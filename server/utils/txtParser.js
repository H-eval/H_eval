const fs = require("fs");

const parseTXT = async (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");

  const lines = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return lines.map((text, index) => ({
    S_ID: index + 1,
    text,
  }));
};

module.exports = parseTXT;
