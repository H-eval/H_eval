
//  const express = require('express');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// const router = express.Router();

// // LOGIN route
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ msg: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ msg: 'Invalid password' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token, user: { email: user.email } });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;

//  const express = require('express');
// const router = express.Router();

// Example: simple check (later you will replace with DB check)
// router.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   // TODO: Replace with real DB user check
//   if (email && password) {
//     return res.status(200).json({
//       token: 'fake-jwt-token',
//       user: { email }
//     });
//   }

//   return res.status(400).json({ msg: 'Email and password required' });
// });

// router.post('/login', async (req, res) => {
//   console.log("Login body received:", req.body);
//   const { email, password } = req.body;
  
//   if (!email || !password) {
//     return res.status(400).json({ msg: 'Please provide email and password' });
//   }

//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(400).json({ msg: 'Invalid credentials' });
//   }

//   // If using bcrypt
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).json({ msg: 'Invalid credentials' });
//   }

//   res.json({ token: 'jwt-token-here', user });
// });

// module.exports = router;

// const express = require('express');
// const bcrypt = require('bcryptjs'); // make sure this is installed
// const router = express.Router();
// const User = require('../models/User');

// // REGISTER
// router.post('/register', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ msg: 'Please provide email and password' });
//     }

//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     // ✅ Hash password before saving
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = new User({ email, password: hashedPassword });
//     await user.save();

//     res.status(201).json({ msg: 'User registered successfully' });

//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User'); // Adjust path if needed

// REGISTER
router.post('/register', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide name, email, and password' });
    }

    // Trim email
    email = email.trim().toLowerCase();

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    email = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'defaultsecret', // use env secret
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
