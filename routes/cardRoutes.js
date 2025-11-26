const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const adminAuth = require('../middleware/auth'); // Only admins

// Create a new card
router.post('/', adminAuth, async (req, res) => {
  try {
    const newCard = new Card(req.body);
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all cards (admin can see all)
router.get('/', adminAuth, async (req, res) => {
  const cards = await Card.find();
  res.json(cards);
});

// Update card
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete card
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
