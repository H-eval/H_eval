 const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phone: String,
    userId: String,

    languages: {
      type: [String],
      default: []
    },

    education: String,
    gender: String,
    age: Number,

    registrationDate: {
      type: Date,
      default: Date.now
    },

    token: { type: String }
  },
  {
    timestamps: true // optional (you already have registrationDate)
  }
);

module.exports = mongoose.model("User", userSchema);