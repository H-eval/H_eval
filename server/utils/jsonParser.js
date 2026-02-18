const fs = require("fs");

const parseJSON = async (filePath) => {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("JSON file must contain an array");
  }

  return data.map((item, index) => {
    if (typeof item === "string") {
      return {
        S_ID: index + 1,
        text: item.trim(),
      };
    }

    return {
      S_ID: Number(item.S_ID || index + 1),
      text: (item.text || "").trim(),
    };
  }).filter(s => s.text.length > 0);
};

module.exports = parseJSON;
