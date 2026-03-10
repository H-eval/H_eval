const Translation = require("../models/Translation");
const Reference = require("../models/Reference");
const AutoScore = require("../models/AutoScore");

/* ===========================
   SIMPLE METEOR IMPLEMENTATION
=========================== */

function tokenize(sentence) {
  return sentence
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .split(/\s+/);
}

function computeMETEOR(reference, hypothesis) {

  if (!reference || !hypothesis) return 0;

  const refWords = tokenize(reference);
  const hypWords = tokenize(hypothesis);

  let matches = 0;
  const refUsed = new Array(refWords.length).fill(false);

  // Match words
  hypWords.forEach(word => {

    for (let i = 0; i < refWords.length; i++) {

      if (!refUsed[i] && word === refWords[i]) {
        matches++;
        refUsed[i] = true;
        break;
      }

    }

  });

  if (matches === 0) return 0;

  const precision = matches / hypWords.length;
  const recall = matches / refWords.length;

  // Harmonic mean (METEOR weighting recall higher)
  const fmean = (10 * precision * recall) / (recall + 9 * precision);

  // Chunk penalty
  let chunks = 1;
  let lastMatchIndex = -1;

  hypWords.forEach(word => {

    const idx = refWords.indexOf(word);

    if (idx !== -1) {

      if (lastMatchIndex !== -1 && idx !== lastMatchIndex + 1) {
        chunks++;
      }

      lastMatchIndex = idx;
    }

  });

  const penalty = 0.5 * (chunks / matches);

  const meteor = fmean * (1 - penalty);

  return Math.max(meteor, 0);
}

/* ===========================
   MAIN AUTO EVALUATION
=========================== */

async function runAutoEvaluation(batchId) {

  try {

    const translations = await Translation.find({ batchId });

    if (!translations.length) {
      return { message: "No translations found for this batch." };
    }

    const references = await Reference.find({ batchId });

    const referenceMap = {};

    references.forEach(ref => {
      referenceMap[String(ref.S_ID)] = ref.ReferenceSentence;
    });

    let results = [];

    for (let t of translations) {

      const referenceText = referenceMap[String(t.S_ID)];

      if (!referenceText) continue;

      const score = computeMETEOR(
        referenceText,
        t.Indian_Translation
      );

      console.log("----");
      console.log("Reference:", referenceText);
      console.log("Hypothesis:", t.Indian_Translation);
      console.log("METEOR Score:", score);

      await AutoScore.findOneAndUpdate(
        { TID: t._id, metric: "METEOR" },
        {
          TID: t._id,
          metric: "METEOR",
          score: score
        },
        { upsert: true, new: true }
      );

      results.push({
        translationId: t._id,
        score
      });

    }

    return {
      message: "Automatic evaluation completed",
      metric: "METEOR",
      totalEvaluated: results.length,
      results
    };

  } catch (error) {

    console.error("Auto evaluation error:", error);
    throw error;

  }

}

module.exports = runAutoEvaluation;