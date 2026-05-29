const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const stripUnsafeChars = (value = '') =>
  value
    .replace(/<[^>]*>?/gm, '')
    .replace(/[^\w\s.'-]/g, '')
    .trim();

const register = async (req, res) => {
  const name = stripUnsafeChars(req.body.name);
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const role = String(req.body.role || '').trim().toLowerCase();

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, role });
  const token = generateToken({ id: user._id, role: user.role });

  return res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

const login = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user._id, role: user.role });
  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

module.exports = { register, login };
