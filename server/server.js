// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const dotenv = require('dotenv');
// const bodyParser = require("body-parser");
// dotenv.config();

// const app = express();

// app.use("/api", require("./routes/upload"));

// // ===== Middleware =====
// app.use(cors({
//   origin: 'http://localhost:3000', // React app URL
//   credentials: true,
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ===== Routes =====

// const nlpRoutes = require("./routes/nlproutes");
// const uploadRoutes = require('./routes/uploadRoutes');
// const authRoutes = require('./routes/authRoutes');
// const translationRoutes = require('./routes/translationRoutes');
// // Health check route
// app.get('/', (req, res) => {
//   res.send('🚀 Backend API is running');
// });

// // Mount routes
// app.use('/api', uploadRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api', translationRoutes);
// app.use(bodyParser.json());
// app.use("/api/nlp", nlpRoutes);
// // ===== MongoDB Connection & Server Start =====
// const startServer = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('✅ MongoDB connected');

//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error.message);
//     process.exit(1);
//   }
// };

// startServer();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware FIRST
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", require("./routes/upload")); // ✅ ONLY THIS
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/translationRoutes"));
app.use("/api/nlp", require("./routes/nlproutes"));

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


