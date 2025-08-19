// routes/translationRoutes.js
const express = require("express");
const router = express.Router();

// ✅ Make sure path matches your file structure
const { getAllSequences } = require("../controllers/translationController");

// Route definition
router.get("/translations/sequences", getAllSequences);

module.exports = router;
