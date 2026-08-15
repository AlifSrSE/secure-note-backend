import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
const { protect, admin } = require('../middleware/auth.js');

const router = express.Router();

router.get('/users-by-interest', protect, admin, async (req, res) => {
  const pipeline = [
    { $unwind: '$interests' },
    {
      $group: {
        _id: '$interests',
        users: { $push: { _id: '$_id', name: '$name', email: '$email' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];

  const result = await User.aggregate(pipeline);
  res.json(result);
});

router.get('/user-posts/:userId', protect, async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== 'admin' && userId !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const pipeline = [
    { $match: { user: require('mongoose').Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'author',
      },
    },
    { $unwind: '$author' },
    {
      $project: {
        title: 1,
        content: 1,
        createdAt: 1,
        authorName: '$author.name',
        authorEmail: '$author.email',
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  const posts = await Post.aggregate(pipeline);
  res.json(posts);
});

export default router;
