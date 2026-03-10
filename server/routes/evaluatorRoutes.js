const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
  getEvaluatorStats,
  getSentenceEvaluations,
  getBatchStats,
  getUserHistory
} = require("../controllers/evaluatorController");
router.get("/history", authMiddleware, getUserHistory);
router.get("/batchStats/:batchId", authMiddleware, getBatchStats);
router.get(
  "/sentenceEvaluations/:batchId",
  authMiddleware,
  getSentenceEvaluations
);
module.exports = router;