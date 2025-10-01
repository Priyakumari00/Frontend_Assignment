const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Register
router.post('/register',
  body('name').notEmpty().trim(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password } = req.body;
    try {
      if (await User.findOne({ email })) return res.status(400).json({ msg: 'User already exists' });
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = await User.create({ name, email, password: hash });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, cookieOptions);
      res.json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      console.error(err); res.status(500).json({ msg: 'Server error' });
    }
  });

// Login
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, cookieOptions);
      res.json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      console.error(err); res.status(500).json({ msg: 'Server error' });
    }
  });

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', cookieOptions);
  res.json({ msg: 'Logged out' });
});

// Me
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    console.error(err); res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
