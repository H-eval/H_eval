// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const { getFileById } = require('../controllers/fileController');

// GET file by ID
router.get('/:fileId', getFileById);

module.exports = router;
