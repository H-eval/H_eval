const mongoose = require("mongoose");

const criterionSchema = new mongoose.Schema(
  {
    CId: {
      type: String,
      required: true,
      unique: true
    },
    CName: {
      type: String,
      required: true
    },
    CWeight: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: false,          // your documents don’t use timestamps
    collection: "criterions"    // 👈 IMPORTANT: matches MongoDB collection name
  }
);

module.exports = mongoose.model("Criterion", criterionSchema);
