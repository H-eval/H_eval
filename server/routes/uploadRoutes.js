const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { uploadFiles } = require("../controllers/uploadController");

router.post(
  "/upload",
  upload.fields([
    { name: "english", maxCount: 1 },
    { name: "translations", maxCount: 10 },
  ]),
  uploadFiles
);

module.exports = router;
