import express from 'express';
import User from '../models/User.js';
const { protect, admin } = require('../middleware/auth.js');

const router = express.Router();

const PAGE_SIZE = 10;

router.get('/', protect, admin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * PAGE_SIZE;

  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(PAGE_SIZE);

  const total = await User.countDocuments();

  res.json({
    users,
    page,
    pages: Math.ceil(total / PAGE_SIZE),
    total,
  });
});

router.get('/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

router.put('/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, email, role, interests } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.interests = interests || user.interests;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    interests: updatedUser.interests,
  });
});

router.delete('/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await user.deleteOne();
  res.json({ message: 'User removed' });
});

export default router;
