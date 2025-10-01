const router = require('express').Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// Create note
router.post('/', auth, async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, user: req.user.id });
    res.json(note);
  } catch (err) {
    console.error(err); res.status(500).json({ msg: 'Server error' });
  }
});

// List notes with optional search q
router.get('/', auth, async (req, res) => {
  try {
    const q = req.query.q || '';
    const filter = { user: req.user.id };
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { content: new RegExp(q, 'i') }];
    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err); res.status(500).json({ msg: 'Server error' });
  }
});

// Get single note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id) return res.status(404).json({ msg: 'Not found' });
    res.json(note);
  } catch (err) {
    console.error(err); res.status(500).json({ msg: 'Server error' });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id) return res.status(404).json({ msg: 'Not found' });
    Object.assign(note, req.body);
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err); res.status(500).json({ msg: 'Server error' });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id) return res.status(404).json({ msg: 'Not found' });
    await note.remove();
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err); res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
