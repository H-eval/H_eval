const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
  getEvaluatorStats,
  getSentenceEvaluations,
  getBatchStats,
  getUserHistory,
  getTranslationDetails
} = require("../controllers/evaluatorController");

// ADD THIS ROUTE
router.get("/stats", authMiddleware, getEvaluatorStats);

router.get("/history", authMiddleware, getUserHistory);
router.get("/batchStats/:batchId", authMiddleware, getBatchStats);
router.get("/sentenceEvaluations/:batchId", authMiddleware, getSentenceEvaluations);
router.get("/translationDetails/:translationId", authMiddleware, getTranslationDetails);

module.exports = router;