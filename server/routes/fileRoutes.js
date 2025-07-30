const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadAndParseXML } = require('../controllers/fileController');

// Save uploaded files to 'server/uploads'
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

const multiUpload = upload.fields([
  { name: 'english', maxCount: 1 },
  { name: 'hindi', maxCount: 1 }
]);

router.post('/upload', multiUpload, uploadAndParseXML);

router.get('/translations/:fileId', require('../controllers/fileController').getTranslationsByFileId);

module.exports = router;
