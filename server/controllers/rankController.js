// controllers/rankController.js
const Rank = require("../models/Rank");

exports.submitOrUpdateRank = async (req, res) => {
    console.log("🔥 submitOrUpdateRank CALLED");
  try {
    const { Super_ID, UserId, Criterions } = req.body;

    const rank = await Rank.findOneAndUpdate(
      { Super_ID, UserId },           // find condition
      { Criterions },                 // update data
      {
        new: true,
        upsert: true,                 // 🔥 key line
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Review submitted/updated successfully",
      data: rank
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review"
    });
  }
};
