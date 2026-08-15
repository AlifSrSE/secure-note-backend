import express from 'express';
import Note from '../models/Note.js';
const { protect, admin } = require('../middleware/auth.js');

const router = express.Router();

const PAGE_SIZE = 10;

router.get('/', protect, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * PAGE_SIZE;

  let query = {};
  if (req.user.role !== 'admin') {
    query.user = req.user._id;
  }

  const notes = await Note.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(PAGE_SIZE)
    .populate('user', 'name email');

  const total = await Note.countDocuments(query);

  res.json({
    notes,
    page,
    pages: Math.ceil(total / PAGE_SIZE),
    total,
  });
});

router.get('/:id', protect, async (req, res) => {
  let note = await Note.findById(req.params.id).populate('user', 'name email');

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (req.user.role !== 'admin' && note.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json(note);
});

router.post('/', protect, async (req, res) => {
  const note = await Note.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json(note);
});

router.put('/:id', protect, async (req, res) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (req.user.role !== 'admin' && note.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json(note);
});

router.delete('/:id', protect, async (req, res) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (req.user.role !== 'admin' && note.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await note.deleteOne();
  res.json({ message: 'Note removed' });
});

export default router;
