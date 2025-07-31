const express = require('express');
const multer = require('multer');
const { uploadAndParseEnglish } = require('../controllers/uploadController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadAndParseEnglish);

module.exports = router;
