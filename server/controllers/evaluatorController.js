const Rank = require("../models/Rank");

exports.getEvaluatorStats = async (req, res) => {
  try {
    const userId = req.userId;

    const ranks = await Rank.find({ userId });

    let totalScore = 0;
    let scoreCount = 0;
    let bestScore = 0;

    ranks.forEach(rank => {
      if (rank.Criterions && rank.Criterions.length > 0) {

        let sum = 0;
        let count = 0;

        rank.Criterions.forEach(c => {
          if (c.score !== "NA") {
            const val = Number(c.score);
            sum += val;
            totalScore += val;
            count++;
            scoreCount++;
          }
        });

        const avg = count ? sum / count : 0;

        if (avg > bestScore) {
          bestScore = avg;
        }
      }
    });

    const avgScore = scoreCount ? (totalScore / scoreCount).toFixed(2) : 0;

    res.json({
      totalEvaluations: ranks.length,
      avgScore,
      bestScore: bestScore.toFixed(2)
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

          lastEvaluation: { $max: "$createdAt" },

          avgScore: {
            $avg: {
              $avg: {
                $map: {
                  input: "$Criterions",
                  as: "c",
                  in: {
                    $cond: [
                      { $ne: ["$$c.score", "NA"] },
                      { $toDouble: "$$c.score" },
                      null
                    ]
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          batchId: "$_id",
          totalEvaluations: 1,
          lastEvaluation: 1,
          avgScore: { $round: ["$avgScore", 2] }
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
const Sentence = require("../models/Sentence");

exports.getBatchStats = async (req, res) => {

  try {

    const { batchId } = req.params;
    const userId = req.userId;

    // total sentences in this batch
    const totalSentences = await Sentence.countDocuments({ batchId });

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

    const results = await Rank.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },

      // Join Translation
      {
        $lookup: {
          from: "translations",
          localField: "TID",
          foreignField: "_id",
          as: "translation"
        }
      },
      { $unwind: "$translation" },

      // Join Translator
      {
        $lookup: {
          from: "translators",
          localField: "translation.T_ID",
          foreignField: "T_ID",
          as: "translatorInfo"
        }
      },
      { $unwind: { path: "$translatorInfo", preserveNullAndEmptyArrays: true } },

      {
        $match: {
          "translation.batchId": batchId
        }
      },

      // Join Sentence
      {
        $lookup: {
          from: "sentences",
          localField: "translation.S_ID",
          foreignField: "S_ID",
          as: "sentence"
        }
      },
      { $unwind: "$sentence" },

      // 🔥 Join AutoScore
      {
        $lookup: {
          from: "autoscores",
          localField: "translation._id",
          foreignField: "TID",
          as: "auto"
        }
      },
      { $unwind: { path: "$auto", preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: "$translation._id",

          sentence: { $first: "$sentence.SourceSentence" },
          translationText: { $first: "$translation.Indian_Translation" },
          translator: { $first: "$translatorInfo.TName" },
          translationId: { $first: "$translation._id" },

          avgScore: {
            $first: {
              $avg: {
                $map: {
                  input: "$Criterions",
                  as: "c",
                  in: {
                    $cond: [
                      { $ne: ["$$c.score", "NA"] },
                      { $toDouble: "$$c.score" },
                      null
                    ]
                  }
                }
              }
            }
          }
        }
      },

      {
        $project: {
          sentence: "$sentence",
          translationText: "$translationText",
          translator: { $ifNull: ["$translator", "Unknown"] },
          avgScore: 1,
          translationId: "$translationId"
        }
      }
    ]);

    // Group by sentence
    const grouped = {};
    results.forEach(item => {
      if (!grouped[item.sentence]) {
        grouped[item.sentence] = [];
      }
      grouped[item.sentence].push({
        translationText: item.translationText,
        translator: item.translator,
        avgScore: item.avgScore ? item.avgScore.toFixed(2) : "0.00",
        translationId: item.translationId
      });
    });

    const finalResult = Object.keys(grouped).map(sentence => ({
      sentence,
      translations: grouped[sentence]
    }));

    res.json(finalResult);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getTranslationDetails = async (req, res) => {
  try {
    const { translationId } = req.params;
    const userId = req.userId;

    const Rank = require("../models/Rank");
    const Translation = require("../models/Translation");
    const Sentence = require("../models/Sentence");
    const Translator = require("../models/Translator");

    const rank = await Rank.findOne({
      TID: translationId,
      userId
    }).lean();

    if (!rank) {
      return res.status(404).json({ msg: "No evaluation found" });
    }

    const translation = await Translation.findById(translationId).lean();

    const sentence = await Sentence.findOne({
      S_ID: translation.S_ID,
      batchId: translation.batchId
    }).lean();

    const translator = await Translator.findOne({
      T_ID: translation.T_ID
    }).lean();

    // 🔹 avg score
    let total = 0;
    let count = 0;

    rank.Criterions.forEach(c => {
      if (c.score !== "NA") {
        total += Number(c.score);
        count++;
      }
    });

    const avgScore = count ? (total / count).toFixed(2) : 0;

    res.json({
      sentence: sentence?.SourceSentence,
      translation: translation.Indian_Translation,
      translator: translator?.TName,
      avgScore,
      criteria: rank.Criterions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};