const Translation = require("../models/Translation");
const Rank = require("../models/Rank");
const Sentence = require("../models/Sentence");

/**
 * GET /api/correlation/:superId
 * Fetch translation evaluation data and compute metrics
 */
exports.getCorrelationMetrics = async (req, res) => {
  try {
    const { superId } = req.params;

    // Fetch translation
    const translation = await Translation.findById(superId)
      .populate("SID")
      .populate("TID");

    if (!translation) {
      return res.status(404).json({
        success: false,
        message: "Translation not found"
      });
    }

    const mtOutput = translation.translatedText || "";
const referenceSentence = translation.SID?.text || "";

    // Fetch all ranks for this translation
    const ranks = await Rank.find({ Super_ID: superId });

    // Compute human evaluation score (average of all criteria, ignoring "NA")
    let humanScores = [];
    ranks.forEach(rank => {
      rank.Criterions.forEach(criterion => {
        if (criterion.score !== "NA") {
          humanScores.push(parseInt(criterion.score, 10));
        }
      });
    });

    const humanAverage = humanScores.length > 0
      ? humanScores.reduce((a, b) => a + b, 0) / humanScores.length
      : 0;

    // Compute automatic metrics (normalized to 0-4 scale)
const bleuScore = computeBLEU(referenceSentence, mtOutput);
const meteorScore = computeMETEOR(referenceSentence, mtOutput);
const terScore = computeTER(referenceSentence, mtOutput);
res.status(200).json({
  success: true,
  data: {
    human: parseFloat(humanAverage.toFixed(2)),
    bleu: parseFloat(bleuScore.toFixed(2)),
    meteor: parseFloat(meteorScore.toFixed(2)),
    ter: parseFloat(terScore.toFixed(2))
  },
  sentences: {
    source: referenceSentence,
    mtOutput: mtOutput,
    reference: referenceSentence
  }
});


  } catch (error) {
    console.error("Error in getCorrelationMetrics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch correlation metrics"
    });
  }
};
function computeBLEU(reference, hypothesis) {
  if (!reference || !hypothesis) return 0;

  const refWords = reference.toLowerCase().split(/\s+/);
  const hypWords = hypothesis.toLowerCase().split(/\s+/);

  const overlap = hypWords.filter(w => refWords.includes(w)).length;
  return Math.min(4, (overlap / hypWords.length) * 4);
}

function computeMETEOR(mtOutput) {
  if (!mtOutput) return 1.75;
  const len = mtOutput.split(/\s+/).length;
  return Math.min(4, (len / 12) * 4);
}

function computeMETEOR(reference, hypothesis) {
  if (!reference || !hypothesis) return 0;

  const refWords = reference.toLowerCase().split(/\s+/);
  const hypWords = hypothesis.toLowerCase().split(/\s+/);

  const overlap = hypWords.filter(w => refWords.includes(w)).length;
  const precision = overlap / hypWords.length;
  const recall = overlap / refWords.length;

  if (precision + recall === 0) return 0;
  return Math.min(4, (2 * precision * recall / (precision + recall)) * 4);
}
function computeTER(reference, hypothesis) {
  if (!reference || !hypothesis) return 0;

  const refLen = reference.split(/\s+/).length;
  const hypLen = hypothesis.split(/\s+/).length;

  const diff = Math.abs(refLen - hypLen);
  return Math.max(0, 4 - diff * 0.25);
}

