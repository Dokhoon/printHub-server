const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    }
  ],
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  totalPrice: { type: Number, required: true }, // total for all items
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
