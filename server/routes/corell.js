const express = require("express");
const router = express.Router();

const { getCorrelation } = require("../controllers/corell");

// define route
router.get("/correlation/:translationId", getCorrelation);

module.exports = router;
