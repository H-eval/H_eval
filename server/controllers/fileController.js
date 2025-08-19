// controllers/fileController.js
const File = require('../models/File');

exports.getFileById = async (req, res) => {
  try {
    const { fileId } = req.params;
    const fileData = await File.findOne({ fileId });

    if (!fileData) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(fileData);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
