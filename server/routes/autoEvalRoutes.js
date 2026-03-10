const express = require("express");
const router = express.Router();
const AutoScore = require("../models/AutoScore");


// =========================================
// 1️⃣ Get autoscores by batchId
// =========================================
router.get("/scores/:batchId", async (req, res) => {
  try {
    const { batchId } = req.params;

    const scores = await AutoScore.find({ batchId })
      .populate({
        path: "translationId",
        select: "translator translatedText sentenceId"
      });

    res.json({
      total: scores.length,
      scores
    });

  } catch (error) {
    console.error("Fetch scores error:", error);
    res.status(500).json({
      message: "Error fetching autoscores",
      error: error.message
    });
  }
});


// =========================================
// 2️⃣ Get autoscore by translationId
// =========================================
router.get("/score/translation/:translationId", async (req, res) => {
  try {
    const { translationId } = req.params;

    const score = await AutoScore.findOne({ translationId });

    if (!score) {
      return res.status(404).json({
        message: "AutoScore not found for this translation"
      });
    }

    res.json(score);

  } catch (error) {
    console.error("Fetch translation score error:", error);
    res.status(500).json({
      message: "Error fetching translation autoscore",
      error: error.message
    });
  }
});

module.exports = router;