<<<<<<< HEAD
// server.js

=======
// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/authRoutes');

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.log('DB Error:', err.message));

// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// config/db.js
>>>>>>> 92ff5560c96678a4263b0dd23356533b43678c6e
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
<<<<<<< HEAD
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Routes
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
=======

dotenv.config();
>>>>>>> 92ff5560c96678a4263b0dd23356533b43678c6e

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true,
}));
app.use(express.json());

<<<<<<< HEAD
// Health check
app.get('/', (req, res) => {
  res.send('🚀 Backend API is running');
});

// Route mounting
app.use('/api', uploadRoutes);
app.use('/api/auth', authRoutes);

// MongoDB connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
=======
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.log('❌ MongoDB error:', err.message);
});

//app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/authRoutes'));
>>>>>>> 92ff5560c96678a4263b0dd23356533b43678c6e


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
