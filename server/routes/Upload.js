const express = require("express");
const router = express.Router();
const multer = require("multer");
const Upload = require("../models/Upload");

// Multer storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post("/upload", upload.array("files", 4), async (req, res) => {
  try {
    // validation
    if (!req.files || req.files.length !== 4) {
      return res.status(400).json({ message: "Exactly 4 files required" });
    }

    // save paths in DB
    const record = await Upload.create({
      files: req.files.map((file) => file.path),
    });

    // send id back to frontend
    res.json({ uploadId: record._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
