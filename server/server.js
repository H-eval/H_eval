
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rankRoutes = require('./routes/RankRoutes');
const corellRoutes = require('./routes/corell');
const autoEvaluationRoutes = require("./routes/autoEvalRoutes");
require("dotenv").config();

const app = express();

// middleware FIRST
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", require("./routes/uploadRoutes")); // ✅ ONLY THIS
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/translationRoutes"));
app.use("/api/nlp", require("./routes/nlproutes"));
app.use('/api/ranks', rankRoutes);
app.use("/api", corellRoutes);
app.use("/api/auto-eval", autoEvaluationRoutes);

// test route
app.get("/", (req, res) => {
  res.send("🚀 Backend API is running");
});

// DB + server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5000, () =>
      console.log("🚀 Server running on http://localhost:5000")
    );
  })
  .catch(console.error);


