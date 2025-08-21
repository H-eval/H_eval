// routes/nlpRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// POST /api/nlp/process
router.post("/process", async (req, res) => {
  try {
    const { text } = req.body;

    // Forward request to Flask NLP service
    const response = await axios.post("http://127.0.0.1:5001/process", { text });

    // Send NLP response back to frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error connecting to NLP service:", error.message);
    res.status(500).json({ error: "Failed to connect to NLP service" });
  }
});

module.exports = router;
