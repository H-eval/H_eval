const Rank = require("../models/Rank");

exports.getEvaluatorStats = async (req, res) => {
  try {
    const userId = req.userId;

    // total evaluations done by this user
    const totalEvaluations = await Rank.countDocuments({ userId });

    // get all ranks for average score
    const ranks = await Rank.find({ userId });

    let totalScore = 0;
    let scoreCount = 0;

    ranks.forEach(rank => {
      if (rank.Criteria && rank.Criteria.length > 0) {
        rank.Criteria.forEach(c => {
          totalScore += c.score || 0;
          scoreCount++;
        });
      }
    });

    const avgScore = scoreCount ? (totalScore / scoreCount).toFixed(2) : 0;

    res.json({
      totalEvaluations,
      avgScore
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
// 👇 ADD THIS NEW FUNCTION BELOW
 const mongoose = require("mongoose");
exports.getUserHistory = async (req, res) => {
  try {

    const userId = req.userId;

    const history = await Rank.aggregate([
      {
      

$match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: "translations",
          localField: "TID",
          foreignField: "_id",
          as: "translation"
        }
      },
      { $unwind: "$translation" },
      {
        $group: {
  _id: "$translation.batchId",
  totalEvaluations: { $sum: 1 },
  lastEvaluation: { $max: "$createdAt" }
}
      },
      {
       $project: {
  _id: 0,
  batchId: "$_id",
  totalEvaluations: 1,
  lastEvaluation: 1
}
      }
    ]);

    res.json(history);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching history" });
  }
};
const Translation = require("../models/Translation");

exports.getBatchStats = async (req, res) => {

  try {

    const { batchId } = req.params;
    const userId = req.userId;

    // total sentences in this batch
    const totalSentences = await Translation.countDocuments({ batchId });

    // get translations in this batch
    const translations = await Translation.find({ batchId }).select("_id");

    const translationIds = translations.map(t => t._id);

    // ranks given by this user
    const ranks = await Rank.find({
  userId: userId,
  TID: { $in: translationIds }
}).sort({ createdAt: 1 });

    const evaluatedSentences = ranks.length;

    // average score
    let totalScore = 0;
    let scoreCount = 0;

    ranks.forEach(rank => {
  if (rank.Criteria && rank.Criteria.length > 0) {
    rank.Criteria.forEach(c => {
      totalScore += c.score ?? c ?? 0;
      scoreCount++;
    });
  }
});
    const averageScore = scoreCount ? (totalScore / scoreCount).toFixed(2) : 0;

    // last evaluation date
    const lastEvaluation = ranks.length
  ? ranks[ranks.length - 1].createdAt
  : null;

    // criteria used
    const criteriaUsed = ranks.length && ranks[0].Criteria
  ? ranks[0].Criteria.map((_, index) => `Criterion ${index + 1}`)
  : [];
    res.json({
      totalSentences,
      evaluatedSentences,
      averageScore,
      lastEvaluation,
      criteriaUsed
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ msg: "Error fetching batch stats" });

  }

};
exports.getSentenceEvaluations = async (req, res) => {
  try {

    const { batchId } = req.params;
    const userId = req.userId;

    const Rank = require("../models/Rank");
    const Translation = require("../models/Translation");
    const Translator = require("../models/Translator");

    const ranks = await Rank.find({ userId });

    const results = [];

    for (let rank of ranks) {

      const translation = await Translation.findOne({
        T_ID: rank.TID,
        batchId: batchId
      });

      if (!translation) continue;

      const translator = await Translator.findOne({
        T_ID: translation.T_ID
      });

      let totalScore = 0;
      let count = 0;

      if (rank.Criteria && rank.Criteria.length > 0) {
        rank.Criteria.forEach(c => {
          totalScore += c.score ?? c ?? 0;
          count++;
        });
      }

      const avgScore = count ? (totalScore / count).toFixed(2) : 0;

      results.push({
        sentenceId: translation.S_ID,
        translator: translator ? translator.TName : "Unknown",
        score: avgScore
      });

    }

    res.json(results);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};