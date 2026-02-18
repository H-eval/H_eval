const Rank = require("../models/Rank");
const Translation = require("../models/Translation");

exports.getCorrelation = async (req, res) => {
  try {
    const { translationId } = req.params;

    // 1️⃣ Fetch translation + sentence
    const translation = await Translation.findById(translationId)
      .populate("SID"); // assuming SID ref exists in Translation

    if (!translation) {
      return res.status(404).json({ success: false, message: "Translation not found" });
    }

    // 2️⃣ Fetch all ranks for this translation
    const ranks = await Rank.find({ TID: translationId });

    // 3️⃣ Compute human average
    let total = 0;
    let count = 0;

    ranks.forEach(rank => {
      rank.Criterions.forEach(c => {
        if (c.score !== "NA") {
          total += Number(c.score);
          count++;
        }
      });
    });

    const humanAverage = count ? (total / count).toFixed(2) : 0;

    // 4️⃣ Automatic evaluation (simple proxy for now)
    const autoEval = computeAutoEval(
      translation.translatedText,
      translation.SID.text
    );

    // 5️⃣ Response
    res.json({
      success: true,
      sentence: {
        source: translation.SID.text,
        mtOutput: translation.translatedText,
      },
      scores: {
        human: Number(humanAverage),
        bleu: autoEval.bleu,
        meteor: autoEval.meteor,
        ter: autoEval.ter,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
