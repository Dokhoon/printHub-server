const Card = require("../models/Card");

// Get all cards (show even if stock is 0)
const getCards = async (req, res) => {
  try {
    const cards = await Card.find(); // remove { available: true }
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Create new card
const createCard = async (req, res) => {
  try {
    const newCard = new Card(req.body);
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update card
const updateCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete card
const deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Check stock for card
const checkStock = async (req, res) => {
  try {
    const { id, quantity } = req.body;

    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ error: "Card not found" });

    if (!card.available)
      return res.status(400).json({ error: "Card is not available" });

    if (quantity % 20 !== 0)
      return res.status(400).json({ error: "Quantity must be multiple of 20" });

    if (card.stock < quantity)
      return res.status(400).json({ error: "Not enough stock" });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Search cards
const searchCards = async (req, res) => {
  try {
    const query = req.query.q || "";

    const results = await Card.find({
      title: { $regex: query, $options: "i" }  
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  checkStock,
  searchCards
};
