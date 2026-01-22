const express = require("express");
const router = express.Router();
const { getCorrelationMetrics } = require("../controllers/corell");

router.get("/correlation/:translationId", getCorrelationMetrics);

module.exports = router;
