const runAutoEvaluation = require("../scripts/autoEvaluation");

exports.evaluateBatch = async (req, res) => {
  try {
    const { batchId } = req.body;

    if (!batchId) {
      return res.status(400).json({ message: "batchId is required" });
    }

    const result = await runAutoEvaluation(batchId);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Evaluation failed",
      error: error.message,
    });
  }
};
