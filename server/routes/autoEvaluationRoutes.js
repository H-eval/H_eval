const express = require("express");
const router = express.Router();
const autoEvalController = require("../controllers/autoEvaluationController");

router.post("/evaluate-batch", autoEvalController.evaluateBatch);

module.exports = router;
