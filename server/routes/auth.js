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

 const express = require('express');
const router = express.Router();

// Example: simple check (later you will replace with DB check)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // TODO: Replace with real DB user check
  if (email && password) {
    return res.status(200).json({
      token: 'fake-jwt-token',
      user: { email }
    });
  }

  return res.status(400).json({ msg: 'Email and password required' });
});

module.exports = router;

