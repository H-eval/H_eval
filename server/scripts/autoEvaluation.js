const Sentence = require("../models/Sentence");
const Translation = require("../models/Translation");
const AutoScore = require("../models/AutoScore");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();

// Simple Unigram BLEU-like Precision
function computeScore(reference, hypothesis) {
  if (!reference || !hypothesis) return 0;

  const refTokens = tokenizer.tokenize(reference.toLowerCase());
  const hypTokens = tokenizer.tokenize(hypothesis.toLowerCase());

  if (hypTokens.length === 0) return 0;

  let matchCount = 0;

  hypTokens.forEach(word => {
    if (refTokens.includes(word)) {
      matchCount++;
    }
  });

  return matchCount / hypTokens.length;
}

async function runAutoEvaluation(batchId) {
  try {
    const translations = await Translation.find({ batchId });

    if (!translations.length) {
      return { message: "No translations found for this batch." };
    }

    let results = [];

    for (let t of translations) {
      const sentence = await Sentence.findOne({
        batchId: batchId,
        S_ID: t.S_ID,
      });

      if (!sentence) continue;

      const score = computeScore(
        sentence.SourceSentence,
        t.Indian_Translation
      );

      // Upsert to avoid duplicates
      const saved = await AutoScore.findOneAndUpdate(
        { TID: t._id, metric: "BLEU" },
        {
          TID: t._id,
          metric: "BLEU",
          score: score,
        },
        { upsert: true, new: true }
      );

      results.push({
        translationId: t._id,
        score: score,
      });
    }

    return {
      message: "Automatic evaluation completed",
      totalEvaluated: results.length,
      results,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = runAutoEvaluation;
