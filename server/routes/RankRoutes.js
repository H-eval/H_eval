 const express = require("express");
const router = express.Router();

const { submitOrUpdateRank } = require("../controllers/rankController");
const Criterion = require("../models/Criterion");
const auth = require("../middleware/auth"); // 🔐 ADD THIS

// 🔒 Protected rank submission
router.post("/rank", auth, submitOrUpdateRank);

// Fetch evaluation criteria (public)
router.get("/criteria", async (req, res) => {
  const criteria = await Criterion.find({}).sort({ CId: 1 });
  res.json(criteria);
});

module.exports = router;
