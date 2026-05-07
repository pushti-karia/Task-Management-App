const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @desc  Register user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user._id), user });
  } catch (err) { next(err); }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ token: generateToken(user._id), user });
  } catch (err) { next(err); }
};

// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => res.json(req.user);

// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (err) { next(err); }
};

// @desc  Change password
// @route PUT /api/auth/password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) { next(err); }
};

// @desc  Search users (for inviting to boards)
// @route GET /api/auth/search?q=email
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const users = await User.find({
      $or: [
        { email: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
      ],
      _id: { $ne: req.user._id },
    }).select('name email avatar').limit(10);
    res.json(users);
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, updateProfile, changePassword, searchUsers };
