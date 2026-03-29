
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rankRoutes = require('./routes/RankRoutes');
const corellRoutes = require('./routes/corell');

const evaluatorRoutes = require("./routes/evaluatorRoutes");
//const autoEvaluationRoutes = require("./routes/autoEvaluationRoutes");

const autoEvaluationRoutes = require("./routes/autoEvalRoutes");
const historyRoutes = require("./routes/historyRoutes");


require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
// middleware FIRST
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", require("./routes/uploadRoutes")); // ✅ ONLY THIS
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/translationRoutes"));
app.use("/api/nlp", require("./routes/nlpRoutes"));
app.use('/api/ranks', rankRoutes);
app.use("/api", corellRoutes);
app.use("/api/auto-eval", autoEvaluationRoutes);
app.use("/api/evaluator", evaluatorRoutes);
app.use("/api/history", historyRoutes);
// test route
app.get("/", (req, res) => {
  res.send("🚀 Backend API is running");
});

// DB + server
 mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch(console.error);

