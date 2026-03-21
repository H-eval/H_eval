const express = require("express");
const router = express.Router();
const Rank = require("../models/Rank");

router.get("/:batchId", async (req, res) => {
  try {

    const batchId = req.params.batchId;

    const results = await Rank.aggregate([
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
        $lookup: {
          from: "autoscores",
          localField: "translation._id",
          foreignField: "TID",
          as: "auto"
        }
      },
      { $unwind: { path: "$auto", preserveNullAndEmptyArrays: true } },

      {
        $match: {
          "translation.batchId": batchId
        }
      }
    ]);

    res.json(results);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;