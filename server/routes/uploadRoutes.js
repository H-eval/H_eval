// routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const { uploadFiles } = require("../controllers/uploadController");

const router = express.Router();

// Store files in "uploads/" temporarily
const upload = multer({ dest: "uploads/" });

// Expect one English file + 3 translation files
router.post(
  "/upload",
  upload.fields([
    { name: "english", maxCount: 1 },        // 1 English file
    { name: "translations", maxCount: 3 },   // 3 Hindi files
  ]),
  uploadFiles
);

module.exports = router;
