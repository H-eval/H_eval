// controllers/rankController.js
const Rank = require("../models/Rank");

exports.submitOrUpdateRank = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { SID, TID, Criterions } = req.body;

    console.log("📥 Rank request:", {
      SID,
      TID,
      userId,
      criterionsCount: Criterions?.length,
    });

    if (!SID || !TID || !userId) {
      return res.status(400).json({
        success: false,
        message: "SID, TID, userId required",
      });
    }

    const rank = await Rank.findOneAndUpdate(
      {
        TID: TID,
        userId: userId,
      },
      {
        SID: SID,
        TID: TID,
        userId: userId,
        Criterions: Criterions,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        strict: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Evaluation saved successfully",
      data: rank,
    });

  } catch (error) {
    console.error("❌ Rank error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit evaluation",
      error: error.message,
    });
  }
};
