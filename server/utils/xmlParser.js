const fs = require("fs");
const xml2js = require("xml2js");

const parseXML = async (filePath) => {
  const xml = fs.readFileSync(filePath, "utf8");
  const json = await xml2js.parseStringPromise(xml);

  const sentences =
    json?.["EILMT-Consortia"]?.body?.[0]?.p?.[0]?.segment?.[0]?.sentence || [];

  return sentences.map((s, index) => ({
    S_ID: Number(s.$?.sentencenumber || index + 1),
    text: typeof s === "string" ? s.trim() : s._?.trim(),
  }));
};

module.exports = parseXML;