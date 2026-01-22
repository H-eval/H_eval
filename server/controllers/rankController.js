 // controllers/rankController.js
const Rank = require("../models/Rank");

exports.submitOrUpdateRank = async (req, res) => {
  try {
    // 🔑 userId comes from auth middleware (JWT)
    const userId = req.userId;

    // 📦 request body
    const { SID, TID, Criterions } = req.body;

    console.log("📥 Rank request:", {
      SID,
      TID,
      userId,
      criterionsCount: Criterions?.length,
    });

    // ❌ Validation
    if (!SID || !TID || !userId) {
      return res.status(400).json({
        success: false,
        message: "SID, TID, UserId required",
      });
    }

    // 🔄 Update if exists, else create
    const rank = await Rank.findOneAndUpdate(
      {
        TID: TID,
        userId: userId, // ✅ FIXED
      },
      {
        SID: SID,
        TID: TID,
        userId: userId, // ✅ FIXED
        Criterions: Criterions,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
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
