const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// ADD item (protected)
router.post('/', auth, async (req, res) => {
  try {
    const item = new Item({ ...req.body, userId: req.user.id });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error adding item' });
  }
});

// GET all items (protected)
router.get('/', auth, async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// SEARCH items by name
router.get('/search', auth, async (req, res) => {
  const { name } = req.query;
  const items = await Item.find({ itemName: { $regex: name, $options: 'i' } });
  res.json(items);
});

// GET item by ID (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

// UPDATE item (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error updating' });
  }
});

// DELETE item (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting' });
  }
});

module.exports = router;