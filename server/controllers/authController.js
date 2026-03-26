// // controllers/authController.js
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//    const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     res.json({ token, user: { id: user._id, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// const register = async (req, res) => {
//   res.send("Register route works");
// };

// const login = async (req, res) => {
//   res.send("Login route works");
// };

// module.exports = { register, login };


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
const register = async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, password, languages } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      languages: languages || []
    });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Server error");
  // }

  }catch (err) {
  console.error("Login error:", err.message);
  res.status(500).json({ msg: "Server error", error: err.message });
}

};

// Login
 const login = async (req, res) => {
  try {
    console.log("📥 Login request body:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    console.log("✅ Password matched, generating token...");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();

    res.json({ msg: "Login successful", token });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).send("Server error");
  }
};



const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
module.exports = { register, login, getCurrentUser};