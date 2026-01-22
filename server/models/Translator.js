const mongoose = require("mongoose");

const translatorSchema = new mongoose.Schema({
  T_ID: String,   // generated internally (T1, T2...)
  TName: String,
});

module.exports = mongoose.model("Translator", translatorSchema);
