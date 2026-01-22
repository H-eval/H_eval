// routes/translationRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllSequences
} = require("../controllers/translationController");

router.get("/translations/sequences", getAllSequences);

module.exports = router;
